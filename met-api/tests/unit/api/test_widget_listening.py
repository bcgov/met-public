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

"""Tests to verify the Widget Timeline API end-point.

Test-Suite to ensure that the Widget Timeline API endpoint
is working as expected.
"""
import json
from http import HTTPStatus
from unittest.mock import patch

from faker import Faker

from met_api.exceptions.business_exception import BusinessException
from met_api.services.widget_listening_service import WidgetListeningService
from met_api.utils.enums import ContentType
from tests.utilities.factory_scenarios import TestJwtClaims, TestWidgetListening, TestWidgetInfo
from tests.utilities.factory_utils import (
    factory_auth_header, factory_engagement_model, factory_widget_model,
    factory_widget_listening_model)


fake = Faker()


def test_create_listening_widget(client, jwt, session,
                                setup_admin_user_and_claims):  # pylint:disable=unused-argument
    """Assert that Who is Listening widget can be POSTed."""
    user, claims = setup_admin_user_and_claims
    engagement = factory_engagement_model()
    TestWidgetInfo.widget_listening['engagement_id'] = engagement.id
    widget = factory_widget_model(TestWidgetInfo.widget_listening)
    headers = factory_auth_header(jwt=jwt, claims=claims)

    listening_widget_info = TestWidgetListening.widget_listening

    data = {
        **listening_widget_info,
        'widget_id': widget.id,
        'engagement_id': engagement.id,
        'description': 'test description',
    }

    rv = client.post(
        f'/api/widgets/{widget.id}/timelines',
        data=json.dumps(data),
        headers=headers,
        content_type=ContentType.JSON.value
    )
    assert rv.status_code == HTTPStatus.OK.value
    assert rv.json.get('engagement_id') == engagement.id

    with patch.object(WidgetListeningService, 'create_timeline',
                      side_effect=BusinessException('Test error', status_code=HTTPStatus.BAD_REQUEST)):
        rv = client.post(
            f'/api/widgets/{widget.id}/timelines',
            data=json.dumps(data),
            headers=headers,
            content_type=ContentType.JSON.value
        )
    assert rv.status_code == HTTPStatus.BAD_REQUEST


def test_get_timeline(client, jwt, session):  # pylint:disable=unused-argument
    """Assert that Who is Listening widget can be fetched."""
    engagement = factory_engagement_model()
    TestWidgetInfo.widget_timeline['engagement_id'] = engagement.id
    widget = factory_widget_model(TestWidgetInfo.widget_timeline)

    headers = factory_auth_header(jwt=jwt, claims=TestJwtClaims.no_role)

    listening_widget_info = TestWidgetListening.widget_listening

    widget_listening = factory_widget_listening_model({
        'widget_id': widget.id,
        'engagement_id': engagement.id,
        'description': listening_widget_info.get('description'),
    })

    rv = client.get(
        f'/api/widgets/{widget.id}/listening_widgets',
        headers=headers,
        content_type=ContentType.JSON.value
    )

    assert rv.status_code == HTTPStatus.OK
    assert rv.json[0].get('id') == widget_listening.id

    with patch.object(WidgetListeningService, 'get_listening_widget',
                      side_effect=BusinessException('Test error', status_code=HTTPStatus.BAD_REQUEST)):
        rv = client.get(
            f'/api/widgets/{widget.id}/listening_widgets',
            headers=headers,
            content_type=ContentType.JSON.value
        )
    assert rv.status_code == HTTPStatus.BAD_REQUEST


def test_patch_listening(client, jwt, session,
                        setup_admin_user_and_claims):  # pylint:disable=unused-argument
    """Assert that a Who is Listening widget can be PATCHed."""
    user, claims = setup_admin_user_and_claims
    engagement = factory_engagement_model()
    TestWidgetInfo.widget_listening['engagement_id'] = engagement.id
    widget = factory_widget_model(TestWidgetInfo.widget_listening)

    listening_widget_info = TestWidgetListening.widget_listening

    widget_listening = factory_widget_listening_model({
        'widget_id': widget.id,
        'engagement_id': engagement.id,
        'description': listening_widget_info.get('description'),
    })

    headers = factory_auth_header(jwt=jwt, claims=claims)

    listening_edits = {
        'description': fake.text(max_nb_chars=20),
    }

    rv = client.patch(f'/api/widgets/{widget.id}/listening_widgets/{widget_listening.id}',
                      data=json.dumps(listening_edits),
                      headers=headers, content_type=ContentType.JSON.value)

    assert rv.status_code == HTTPStatus.OK

    rv = client.get(
        f'/api/widgets/{widget.id}/listening_widgets',
        headers=headers,
        content_type=ContentType.JSON.value
    )
    assert rv.status_code == HTTPStatus.OK
    assert rv.json[0].get('description') == listening_edits.get('description')

    with patch.object(WidgetListeningService, 'update_listening_widget',
                      side_effect=BusinessException('Test error', status_code=HTTPStatus.BAD_REQUEST)):
        rv = client.patch(f'/api/widgets/{widget.id}/listening_widgets/{widget_listening.id}',
                          data=json.dumps(listening_edits),
                          headers=headers, content_type=ContentType.JSON.value)
    assert rv.status_code == HTTPStatus.BAD_REQUEST
