# Copyright © 2019 Province of British Columbia
#
# Licensed under the Apache License, Version 2.0 (the 'License');
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an 'AS IS' BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
"""Service to do ETL on e."""
from datetime import timedelta, datetime
from typing import List

from flask import current_app
from met_api.models.submission import Submission as MetSubmissionModel
from met_api.models.survey import Survey as MetSurveyModel
from met_api.models.user import User as UserModel
from met_cron.models.response_type_radio import ResponseTypeRadio as ResponseTypeRadioModel
from met_cron.models.response_type_selectbox import ResponseTypeSelectbox as ResponseTypeSelectboxModel
from met_cron.models.response_type_textarea import ResponseTypeTextarea as ResponseTypeTextareaModel


from met_cron.models.db import db
from met_cron.models.user_response_detail import UserResponseDetail as UserResponseDetailModel
from met_cron.models.survey import Survey as EtlSurvey
from met_cron.utils import FormIoComponentType


class SubmissionEtlService:  # pylint: disable=too-few-public-methods
    """ETL Service on Submissions."""

    @staticmethod
    def do_etl_submissions():
        """Perform the ETL on submissions.

            1.Extract data out of submission.
            2.Iterate form_json.components.
            3.Check Type and save to db

        """
        new_submissions: List[MetSubmissionModel] = SubmissionEtlService._find_new_submissions()

        if not new_submissions:
            current_app.logger.info('No New Submissions Found.')
            return
        current_app.logger.info('Total updated submissions Found : %s.', len(new_submissions))

        SubmissionEtlService._extract_answers(new_submissions)
        SubmissionEtlService.etl_user_response_details(new_submissions)

    @staticmethod
    def etl_user_response_details(new_submissions):
        for submission in new_submissions:
            met_survey:MetSurveyModel = db.session.query(MetSurveyModel).filter(MetSurveyModel.id == submission.survey_id).first()
            etl_survey: EtlSurvey = EtlSurvey.find_active_by_source_id(met_survey.id)
            current_app.logger.info(
                '<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<User Response Detail Extraction starting for Submission id %s . Survey : %s.',
                submission.id, met_survey.id)
            # submission without survey is probably an old updated survey not beiing loaded to analytics db.Wont happen in prod
            if not etl_survey or not met_survey:
                current_app.logger.info(
                    '<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<Skipping User Response Detail Extraction  for Submission id %s . Survey Not Found in Analytics DB : %s.Probably a very old survey',
                    submission.id,
                    met_survey.id)
                continue

            current_app.logger.info('Creating new UserResponseDetailModel in Analytics DB: %s.', submission.id)
            SubmissionEtlService.load_user_responses(etl_survey, met_survey, submission)

    @staticmethod
    def load_user_responses(etl_survey, met_survey, submission):
        user_response_detail: UserResponseDetailModel = UserResponseDetailModel()
        user_response_detail.survey_id = etl_survey.id
        user_response_detail.engagement_id = met_survey.engagement_id
        user_response_detail.user_id = submission.user_id
        user_response_detail.flush()
        db.session.commit()
        return user_response_detail

    @staticmethod
    def _extract_answers(new_submissions):
        for submission in new_submissions:
            met_survey = db.session.query(MetSurveyModel).filter(MetSurveyModel.id == submission.survey_id).first()
            etl_survey = EtlSurvey.find_active_by_source_id(met_survey.id)
            current_app.logger.info(
                '<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<Extraction starting for Submission id %s . Survey : %s.',
                submission.id, met_survey.id)
            # submission without survey is probably an old updated survey not beiing loaded to analytics db.Wont happen in prod
            if not etl_survey or not met_survey:
                current_app.logger.info(
                    '<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<Skipping Extraction  for Submission id %s . Survey Not Found in Analytics DB : %s.Probably a very old survey',
                    submission.id,
                    met_survey.id)
                continue

            if (form_questions := met_survey.form_json.get('components', None)) is None:
                # throw error or notify by logging
                current_app.logger.info('Survey Found without any component in form_json: %s.Skipping it',
                                        met_survey.id)
                continue

            user = db.session.query(UserModel).filter(UserModel.id == submission.user_id).first()
            current_app.logger.info('User : %s Found for submission id : %s with mappedd user id %s', user,
                                    submission.id, submission.user_id)

            for component in form_questions:
                # go thru each component type and check for answer in the submission_json.
                # instead of going through each answer and iterate , we find the questions from the form and try to get the answer.
                SubmissionEtlService._load_components(component, etl_survey, submission, user)
            current_app.logger.info(
                '>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Extraction Done for Submission id %s . Survey : %s.',
                submission.id, met_survey.id)

            db.session.commit()

    @staticmethod
    def _load_components(component, etl_survey, submission, user):
        if not (answer_key := submission.submission_json.get(component['key'])):
            return
        component_type = component['inputType'].lower()
        current_app.logger.info('Type for submission id : %s. is %s ', submission.id, component_type)
        if component_type == FormIoComponentType.RADIO.value:
            SubmissionEtlService._save_radio(answer_key, component, etl_survey, user)
        elif component_type == FormIoComponentType.CHECKBOX.value:
            SubmissionEtlService._save_checkbox(answer_key, component, etl_survey, user)
        elif component_type == FormIoComponentType.TEXT.value:
            SubmissionEtlService._save_text(ResponseTypeTextareaModel, answer_key, component, etl_survey, user)
        else:
            current_app.logger.info('No Mapping Found for .Type for submission id : %s. is %s .Skipping',
                                    submission.id, component_type)

    @staticmethod
    def _find_new_submissions():
        time_delta_in_minutes: int = int(current_app.config.get('TIME_DELTA_IN_MINUTES'))
        time_delta = datetime.utcnow() - timedelta(minutes=time_delta_in_minutes)
        # submissions never gets updated.so use created_date
        new_submissions = db.session.query(MetSubmissionModel).filter(
            MetSubmissionModel.created_date > time_delta).all()
        return new_submissions

    @staticmethod
    def _save_text(model_type, answer_key, component, survey, user):
        # text answer is a string.so value has to be found from question
        print('--------', survey)
        current_app.logger.info('Input type  ResponseTypeTextModel is created:survey id: %s. '
                                'request_key is %s value:%s request_id:%s', survey.id, component['key'], answer_key,
                                component['id'])
        text_response: model_type = model_type(
            survey_id=survey.id,
            request_key=component['key'],
            value=answer_key,
            request_id=component['id'],
            user_id=getattr(user, 'id', None)
        )
        db.session.add(text_response)

    @staticmethod
    def _save_checkbox(answer_key, component, survey, user):
        # selectbox answer(answer_key) is a list.so values have to be found from question
        # answers is another dict if the question is simple chekboxes
        current_app.logger.info('Input type  ResponseTypeSelectboxModel is created:survey id: %s. '
                                'request_key is %s  Answer Key %s', survey.id, component['key'], answer_key)
        selectbox_mapping = {}
        for item in component.get('values'):
            selectbox_mapping[item.get('value')] = item.get('label')

        for key, value in answer_key.items():
            # each answer is a row for simplebox.It belongs to answer in a multiple checkbox
            is_yes = SubmissionEtlService._is_truthy(value)
            if is_yes:
                # need to find the label of the drop down.
                print(key, value)
                answer_label = selectbox_mapping.get(key)
                # persist it as a ResponseTypeSelectbox
                current_app.logger.info('Input type  ResponseTypeSelectboxModel is created:survey id: %s. '
                                        'request_key is %s value:%s request_id:%s', survey.id, component['key'],
                                        answer_label,
                                        component['id'])
                selectbox_response = ResponseTypeSelectboxModel(
                    survey_id=survey.id,
                    request_key=component['key'],
                    value=answer_label,
                    request_id=component['id'],
                    user_id=getattr(user, 'id', None)
                )
                db.session.add(selectbox_response)
                continue
            # need not to save if false

    @staticmethod
    def _save_radio(answer_key, component, survey, user):
        # radio answer is a key.so value has to be found from question
        current_app.logger.info('Input type  ResponseTypeRadioModel is created:survey id: %s. '
                                'request_key is %s ', survey.id, component['key'])
        answer = next((x for x in component.get('values') if x.get('value') == answer_key), None)
        if not answer:
            return
        answer_value = answer.get('label')
        current_app.logger.info('Input type  ResponseTypeRadioModel is created:survey id: %s. '
                                'request_key is %s value:%s request_id:%s', survey.id, component['key'],
                                answer_value,
                                component['id'])

        radio_response = ResponseTypeRadioModel(
            survey_id=survey.id,
            request_key=component['key'],
            value=answer_value,
            request_id=component['id'],
            user_id=getattr(user, 'id', None)
        )
        db.session.add(radio_response)

    @staticmethod
    def _is_truthy(answer):
        if type(answer) == 'str':
            is_yes = answer.casefold() == 'yes' or answer.casefold() == 'true'
        else:
            is_yes = answer is True
        return is_yes
