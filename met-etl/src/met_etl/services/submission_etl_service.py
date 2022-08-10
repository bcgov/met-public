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

from met_etl.models.db import db
from met_etl.models.response_type_radio import ResponseTypeRadio as MetResponseTypeRadioModel
from met_etl.models.response_type_selectbox import ResponseTypeSelectbox as MetResponseTypeSelectboxModel
from met_etl.models.response_type_textfield import ResponseTypeTextfield as MetResponseTypeTextModel


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

        new_submissions = db.session.query(MetSubmissionModel).filter(
            MetSubmissionModel.updated_date > time_delta).all()

        if not new_submissions:
            current_app.logger.info('No New Submissions Found.')
            return
        current_app.logger.info('Total updated submissions Found : %s.', len(new_submissions))

        for submission in new_submissions:
            survey = db.session.query(MetSurveyModel).filter(MetSurveyModel.id == submission.survey_id).first()
            current_app.logger.info('Submission found for survey : %s.', survey.id)
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

                elif component['type'] == 'simplecheckboxes':
                    # selectbox answer is a list.so values have to be found from question
                    # answers is another dict if the question is simple chekboxes
                    for answer in answer_key:
                        # each answer is a row for simplebox.It belongs to answer in a multiple checkbox
                        if answer == 'True':
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
