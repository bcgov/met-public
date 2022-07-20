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

from met_etl.models.survey import Survey
from met_api.models.engagement import Engagement

class MetExtractor:  # pylint:disable=too-few-public-methods
    """Task to link routing slips."""

    @classmethod
    def do_etl(cls):
        """Perform the ETL."""
        print(Survey.query.all())
        print('-------')
        print(Engagement.get_engagement('1'))
        print('--each engagement-----')
        for eng in Engagement.get_all_engagements():
            print(eng)

        
