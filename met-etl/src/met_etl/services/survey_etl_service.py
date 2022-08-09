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

from flask import current_app
from met_api.models.survey import Survey as MetSurveyModel

from met_etl.models.db import db
from met_etl.models.survey import Survey as EtlSurveyModel


class SurveyEtlService:  # pylint: disable=too-few-public-methods
    """ETL Service on Surveys."""

    @staticmethod
    def do_etl_survey(new_surveys: List[MetSurveyModel]):
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
            new_survey = SurveyEtlService._build_survey_obj(existing_survey)
            db.session.add(new_survey)
            db.session.commit()

    @staticmethod
    def _build_survey_obj(existing_survey):
        survey: MetSurveyModel = MetSurveyModel()
        survey.name = existing_survey.name
        survey.engagement_id = existing_survey.engagement_id
        survey.active_flag = 'Y'
        return survey
