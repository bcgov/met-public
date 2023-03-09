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

"""Tests to verify the User Service class.

Test-Suite to ensure that the UserService is working as expected.
"""
import pytest
from faker import Faker

from met_api.schemas.widget_map import MapSchema
from met_api.services.widget_map_service import WidgetMapService
from tests.utilities.factory_scenarios import TestWidgetMapInfo
from tests.utilities.factory_utils import factory_map_model

fake = Faker()

def test_get_map(client, jwt, session, ):  # pylint:disable=unused-argument
    """Assert that an user can be fetched."""
    map_details = factory_map_model()
    map: dict = WidgetMapService.get_map(map_details.widget_id)
    assert map.get('widget_id') == map_details.widget_id

def test_create_map(client, jwt, session, ):  # pylint:disable=unused-argument
    """Assert that an user can be Created."""
    map_data: dict = TestWidgetMapInfo.map_info
    map_schema = MapSchema().load(map_data)
    new_map = WidgetMapService().create(map_schema)
    assert new_map.map_id == map_data['id']
    assert new_map.description == map_data['description']


def test_update_map(client, jwt, session, ):  # pylint:disable=unused-argument
    """Assert that an user can be Created."""
    map_details = factory_map_model()
    old_description = map_details.description
    map_id = map_details.id
    # verify existing details
    map: dict = WidgetMapService.get_map(map_details.id)
    assert map_details.get('description') == old_description
    assert map.get('id') == map_id

    new_map_data = {
        'description': 'updated description',
        'longitude': 2,
        'latitude': 2,
    }
    map_schema = MapSchema().load(new_map_data)
    new_map = WidgetMapService().create(map_schema)

    # verify same user , but different email id
    assert new_map.description == map_details.description
    assert new_map.latitude == map_details.latitude
    assert new_map.longitude == map_details.longitude
