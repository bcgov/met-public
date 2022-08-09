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

from datetime import datetime, timedelta
from typing import List

from flask import current_app
from met_api.constants.engagement_status import Status as EngagementStatus
from met_api.models.engagement import Engagement as MetEngagementModel
from met_api.models.submission import Submission as MetSubmissionModel
from met_api.models.survey import Survey as MetSurveyModel
from met_api.models.user import User as UserModel

from met_etl.models.db import db
from met_etl.models.engagement import Engagement as EtlEngagementModel
from met_etl.models.request_type_radio import RequestTypeRadio as MetRequestTypeRadioModel
from met_etl.models.request_type_selectbox import RequestTypeSelectbox as MetRequestTypeSelectBoxesModel
from met_etl.models.request_type_textarea import RequestTypeTextarea as MetRequestTypeTextAreaModel
from met_etl.models.request_type_textfield import RequestTypeTextfield as MetRequestTypeTextModel
from met_etl.models.response_type_radio import ResponseTypeRadio as MetResponseTypeRadioModel
from met_etl.models.response_type_selectbox import ResponseTypeSelectbox as MetResponseTypeSelectboxModel
from met_etl.models.response_type_textfield import ResponseTypeTextfield as MetResponseTypeTextModel
from met_etl.models.survey import Survey as EtlSurveyModel


