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

Test-Suite to ensure that the Widget Subscribe API endpoint
is working as expected.
"""
import json

from http import HTTPStatus
from faker import Faker
from unittest.mock import patch

from met_api.constants.subscribe_types import SubscribeTypes
from met_api.exceptions.business_exception import BusinessException
from met_api.services.widget_subscribe_service import WidgetSubscribeService
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

    # Preparing data
    data = {
        **subscribe_info,
        'widget_id': widget.id,
    }

    # Sending POST request
    rv = client.post(
        f'/api/widgets/{widget.id}/subscribe',
        data=json.dumps(data),
        headers=headers,
        content_type=ContentType.JSON.value,
    )
    # Checking response
    assert rv.status_code == HTTPStatus.OK.value
    assert rv.json.get('type') == subscribe_info.get('type')

    # test create subscribe exception
    data = {
        **subscribe_info,
        'widget_id': fake.pyint(),
    }

    with patch.object(WidgetSubscribeService, 'create_subscribe',
                      side_effect=BusinessException('Test error', status_code=HTTPStatus.BAD_REQUEST)):
        rv = client.post(
            f'/api/widgets/{widget.id}/subscribe',
            data=json.dumps(data),
            headers=headers,
            content_type=ContentType.JSON.value,
        )
    assert rv.status_code == HTTPStatus.BAD_REQUEST


def test_get_subscribe(client, jwt, session):  # pylint:disable=unused-argument
    """Assert that a widget's subscription can be retrieved."""
    engagement = factory_engagement_model()

    TestWidgetInfo.widget_subscribe['engagement_id'] = engagement.id
    widget = factory_widget_model(TestWidgetInfo.widget_subscribe)

    subscribe_info = TestSubscribeInfo.subscribe_info_1.value

    headers = factory_auth_header(jwt=jwt, claims=TestJwtClaims.no_role)

    # Preparing data
    data = {
        **subscribe_info,
        'widget_id': widget.id,
    }

    # Sending POST request
    rv = client.post(
        f'/api/widgets/{widget.id}/subscribe',
        data=json.dumps(data),
        headers=headers,
        content_type=ContentType.JSON.value,
    )

    # Checking POST response
    assert rv.status_code == HTTPStatus.OK.value

    # Sending GET request
    rv = client.get(
        f'/api/widgets/{widget.id}/subscribe',
        headers=headers,
        content_type=ContentType.JSON.value,
    )

    # Checking GET response
    assert rv.status_code == HTTPStatus.OK.value
    assert rv.json[0].get('type') == subscribe_info.get('type')


def test_delete_subscribe(client, jwt, session):  # pylint:disable=unused-argument
    """Assert that widget subscribe can be deleted."""
    engagement = factory_engagement_model()

    TestWidgetInfo.widget1['engagement_id'] = engagement.id
    widget = factory_widget_model(TestWidgetInfo.widget1)

    subscribe_info = TestSubscribeInfo.subscribe_info_1.value

    headers = factory_auth_header(jwt=jwt, claims=TestJwtClaims.no_role)

    # Preparing data
    data = {
        **subscribe_info,
        'widget_id': widget.id,
    }

    # Sending POST request
    rv = client.post(
        f'/api/widgets/{widget.id}/subscribe',
        data=json.dumps(data),
        headers=headers,
        content_type=ContentType.JSON.value,
    )
    # Checking response
    assert rv.status_code == HTTPStatus.OK.value
    subscribe_id = rv.json.get('id')

    # Sending DELETE request
    rv = client.delete(
        f'/api/widgets/{widget.id}/subscribe/{subscribe_id}',
        headers=headers,
        content_type=ContentType.JSON.value,
    )
    # Checking response
    assert rv.status_code == HTTPStatus.OK.value

    # test delete subscribe exception
    widget_id = fake.pyint()
    # Sending DELETE request
    with patch.object(WidgetSubscribeService, 'delete_subscribe',
                      side_effect=BusinessException('Test error', status_code=HTTPStatus.BAD_REQUEST)):
        rv = client.delete(
            f'/api/widgets/{widget_id}/subscribe/{subscribe_id}',
            headers=headers,
            content_type=ContentType.JSON.value,
        )
    # Checking response
    assert rv.status_code == HTTPStatus.BAD_REQUEST


