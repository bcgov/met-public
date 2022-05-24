# Copyright © 2019 Province of British Columbia
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
"""Tests for the Engagement service.

Test suite to ensure that the Engagement service routines are working as expected.
"""


from tests.utilities import factory_scenarios
from met_api.services.engagement import EngagementService

def test_create_engagement(session):  # pylint:disable=unused-argument
    """Assert that an Org can be created."""
    engagement = factory_engagement_model()
    org = EngagementService.create_engagement(engagement)
    assert org
    dictionary = org.as_dict()
    assert dictionary['name'] == TestOrgInfo.org1['name']