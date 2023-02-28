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

"""Tests to verify the Widget Event API end-point.

Test-Suite to ensure that the Widget Event API endpoint is working as expected.
"""
import json

from faker import Faker

from met_api.utils.enums import ContentType
from tests.utilities.factory_scenarios import TestEventnfo, TestJwtClaims, TestWidgetInfo
from tests.utilities.factory_utils import factory_auth_header, factory_engagement_model, factory_widget_model


fake = Faker()


def test_create_events(client, jwt, session):  # pylint:disable=unused-argument
    """Assert that widget events can be POSTed."""
    engagement = factory_engagement_model()
    TestWidgetInfo.widget1['engagement_id'] = engagement.id
    widget = factory_widget_model(TestWidgetInfo.widget1)
    event_info = TestEventnfo.event_meetup
    headers = factory_auth_header(jwt=jwt, claims=TestJwtClaims.no_role)

    data = {
        **event_info,
        'widget_id': widget.id,
    }

    rv = client.post(
        f'/api/widgets/{widget.id}/events',
        data=json.dumps(data),
        headers=headers,
        content_type=ContentType.JSON.value
    )
    assert rv.status_code == 200
    assert rv.json.get('title') == event_info.get('title')
    response_event_items = rv.json.get('event_items')
    assert len(response_event_items) == 1
    assert response_event_items[0].get('description') == event_info.get('items')[0].get('description')
