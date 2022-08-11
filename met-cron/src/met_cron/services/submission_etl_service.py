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

from met_cron.models.db import db
from met_cron.models.response_type_radio import ResponseTypeRadio as MetResponseTypeRadioModel
from met_cron.models.response_type_selectbox import ResponseTypeSelectbox as MetResponseTypeSelectboxModel
from met_cron.models.response_type_textfield import ResponseTypeTextfield as MetResponseTypeTextModel
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
        time_delta_in_minutes: int = int(current_app.config.get('TIME_DELTA_IN_MINUTES'))
        time_delta = datetime.utcnow() - timedelta(minutes=time_delta_in_minutes)

        # submissions never gets updated.so use created_date
        new_submissions = db.session.query(MetSubmissionModel).filter(
            MetSubmissionModel.id == 32).all()

        if not new_submissions:
            current_app.logger.info('No New Submissions Found.')
            return
        current_app.logger.info('Total updated submissions Found : %s.', len(new_submissions))

        for submission in new_submissions:
            survey = db.session.query(MetSurveyModel).filter(MetSurveyModel.id == submission.survey_id).first()
            current_app.logger.info('Submission id %s . Survey : %s.', submission.id, survey.id)
            form_questions = survey.form_json['components']
            user = db.session.query(UserModel).filter(UserModel.id == submission.user_id).first()
            for component in form_questions:
                # go thru each component type and check for answer in the submission_json.
                # instead of going through each answer and iterate , we find the questions from the form and try to get the answer.
                if not (answer_key := submission.submission_json.get(component['key'])):
                    continue
                component_type = component['type']
                if component_type == FormIoComponentType.RADIOS.value:
                    SubmissionEtlService._save_radio(answer_key, component, survey, user)
                elif component_type == FormIoComponentType.CHECKBOXES.value:
                    SubmissionEtlService._save_checkbox(answer_key, component, survey, user)
                elif component_type == FormIoComponentType.TEXT.value or component_type == FormIoComponentType.SIMPLE_TEXT.value:
                    SubmissionEtlService._save_text(answer_key, component, survey, user)
            db.session.commit()

    @staticmethod
    def _save_text(answer_key, component, survey, user):
        # text answer is a string.so value has to be found from question
        text_response: MetResponseTypeTextModel = MetResponseTypeTextModel(
            survey_id=survey.id,
            engagement_id=survey.engagement_id,
            request_key=component['key'],
            value=answer_key,
            active_flag='G',
            request_id=component['id'],
            user_id=user.id
        )
        db.session.add(text_response)

    @staticmethod
    def _save_checkbox(answer_key, component, survey, user):
        # selectbox answer(answer_key) is a list.so values have to be found from question
        # answers is another dict if the question is simple chekboxes
        for answer in answer_key:
            # each answer is a row for simplebox.It belongs to answer in a multiple checkbox
            is_yes = SubmissionEtlService._is_truthy(answer)
            if is_yes:
                answer_label = next((x for x in component.get('values') if x.value == answer_key),
                                    None).label
                # persist it as a ResponseTypeSelectbox
                selectbox_response = MetResponseTypeSelectboxModel(
                    survey_id=survey.id,
                    engagement_id=survey.engagement_id,
                    request_key=component['key'],
                    request_label=answer_label,
                    value=answer,
                    active_flag='G',
                    request_id=component['id'],
                    user_id=user.id
                )
                db.session.add(selectbox_response)
                continue
            # need not to save if false

    @staticmethod
    def _save_radio(answer_key, component, survey, user):
        # radio answer is a key.so value has to be found from question
        answer = next((x for x in component.get('values') if x.get('value') == answer_key), None)
        if not answer:
            return
        answer_value = answer.get('label')

        radio_response = MetResponseTypeRadioModel(
            survey_id=survey.id,
            engagement_id=survey.engagement_id,
            request_key=component['key'],
            value=answer_value,
            active_flag='G',
            request_id=component['id'],
            user_id=user.id)
        db.session.add(radio_response)

    @staticmethod
    def _is_truthy(answer):
        is_yes = False
        if type(answer) == 'str':
            is_yes = answer.casefold() == 'yes' or answer.casefold() == 'true'
        else:
            is_yes = answer == True
        return is_yes
