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

from met_api.services.engagement_service import EngagementService
from tests.utilities.factory_scenarios import TestEngagementInfo, TestUserInfo
from tests.utilities.factory_utils import factory_engagement_model


def test_create_engagement(session):  # pylint:disable=unused-argument
    """Assert that an Org can be created."""
    user_id = TestUserInfo.user['id']
    engagement_data = TestEngagementInfo.engagement1
    saved_engagament = EngagementService().create_engagement(engagement_data)
    # fetch the engagement with id and assert
    fetched_engagement = EngagementService().get_engagement(saved_engagament.identifier, user_id)
    assert fetched_engagement.get('id') == saved_engagament.identifier
    assert fetched_engagement.get('name') == engagement_data.get('name')
    assert fetched_engagement.get('description') == engagement_data.get('description')
    assert fetched_engagement.get('start_date')  # TODO address date format and assert
    assert fetched_engagement.get('end_date')


def test_patch_engagement(session):  # pylint:disable=unused-argument
    """Assert that an Org can be created."""
    saved_engagament = factory_engagement_model()
    engagement_edits = {
        'id': saved_engagament.id,
        'name': 'Updated engagement name'
    }
    assert engagement_edits['name'] != saved_engagament.name
    upadted_engagement = EngagementService().edit_engagement(engagement_edits)
    # fetch the engagement with id and assert
    assert upadted_engagement.name == engagement_edits['name']
