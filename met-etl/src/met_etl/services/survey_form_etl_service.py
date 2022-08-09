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
from typing import List

from met_api.models.survey import Survey as MetSurveyModel

from met_etl.models.db import db


class SurveyFormEtlService:  # pylint: disable=too-few-public-methods
    """ETL Service on surveys input forms."""

    @staticmethod
    def do_etl_inputs(surveys: List[MetSurveyModel]):
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
