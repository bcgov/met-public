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
from datetime import datetime

from met_cron.services.submission_etl_service import SubmissionEtlService


class MetExtractor:  # pylint:disable=too-few-public-methods
    """Task to run MET Extraction."""

    @classmethod
    def do_etl(cls):
        """Perform the ETL."""
        print('Starting Met Extractor at------------------------', datetime.now())

        # EngagementEtlService.do_etl_engagement()
        # SurveyEtlService.do_etl_surveys()
        SubmissionEtlService.do_etl_submissions()
