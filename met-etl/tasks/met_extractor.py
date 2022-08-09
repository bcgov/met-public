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
"""MET Extractions."""
from datetime import datetime, timedelta

from flask import current_app
from met_api.constants.engagement_status import Status as EngagementStatus
from met_api.models.engagement import Engagement as MetEngagementModel
from met_api.models.submission import Submission as MetSubmissionModel
from met_api.models.survey import Survey as MetSurveyModel

from met_etl.models.db import db
from met_etl.services.engagement_etl_service import EngagementEtlService
from met_etl.services.submission_etl_service import SubmissionEtlService
from met_etl.services.survey_etl_service import SurveyEtlService
from met_etl.services.survey_form_etl_service import SurveyFormEtlService


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
            EngagementEtlService.do_etl_engagement(updated_engagements)

        if new_surveys:
            SurveyEtlService.do_etl_survey(new_surveys)
            SurveyFormEtlService.do_etl_inputs(new_surveys)
        # find new MetSubmissionModel
        new_submissions = db.session.query(MetSubmissionModel).filter(
            MetSubmissionModel.id == 32).all()  # TODO move this to updated.
        if new_submissions:
            SubmissionEtlService.do_etl_submissions(new_submissions)
