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

"""Tests to verify the Widget Map API end-point.

Test-Suite to ensure that the Widget Map API endpoint is working as expected.
"""
import json

from faker import Faker

from met_api.utils.enums import ContentType
from tests.utilities.factory_scenarios import TestWidgetMapInfo, TestJwtClaims, TestWidgetInfo
from tests.utilities.factory_utils import factory_auth_header, factory_map_model, factory_widget_model


fake = Faker()


def test_create_widget_map(client, jwt, session):  # pylint:disable=unused-argument
    """Assert that widget events can be POSTed."""
    map = factory_map_model()
    TestWidgetMapInfo.map_info['id'] = map.id
    widget = factory_map_model(TestWidgetInfo.widget1)
    map_info = TestWidgetMapInfo.map_info
    headers = factory_auth_header(jwt=jwt, claims=TestJwtClaims.no_role)

    data = {
        **map_info,
        'widget_id': widget.id,
    }

    rv = client.post(
        f'/api/widgets/{widget.id}/maps',
        data=json.dumps(data),
        headers=headers,
        content_type=ContentType.JSON.value
    )
    assert rv.status_code == 200
    response_map_info = rv.json
    assert response_map_info.get('description') == map_info.get('description')
    assert len(response_map_info.get('latitude')) == map_info.get('latitude')
    assert len(response_map_info.get('longitude')) == map_info.get('longitude')


def test_widget_map_update(client, jwt, session):  # pylint:disable=unused-argument
    """Assert that a widget events can be sorted."""
    engagement = factory_engagement_model()
    widget_info_1 = TestWidgetInfo.widget1
    widget_info_1['engagement_id'] = engagement.id
    widget = factory_widget_model(TestWidgetInfo.widget1)
    map_info = TestWidgetMapInfo.map_info
    headers = factory_auth_header(jwt=jwt, claims=TestJwtClaims.no_role)
    data = {
        **map_info,
        'widget_id': widget.id,
    }
    rv = client.post(
        f'/api/widgets/{widget.id}/maps',
        data=json.dumps(data),
        headers=headers,
        content_type=ContentType.JSON.value
    )
    assert rv.status_code == 200
    
    new_description = fake.paragraph()
    map_info['description'] = new_description
    patch_data = {
        **map_info,
        'widget_id': widget.id,
    }

    rv = client.patch(
        **map_info,
        f'/api/widgets/{widget.id}/maps',
        headers=headers,
        content_type=ContentType.JSON.value
    )
    assert rv.status_code == 200
    assert rv.json.get('description') == new_description
    