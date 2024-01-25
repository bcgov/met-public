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

Test-Suite to ensure that the Widget Map API endpoint
is working as expected.
"""
import json
from http import HTTPStatus

from faker import Faker
from unittest.mock import patch

from met_api.exceptions.business_exception import BusinessException
from met_api.services.widget_map_service import WidgetMapService
from met_api.utils.enums import ContentType
from tests.utilities.factory_scenarios import TestJwtClaims, TestWidgetInfo, TestWidgetMap
from tests.utilities.factory_utils import (
    factory_auth_header, factory_engagement_model, factory_widget_map_model, factory_widget_model)


fake = Faker()


def test_create_map_widget(client, jwt, session,
                           setup_admin_user_and_claims):  # pylint:disable=unused-argument
    """Assert that widget map can be POSTed."""
    user, claims = setup_admin_user_and_claims
    engagement = factory_engagement_model()
    TestWidgetInfo.widget_map['engagement_id'] = engagement.id
    widget = factory_widget_model(TestWidgetInfo.widget_map)
    map_info = TestWidgetMap.map1
    headers = factory_auth_header(jwt=jwt, claims=claims)

    data = {
        'latitude': map_info['latitude'],
        'longitude': map_info['longitude'],
        'engagement_id': engagement.id,
        'marker_label': map_info['marker_label'],
    }

    rv = client.post(
        f'/api/widgets/{widget.id}/maps',
        data=data,
        headers=headers,
        content_type=ContentType.FORM_URL_ENCODED.value
    )

    assert rv.status_code == HTTPStatus.OK.value
    assert float(rv.json.get('longitude')) == float(map_info.get('longitude'))

    with patch.object(WidgetMapService, 'create_map',
                      side_effect=BusinessException('Test error', status_code=HTTPStatus.BAD_REQUEST)):
        rv = client.post(
            f'/api/widgets/{widget.id}/maps',
            data=data,
            headers=headers,
            content_type=ContentType.FORM_URL_ENCODED.value
        )
    assert rv.status_code == HTTPStatus.BAD_REQUEST


def test_get_map(client, jwt, session):  # pylint:disable=unused-argument
    """Assert that map can be fetched."""
    engagement = factory_engagement_model()
    TestWidgetInfo.widget_map['engagement_id'] = engagement.id
    widget = factory_widget_model(TestWidgetInfo.widget_map)

    headers = factory_auth_header(jwt=jwt, claims=TestJwtClaims.no_role)

    map_widget_info = TestWidgetMap.map1

    widget_map = factory_widget_map_model({
        'widget_id': widget.id,
        'engagement_id': engagement.id,
        'longitude': map_widget_info.get('longitude'),
        'latitude': map_widget_info.get('latitude'),
        'marker_label': map_widget_info.get('marker_label'),
    })

    rv = client.get(
        f'/api/widgets/{widget.id}/maps',
        headers=headers,
        content_type=ContentType.JSON.value
    )

    assert rv.status_code == HTTPStatus.OK
    assert rv.json[0].get('id') == widget_map.id

    with patch.object(WidgetMapService, 'get_map',
                      side_effect=BusinessException('Test error', status_code=HTTPStatus.BAD_REQUEST)):
        rv = client.get(
            f'/api/widgets/{widget.id}/maps',
            headers=headers,
            content_type=ContentType.JSON.value
        )
    assert rv.status_code == HTTPStatus.BAD_REQUEST


def test_patch_map(client, jwt, session,
                   setup_admin_user_and_claims):  # pylint:disable=unused-argument
    """Assert that map can be PATCHed."""
    user, claims = setup_admin_user_and_claims
    engagement = factory_engagement_model()
    TestWidgetInfo.widget_map['engagement_id'] = engagement.id
    widget = factory_widget_model(TestWidgetInfo.widget_map)

    headers = factory_auth_header(jwt=jwt, claims=claims)

    map_widget_info = TestWidgetMap.map1

    factory_widget_map_model({
        'widget_id': widget.id,
        'engagement_id': engagement.id,
        'longitude': map_widget_info.get('longitude'),
        'latitude': map_widget_info.get('latitude'),
        'marker_label': map_widget_info.get('marker_label'),
    })

    map_edits = {
        'longitude': str(fake.longitude())
    }

    rv = client.patch(
        f'/api/widgets/{widget.id}/maps',
        data=json.dumps(map_edits),
        headers=headers,
        content_type=ContentType.JSON.value
    )
    assert rv.status_code == HTTPStatus.OK

    rv = client.get(
        f'/api/widgets/{widget.id}/maps',
        headers=headers,
        content_type=ContentType.JSON.value
    )

    assert rv.status_code == HTTPStatus.OK
    assert round(float(rv.json[0].get('longitude')), 5) == round(float(map_edits.get('longitude')), 5)

    with patch.object(WidgetMapService, 'update_map',
                      side_effect=BusinessException('Test error', status_code=HTTPStatus.BAD_REQUEST)):
        rv = client.patch(
            f'/api/widgets/{widget.id}/maps',
            data=json.dumps(map_edits),
            headers=headers,
            content_type=ContentType.JSON.value
        )
    assert rv.status_code == HTTPStatus.BAD_REQUEST
