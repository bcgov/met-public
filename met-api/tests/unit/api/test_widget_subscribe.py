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

"""Tests to verify the Widget Subscribe API end-point.

Test-Suite to ensure that the Widget Subscribe API endpoint is working as expected.
"""
import json

from faker import Faker

from met_api.utils.enums import ContentType
from tests.utilities.factory_scenarios import TestJwtClaims, TestSubscribeInfo, TestWidgetInfo
from tests.utilities.factory_utils import factory_auth_header, factory_engagement_model, factory_widget_model


fake = Faker()


def test_create_subscribe(client, jwt, session):  # pylint:disable=unused-argument
    """Assert that widget subscribe can be POSTed."""
    engagement = factory_engagement_model()
    TestWidgetInfo.widget1['engagement_id'] = engagement.id
    widget = factory_widget_model(TestWidgetInfo.widget1)
    subscribe_info = TestSubscribeInfo.subscribe_info_1.value
    headers = factory_auth_header(jwt=jwt, claims=TestJwtClaims.no_role)

    data = {
        **subscribe_info,
        'widget_id': widget.id,
    }

    print(f"Data: {data}")  # Debug print statement

    rv = client.post(
        f'/api/widgets/{widget.id}/subscribe',
        data=json.dumps(data),
        headers=headers,
        content_type=ContentType.JSON.value
    )
    print(f"Status code: {rv.status_code}")  # Debug print statement
    print(f"Response: {rv.json}")  # Debug print statement

    assert rv.status_code == 200
    assert rv.json.get('type') == subscribe_info.get('type')
    response_subscribe_items = rv.json.get('subscribe_items')
    assert len(response_subscribe_items) == 1
    response_description_str = response_subscribe_items[0].get(
        'description', '')
    response_description_str = response_subscribe_items[0].get('description', '')
    response_description = json.loads(response_description_str.strip('"')) if response_description_str is not None else None
    subscribe_info_description_str = subscribe_info.get('description', '')
    subscribe_info_description = json.loads(subscribe_info_description_str.strip('"')) if subscribe_info_description_str is not None else None
    assert response_description == subscribe_info_description


def test_get_subscribe(client, jwt, session):  # pylint:disable=unused-argument
    """Assert that a widget's subscription can be retrieved."""
    engagement = factory_engagement_model()
    TestWidgetInfo.widget_subscribe['engagement_id'] = engagement.id
    widget = factory_widget_model(TestWidgetInfo.widget_subscribe)
    subscribe_info = TestSubscribeInfo.subscribe_info_1.value
    headers = factory_auth_header(jwt=jwt, claims=TestJwtClaims.no_role)

    data = {
        **subscribe_info,
        'widget_id': widget.id,
    }
    print(f"Data: {data}")  # Debug print statement

    rv = client.post(
        f'/api/widgets/{widget.id}/subscribe',
        data=json.dumps(data),
        headers=headers,
        content_type=ContentType.JSON.value
    )
    print(f"Status code: {rv.status_code}")  # Debug print statement
    print(f"Response: {rv.json}")  # Debug print statement

    assert rv.status_code == 200

    rv = client.get(
        f'/api/widgets/{widget.id}/subscribe',
        headers=headers,
        content_type=ContentType.JSON.value
    )
    print(f"Status code: {rv.status_code}")  # Debug print statement
    print(f"Response: {rv.json}")  # Debug print statement

    assert rv.status_code == 200
    assert rv.json[0].get('type') == subscribe_info.get('type')
