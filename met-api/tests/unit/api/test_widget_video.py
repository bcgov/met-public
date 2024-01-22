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

"""Tests to verify the Widget Video API end-point.

Test-Suite to ensure that the Widget Video API endpoint
is working as expected.
"""
import json
from http import HTTPStatus
from unittest.mock import patch

from faker import Faker

from met_api.utils.enums import ContentType
from met_api.exceptions.business_exception import BusinessException
from met_api.services.widget_video_service import WidgetVideoService
from tests.utilities.factory_scenarios import TestJwtClaims, TestWidgetInfo, TestWidgetVideo
from tests.utilities.factory_utils import (
    factory_auth_header, factory_engagement_model, factory_video_model, factory_widget_model)


fake = Faker()


def test_create_video_widget(client, jwt, session,
                             setup_admin_user_and_claims):  # pylint:disable=unused-argument
    """Assert that widget video can be POSTed."""
    user, claims = setup_admin_user_and_claims
    engagement = factory_engagement_model()
    TestWidgetInfo.widget_video['engagement_id'] = engagement.id
    widget = factory_widget_model(TestWidgetInfo.widget_video)
    video_info = TestWidgetVideo.video1
    headers = factory_auth_header(jwt=jwt, claims=claims)

    data = {
        **video_info,
        'widget_id': widget.id,
        'engagement_id': engagement.id,
    }

    rv = client.post(
        f'/api/widgets/{widget.id}/videos',
        data=json.dumps(data),
        headers=headers,
        content_type=ContentType.JSON.value
    )
    assert rv.status_code == HTTPStatus.OK.value
    assert rv.json.get('video_url') == video_info.get('video_url')

    with patch.object(WidgetVideoService, 'create_video',
                      side_effect=BusinessException('Test error', status_code=HTTPStatus.BAD_REQUEST)):
        rv = client.post(
            f'/api/widgets/{widget.id}/videos',
            data=json.dumps(data),
            headers=headers,
            content_type=ContentType.JSON.value
        )
    assert rv.status_code == HTTPStatus.BAD_REQUEST


def test_get_video(client, jwt, session):  # pylint:disable=unused-argument
    """Assert that video can be fetched."""
    engagement = factory_engagement_model()
    TestWidgetInfo.widget_video['engagement_id'] = engagement.id
    widget = factory_widget_model(TestWidgetInfo.widget_video)

    headers = factory_auth_header(jwt=jwt, claims=TestJwtClaims.no_role)

    video = factory_video_model({
        **TestWidgetVideo.video1,
        'widget_id': widget.id,
        'engagement_id': engagement.id,
    })

    rv = client.get(
        f'/api/widgets/{widget.id}/videos',
        headers=headers,
        content_type=ContentType.JSON.value
    )

    assert rv.status_code == HTTPStatus.OK
    assert rv.json[0].get('id') == video.id

    with patch.object(WidgetVideoService, 'get_video',
                      side_effect=BusinessException('Test error', status_code=HTTPStatus.BAD_REQUEST)):
        rv = client.get(
            f'/api/widgets/{widget.id}/videos',
            headers=headers,
            content_type=ContentType.JSON.value
        )
    assert rv.status_code == HTTPStatus.BAD_REQUEST


def test_patch_video(client, jwt, session,
                     setup_admin_user_and_claims):  # pylint:disable=unused-argument
    """Assert that a video can be PATCHed."""
    user, claims = setup_admin_user_and_claims
    engagement = factory_engagement_model()
    TestWidgetInfo.widget_video['engagement_id'] = engagement.id
    widget = factory_widget_model(TestWidgetInfo.widget_video)

    video = factory_video_model({
        **TestWidgetVideo.video1,
        'widget_id': widget.id,
        'engagement_id': engagement.id,
    })

    headers = factory_auth_header(jwt=jwt, claims=claims)

    video_edits = {
        'description': fake.text(max_nb_chars=20),
        'video_url': fake.url(),
    }

    rv = client.patch(f'/api/widgets/{widget.id}/videos/{video.id}',
                      data=json.dumps(video_edits),
                      headers=headers, content_type=ContentType.JSON.value)

    assert rv.status_code == HTTPStatus.OK

    rv = client.get(
        f'/api/widgets/{widget.id}/videos',
        headers=headers,
        content_type=ContentType.JSON.value
    )
    assert rv.status_code == HTTPStatus.OK
    assert rv.json[0].get('description') == video_edits.get('description')

    with patch.object(WidgetVideoService, 'update_video',
                      side_effect=BusinessException('Test error', status_code=HTTPStatus.BAD_REQUEST)):
        rv = client.patch(f'/api/widgets/{widget.id}/videos/{video.id}',
                          data=json.dumps(video_edits),
                          headers=headers, content_type=ContentType.JSON.value)
    assert rv.status_code == HTTPStatus.BAD_REQUEST
