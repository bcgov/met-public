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
"""Tests for the Engagement model.

Test suite to ensure that the Engagement model routines are working as expected.
"""

from analytics_api.models import Engagement as EngagementModel
from tests.utilities.factory_utils import factory_engagement_model


def test_get_engagement_map_data(session):
    """Assert that an map data related to an engagement can be created and fetched."""
    eng = factory_engagement_model()
    assert eng.id is not None
    eng_existing = EngagementModel.find_by_id(eng.id)
    assert eng.latitude == eng_existing.latitude


def test_create_engagement_by_source_id(session):
    """Test creating an engagement by source identifier."""
    eng = factory_engagement_model()
    assert eng.id is not None

    # Check if the engagement can be retrieved by source identifier
    eng_by_source_id = EngagementModel.find_by_source_id(eng.source_engagement_id)
    assert len(eng_by_source_id) == 1
    assert eng_by_source_id[0].source_engagement_id == eng.source_engagement_id


def test_deactivate_engagement_by_source_id(session):
    """Test deactivating an engagement by source identifier."""
    eng = factory_engagement_model()
    assert eng.id is not None

    # Deactivate the engagement by source identifier
    num_deactivated = EngagementModel.deactivate_by_source_id(eng.source_engagement_id)
    assert num_deactivated == 1

    # Check if the deactivated engagement is not active anymore
    eng_by_source_id = EngagementModel.find_by_source_id(eng.source_engagement_id)
    assert len(eng_by_source_id) == 1
    assert not eng_by_source_id[0].is_active
