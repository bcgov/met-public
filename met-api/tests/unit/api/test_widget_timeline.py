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

from met_api.constants.timeline_event_status import TimelineEventStatus
from met_api.exceptions.business_exception import BusinessException
from met_api.services.widget_timeline_service import WidgetTimelineService
from met_api.utils.enums import ContentType
from tests.utilities.factory_scenarios import TestJwtClaims, TestTimelineInfo, TestWidgetInfo
from tests.utilities.factory_utils import (
    factory_auth_header, factory_engagement_model, factory_timeline_event_model, factory_widget_model,
    factory_widget_timeline_model)


fake = Faker()


def test_create_timeline_widget(client, jwt, session,
                                setup_admin_user_and_claims):  # pylint:disable=unused-argument
    """Assert that widget timeline can be POSTed."""
    user, claims = setup_admin_user_and_claims
    engagement = factory_engagement_model()
    TestWidgetInfo.widget_timeline['engagement_id'] = engagement.id
    widget = factory_widget_model(TestWidgetInfo.widget_timeline)
    timeline_info = TestTimelineInfo.timeline_event
    headers = factory_auth_header(jwt=jwt, claims=claims)

    events = [{
        **timeline_info,
        'widget_id': widget.id,
        'engagement_id': engagement.id,
    }]

    timeline_widget_info = TestTimelineInfo.widget_timeline

    data = {
        **timeline_widget_info,
        'widget_id': widget.id,
        'engagement_id': engagement.id,
        'events': events
    }

    rv = client.post(
        f'/api/widgets/{widget.id}/timelines',
        data=json.dumps(data),
        headers=headers,
        content_type=ContentType.JSON.value
    )
    assert rv.status_code == HTTPStatus.OK.value
    assert rv.json.get('engagement_id') == engagement.id

    with patch.object(WidgetTimelineService, 'create_timeline',
                      side_effect=BusinessException('Test error', status_code=HTTPStatus.BAD_REQUEST)):
        rv = client.post(
            f'/api/widgets/{widget.id}/timelines',
            data=json.dumps(data),
            headers=headers,
            content_type=ContentType.JSON.value
        )
    assert rv.status_code == HTTPStatus.BAD_REQUEST


def test_get_timeline(client, jwt, session):  # pylint:disable=unused-argument
    """Assert that timeline can be fetched."""
    engagement = factory_engagement_model()
    TestWidgetInfo.widget_timeline['engagement_id'] = engagement.id
    widget = factory_widget_model(TestWidgetInfo.widget_timeline)

    headers = factory_auth_header(jwt=jwt, claims=TestJwtClaims.no_role)

    timeline_widget_info = TestTimelineInfo.widget_timeline
    timeline_event_info = TestTimelineInfo.timeline_event

    widget_timeline = factory_widget_timeline_model({
        'widget_id': widget.id,
        'engagement_id': engagement.id,
        'title': timeline_widget_info.get('title'),
        'description': timeline_widget_info.get('description'),
    })

    factory_timeline_event_model({
        'widget_id': widget.id,
        'engagement_id': engagement.id,
        'timeline_id': widget_timeline.id,
        'status': timeline_event_info.get('status'),
        'position': timeline_event_info.get('position'),
        'description': timeline_event_info.get('description'),
        'time': timeline_event_info.get('time'),
    })

    rv = client.get(
        f'/api/widgets/{widget.id}/timelines',
        headers=headers,
        content_type=ContentType.JSON.value
    )

    assert rv.status_code == HTTPStatus.OK
    assert rv.json[0].get('id') == widget_timeline.id
    assert len(rv.json[0]['events']) == 1

    with patch.object(WidgetTimelineService, 'get_timeline',
                      side_effect=BusinessException('Test error', status_code=HTTPStatus.BAD_REQUEST)):
        rv = client.get(
            f'/api/widgets/{widget.id}/timelines',
            headers=headers,
            content_type=ContentType.JSON.value
        )
    assert rv.status_code == HTTPStatus.BAD_REQUEST


def test_patch_timeline(client, jwt, session,
                        setup_admin_user_and_claims):  # pylint:disable=unused-argument
    """Assert that a timeline can be PATCHed."""
    user, claims = setup_admin_user_and_claims
    engagement = factory_engagement_model()
    TestWidgetInfo.widget_video['engagement_id'] = engagement.id
    widget = factory_widget_model(TestWidgetInfo.widget_video)

    timeline_widget_info = TestTimelineInfo.widget_timeline
    timeline_event_info = TestTimelineInfo.timeline_event

    widget_timeline = factory_widget_timeline_model({
        'widget_id': widget.id,
        'engagement_id': engagement.id,
        'title': timeline_widget_info.get('title'),
        'description': timeline_widget_info.get('description'),
    })

    timeline_event = factory_timeline_event_model({
        'widget_id': widget.id,
        'engagement_id': engagement.id,
        'timeline_id': widget_timeline.id,
        'status': timeline_event_info.get('status'),
        'position': timeline_event_info.get('position'),
        'description': timeline_event_info.get('description'),
        'time': timeline_event_info.get('time'),
    })

    headers = factory_auth_header(jwt=jwt, claims=claims)

    timeline_edits = {
        'title': fake.name(),
        'description': fake.text(max_nb_chars=20),
        'events': [{
            'widget_id': widget.id,
            'engagement_id': engagement.id,
            'timeline_id': widget_timeline.id,
            'status': timeline_event_info.get('status'),
            'position': TimelineEventStatus.Completed.value,
            'description': timeline_event_info.get('description'),
            'time': timeline_event_info.get('time'),
        }]
    }

    rv = client.patch(f'/api/widgets/{widget.id}/timelines/{timeline_event.id}',
                      data=json.dumps(timeline_edits),
                      headers=headers, content_type=ContentType.JSON.value)

    assert rv.status_code == HTTPStatus.OK

    rv = client.get(
        f'/api/widgets/{widget.id}/timelines',
        headers=headers,
        content_type=ContentType.JSON.value
    )
    assert rv.status_code == HTTPStatus.OK
    assert rv.json[0].get('description') == timeline_edits.get('description')
    assert len(rv.json[0]['events']) == 1

    with patch.object(WidgetTimelineService, 'update_timeline',
                      side_effect=BusinessException('Test error', status_code=HTTPStatus.BAD_REQUEST)):
        rv = client.patch(f'/api/widgets/{widget.id}/timelines/{timeline_event.id}',
                          data=json.dumps(timeline_edits),
                          headers=headers, content_type=ContentType.JSON.value)
    assert rv.status_code == HTTPStatus.BAD_REQUEST
