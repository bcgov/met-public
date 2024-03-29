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
"""MET Engagement Closure."""
from datetime import datetime

from met_api.services.engagement_service import EngagementService


class MetEngagementCloseout:  # pylint:disable=too-few-public-methods
    """Task to handles Engagement due closure."""

    @classmethod
    def do_closeout(cls):
        """Perform the engagement closeout report."""
        print('Starting Met Engagement Closeout at------------------------', datetime.now())

        EngagementService.close_engagements_due()