def test_subscribe_sorting(client, jwt, session):  # pylint:disable=unused-argument
    """Assert that widget subscribe can be sorted."""
    engagement = factory_engagement_model()

    TestWidgetInfo.widget1['engagement_id'] = engagement.id
    widget = factory_widget_model(TestWidgetInfo.widget1)
    headers = factory_auth_header(jwt=jwt, claims=TestJwtClaims.no_role)

    subscribe_info = TestSubscribeInfo.subscribe_info_1.value
    data = {
        **subscribe_info,
        'widget_id': widget.id,
    }
    rv = client.post(f'/api/widgets/{widget.id}/subscribe', data=json.dumps(data),
                     headers=headers, content_type=ContentType.JSON.value)
    assert rv.status_code == HTTPStatus.OK.value

    subscribe_info = TestSubscribeInfo.subscribe_info_2.value
    data = {
        **subscribe_info,
        'widget_id': widget.id,
    }
    rv = client.post(f'/api/widgets/{widget.id}/subscribe', data=json.dumps(data),
                     headers=headers, content_type=ContentType.JSON.value)
    assert rv.status_code == HTTPStatus.OK.value

    rv = client.get(f'/api/widgets/{widget.id}/subscribe', headers=headers, content_type=ContentType.JSON.value)
    assert rv.status_code == HTTPStatus.OK.value
    assert len(rv.json) == 2, 'Two Items Should exist.'
    widgets = rv.json
    email_list = _find_item(widgets, SubscribeTypes.EMAIL_LIST.name)
    assert email_list.get('sort_index') == 1

    sign_up = _find_item(widgets, SubscribeTypes.SIGN_UP.name)
    assert sign_up.get('sort_index') == 2

    # Do reorder
    reorder_dict = [
        {
            'id': sign_up.get('id'),
        },
        {
            'id': email_list.get('id'),
        }
    ]

    rv = client.patch(f'/api/widgets/{widget.id}/subscribe/sort_index', data=json.dumps(reorder_dict),
                      headers=headers, content_type=ContentType.JSON.value)
    assert rv.status_code == HTTPStatus.OK.value

    rv = client.get(f'/api/widgets/{widget.id}/subscribe', headers=headers, content_type=ContentType.JSON.value)
    assert rv.status_code == HTTPStatus.OK.value
    widgets = rv.json
    email_list = _find_item(widgets, SubscribeTypes.EMAIL_LIST.name)
    assert email_list.get('sort_index') == 2

    sign_up = _find_item(widgets, SubscribeTypes.SIGN_UP.name)
    assert sign_up.get('sort_index') == 1

    # test subscribe sorting exception
    widget_id = fake.pyint()
    with patch.object(WidgetSubscribeService, 'save_widget_subscribes_bulk',
                      side_effect=BusinessException('Test error', status_code=HTTPStatus.BAD_REQUEST)):
        rv = client.patch(f'/api/widgets/{widget_id}/subscribe/sort_index', data=json.dumps(reorder_dict),
                          headers=headers, content_type=ContentType.JSON.value)
    assert rv.status_code == HTTPStatus.BAD_REQUEST


def _find_item(widgets, type):
    widget_type = next(x for x in widgets if x.get('type') == type)
    return widget_type


def test_update_subscribe(client, jwt, session):  # pylint:disable=unused-argument
    """Assert that widget subscribe can be PATCHed."""
    engagement = factory_engagement_model()

    TestWidgetInfo.widget1['engagement_id'] = engagement.id
    widget = factory_widget_model(TestWidgetInfo.widget1)

    subscribe_info = TestSubscribeInfo.subscribe_info_1.value

    headers = factory_auth_header(jwt=jwt, claims=TestJwtClaims.no_role)

    # Preparing data
    data = {
        **subscribe_info,
        'widget_id': widget.id,
    }
    # Sending POST request
    rv = client.post(
        f'/api/widgets/{widget.id}/subscribe',
        data=json.dumps(data),
        headers=headers,
        content_type=ContentType.JSON.value,
    )
    # Checking response
    assert rv.status_code == HTTPStatus.OK.value
    subscribe_id = rv.json.get('id')
    subscribe_items = rv.json.get('subscribe_items')
    item_id = subscribe_items[0].get('id')

    subscribe_edits = {
        'description': fake.text(max_nb_chars=20),
        'call_to_action_text': fake.text(max_nb_chars=20)
    }
    # Sending PATCH request
    rv = client.patch(f'/api/widgets/{widget.id}/subscribe/{subscribe_id}/item/{item_id}',
                      data=json.dumps(subscribe_edits),
                      headers=headers, content_type=ContentType.JSON.value)
    assert rv.status_code == HTTPStatus.OK

    rv = client.get(f'/api/widgets/{widget.id}/subscribe', headers=headers, content_type=ContentType.JSON.value)
    subscribe_items = rv.json[0].get('subscribe_items')
    assert subscribe_items[0].get('call_to_action_text') == subscribe_edits.get('call_to_action_text')

    # test update subscribe exception
    widget_id = fake.pyint()
    with patch.object(WidgetSubscribeService, 'update_subscribe_item',
                      side_effect=BusinessException('Test error', status_code=HTTPStatus.BAD_REQUEST)):
        rv = client.patch(f'/api/widgets/{widget_id}/subscribe/{subscribe_id}/item/{item_id}',
                          data=json.dumps(subscribe_edits),
                          headers=headers, content_type=ContentType.JSON.value)
    assert rv.status_code == HTTPStatus.BAD_REQUEST
