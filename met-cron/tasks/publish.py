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
"""Task to update the status of scheduled Engagements that are due for publish."""
from datetime import datetime

from met_api.services.engagement_service import EngagementService


class EngagementPublishTask:  # pylint:disable=too-few-public-methods
    """Task to update the status of scheduled Engagements that are due for publish."""

    @classmethod
    def do_publish(cls):
        """Update the status of scheduled engagements that are due for publish."""
        print('Starting Engagement Publish at------------------------', datetime.now())

        EngagementService.publish_scheduled_engagements()