class MetExtractor:  # pylint:disable=too-few-public-methods
    """Task to link routing slips."""

    @classmethod
    def do_etl(cls):
        """Perform the ETL."""

        print('Starting Met Extractor', db.engine.table_names())

        time_delta_in_minutes: int = int(current_app.config.get('TIME_DELTA_IN_MINUTES'))
        time_delta_in_minutes = 10000000
        time_delta = datetime.utcnow() - timedelta(minutes=time_delta_in_minutes)
        current_app.logger.info('Time Delta %s.', time_delta_in_minutes)
        updated_engagements = db.session.query(MetEngagementModel).filter(
            MetEngagementModel.updated_date > time_delta,
            MetEngagementModel.status_id != EngagementStatus.Draft.value).all()

        new_surveys = db.session.query(MetSurveyModel).filter(MetSurveyModel.id == 1112).all()
        if updated_engagements:
            pass
            # cls._do_etl_engagement(updated_engagements)
        if new_surveys:
            cls._do_etl_survey(new_surveys)
            cls._do_etl_inputs(new_surveys)
        # find new MetSubmissionModel
        new_submissions = db.session.query(MetSubmissionModel).filter(
            MetSubmissionModel.id == 32).all()  # TODO move this to updated.
        if new_submissions:
            cls._do_etl_submissions(new_submissions)

    @staticmethod
    def _do_etl_submissions(submissions: List[MetSubmissionModel]):
        """Perform the ETL on submissions.
        
            1.Extract data out of submssion_json.
            2.Iterate form_json.components.
            3.Check Type and save to db 
        
        """
        for submission in submissions:
            survey = db.session.query(MetSurveyModel).filter(MetSurveyModel.id == submission.survey_id).first()
            form_questions = survey.form_json['components']
            user = db.session.query(UserModel).filter(UserModel.id == submission.user_id).first()
            for component in form_questions:
                # go thru each component type and check for answer in the submission_json
                answer_key = submission.submission_json.get(component['key'])
                if not answer_key:
                    continue
                # now check type and save model to db
                if component['type'] == 'simpleradios':
                    # radio answer is a key.so value has to be found from question
                    answer_label = next((x for x in component.get('values') if x.value == answer_key), None).label
                    radio_response = MetResponseTypeRadioModel(
                        survey_id=survey.id,
                        engagement_id=survey.engagement_id,
                        key=component['key'],
                        value=answer_label,
                        active_flag=True,
                        request_id=component['id'],
                        user_id=user.id)
                    db.session.add(radio_response)
                    continue

                elif component['type'] == 'simplecheckboxes':
                    # selectbox answer is a list.so values have to be found from question
                    # answers is another dict if the question is simple chekboxes
                    for answer in answer_key:
                        # each answer is a row for simplebox.It belongs to answer in a multiple checkbox
                        if answer is 'True':
                            answer_label = next((x for x in component.get('values') if x.value == answer_key),
                                                None).label
                            # persist it as a ResponseTypeSelectbox
                            selectbox_response = MetResponseTypeSelectboxModel(
                                survey_id=survey.id,
                                engagement_id=survey.engagement_id,
                                request_key=component['key'],
                                request_value=answer,
                                active_flag=True,
                                request_id=component['id'],
                                user_id=user.id
                            )
                            db.session.add(selectbox_response)
                            continue
                        # need not to save if false
                        continue
                elif component['type'] == 'text' or component['type'] == 'simpletextfield':
                    # text answer is a string.so value has to be found from question
                    text_response = MetResponseTypeTextModel(
                        survey_id=survey.id,
                        engagement_id=survey.engagement_id,
                        key=component['key'],
                        value=answer_key,
                        active_flag=True,
                        request_id=component['id'],
                        user_id=user.id
                    )
                    db.session.add(text_response)
                    continue

    @staticmethod
    def _do_etl_inputs(surveys: List[MetSurveyModel]):
        """Perform the ETL on survey form and extract to questions.
        
        1.Extract data out of survey.form_json.
        2.Iterate form_json.components.
        3.Check Type and save to db
        """

        for survey in surveys:
            if survey.form_json is None:
                # throw error or notify by logging
                continue

            # check already if questions exists in DB for this survey.
            # update all MetRequestTypeRadioModel active_flag to N
            db.session.query(MetRequestTypeRadioModel).filter(MetRequestTypeRadioModel.survey_id == survey.id).update(
                {'active_flag': 'N'})
            db.session.query(MetRequestTypeSelectBoxesModel).filter(
                MetRequestTypeSelectBoxesModel.survey_id == survey.id).update({'active_flag': 'N'})
            db.session.query(MetRequestTypeTextModel).filter(MetRequestTypeTextModel.survey_id == survey.id).update(
                {'active_flag': 'N'})
            db.session.query(MetRequestTypeTextAreaModel).filter(
                MetRequestTypeTextAreaModel.survey_id == survey.id).update({'active_flag': 'N'})

            # extract data out of survey.form_json and save now
            for component in survey.form_json['components']:
                if component['type'] == 'simpleradios':  # TODO create enums
                    # radio save only the question label
                    radio_model: MetRequestTypeSelectBoxesModel = MetRequestTypeSelectBoxesModel(
                        survey_id=survey.id,
                        engagement_id=survey.engagement_id,
                        id=component['id'],
                        label=component['label'],
                        active_flag='Y',
                        key=component['key'],
                        type=component['type']
                    )
                    db.session.add(radio_model)

                elif component['type'] == 'simplecheckboxes':
                    # select box save only the question label
                    selectBoxModel: MetRequestTypeSelectBoxesModel = MetRequestTypeSelectBoxesModel(
                        survey_id=survey.id,
                        engagement_id=survey.engagement_id,
                        id=component['id'],
                        label=component['label'],
                        active_flag='Y',
                        key=component['key'],
                        type=component['type']
                    )
                    db.session.add(selectBoxModel)
                elif component['type'] == 'text' or component['type'] == 'simpletextfield':
                    # select box save only the question label
                    textModel: MetRequestTypeTextModel = MetRequestTypeTextModel(
                        survey_id=survey.id,
                        engagement_id=survey.engagement_id,
                        id=component['id'],
                        label=component['label'],
                        active_flag='Y',
                        key=component['key'],
                        type=component['type']
                    )
                    db.session.add(textModel)

    @staticmethod
    def _do_etl_engagement(updated_engagements: List[MetEngagementModel]):
        """Perform the ETL for Engagement.

        1). Find engagements
                    which are updated in last x mins.
                    which are not Draft
        2). Check if it already exists in DB
        3). If Yes, Inactivate the existing one , Create new  one
        4). If No, create it
        """
        engagement: MetEngagementModel
        for engagement in updated_engagements:
            existing_eng: EtlEngagementModel
            current_app.logger.info('Processing updated Engagement: %s.', engagement.id)
            if existing_eng := EtlEngagementModel.find_by_id(engagement.id):
                # deactivate the existing one
                current_app.logger.info('Found existing engagement Engagement in Analytics DB: %s.', engagement.id)
                existing_eng.active_flag = 'F'
                db.session.add(existing_eng)
            eng = MetExtractor._build_engagement(engagement)
            db.session.add(eng)
            db.session.commit()

    @staticmethod
    def _build_engagement(engagement):
        """Helper to Build the engagement."""
        eng: EtlEngagementModel = EtlEngagementModel()
        eng.id = engagement.id
        eng.name = engagement.name
        eng.start_date = engagement.start_date
        eng.end_date = engagement.end_date
        eng.status_name = 'Published'  # TODO remove hardcoded
        eng.active_flag = 'T'
        eng.published_date = engagement.published_date
        return eng

    @staticmethod
    def _do_etl_survey(new_surveys: List[MetSurveyModel]):
        """Perform the ETL for Engagement.

        1). Find survey using updated_date> now()
        2). Check if it already exists in DB
        3). If Yes, Inactivate the existing one , Create new  one
        4). If No, create it
        """
        survey: MetSurveyModel
        for survey in new_surveys:
            if existing_survey := EtlSurveyModel.find_by_id(survey.id):
                current_app.logger.info('Processing updated Survey: %s.', existing_survey.id)
                existing_survey.active_flag = 'F'
                db.session.add(existing_survey)
            current_app.logger.info('New Survey: %s.', survey.id)
            new_survey = MetExtractor._build_survey_obj(existing_survey)
            db.session.add(new_survey)
            db.session.commit()

    @staticmethod
    def _build_survey_obj(existing_survey):
        survey: MetSurveyModel = MetSurveyModel()
        survey.name = existing_survey.name
        survey.engagement_id = existing_survey.engagement_id
        survey.active_flag = 'Y'
        return survey
