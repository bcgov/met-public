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
    print(f"Engagement: {engagement}")  # Debug print statement

    TestWidgetInfo.widget1['engagement_id'] = engagement.id
    widget = factory_widget_model(TestWidgetInfo.widget1)
    print(f"Widget: {widget}")  # Debug print statement

    subscribe_info = TestSubscribeInfo.subscribe_info_1.value
    print(f"Subscribe Info: {subscribe_info}")  # Debug print statement

    headers = factory_auth_header(jwt=jwt, claims=TestJwtClaims.no_role)
    print(f"Headers: {headers}")  # Debug print statement

    # Preparing data
    data = {
        **subscribe_info,
        'widget_id': widget.id,
    }
    print(f"Prepared Data: {data}")  # Debug print statement

    # Sending POST request
    rv = client.post(
        f'/api/widgets/{widget.id}/subscribe',
        data=json.dumps(data),
        headers=headers,
        content_type=ContentType.JSON.value
    )
    print(f"POST Response: {rv}")  # Debug print statement

    # Checking response
    assert rv.status_code == 200
    assert rv.json.get('type') == subscribe_info.get('type')

    response_subscribe_items = rv.json.get('subscribe_items')
    # Debug print statement
    print(f"Response Subscribe Items: {response_subscribe_items}")

    # ...


def test_get_subscribe(client, jwt, session):  # pylint:disable=unused-argument
    """Assert that a widget's subscription can be retrieved."""
    engagement = factory_engagement_model()
    print(f"Engagement: {engagement}")  # Debug print statement

    TestWidgetInfo.widget_subscribe['engagement_id'] = engagement.id
    widget = factory_widget_model(TestWidgetInfo.widget_subscribe)
    print(f"Widget: {widget}")  # Debug print statement

    subscribe_info = TestSubscribeInfo.subscribe_info_1.value
    print(f"Subscribe Info: {subscribe_info}")  # Debug print statement

    headers = factory_auth_header(jwt=jwt, claims=TestJwtClaims.no_role)
    print(f"Headers: {headers}")  # Debug print statement

    # Preparing data
    data = {
        **subscribe_info,
        'widget_id': widget.id,
    }
    print(f"Prepared Data: {data}")  # Debug print statement

    # Sending POST request
    rv = client.post(
        f'/api/widgets/{widget.id}/subscribe',
        data=json.dumps(data),
        headers=headers,
        content_type=ContentType.JSON.value
    )
    print(f"POST Response: {rv}")  # Debug print statement

    # Checking POST response
    assert rv.status_code == 200

    # Sending GET request
    rv = client.get(
        f'/api/widgets/{widget.id}/subscribe',
        headers=headers,
        content_type=ContentType.JSON.value
    )
    print(f"GET Response: {rv}")  # Debug print statement

    # Checking GET response
    assert rv.status_code == 200
    assert rv.json[0].get('type') == subscribe_info.get('type')
