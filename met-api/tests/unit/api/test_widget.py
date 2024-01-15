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

"""Tests to verify the Widget API end-point.

Test-Suite to ensure that the Widget endpoint is working as expected.
"""
import json
from http import HTTPStatus

import pytest

from met_api.constants.widget import WidgetType
from met_api.utils.enums import ContentType
from tests.utilities.factory_scenarios import TestWidgetInfo, TestWidgetItemInfo
from tests.utilities.factory_utils import factory_auth_header, factory_engagement_model, factory_widget_model


@pytest.mark.parametrize('widget_info', [TestWidgetInfo.widget1])
def test_create_widget(client, jwt, session, widget_info,
                       setup_admin_user_and_claims):  # pylint:disable=unused-argument
    """Assert that a widget can be POSTed."""
    engagement = factory_engagement_model()
    widget_info['engagement_id'] = engagement.id
    user, claims = setup_admin_user_and_claims
    headers = factory_auth_header(jwt=jwt, claims=claims)
    rv = client.post('/api/widgets/engagement/' + str(engagement.id), data=json.dumps(widget_info),
                     headers=headers, content_type=ContentType.JSON.value)
    assert rv.status_code == 200

    rv = client.get('/api/widgets/engagement/' + str(engagement.id),
                    headers=headers, content_type=ContentType.JSON.value)
    assert rv.status_code == 200
    assert rv.json[0].get('sort_index') == 1


def test_create_widget_sort(client, jwt, session,
                            setup_admin_user_and_claims):  # pylint:disable=unused-argument
    """Assert that a widget can be POSTed."""
    engagement = factory_engagement_model()
    widget_info_1 = TestWidgetInfo.widget1
    widget_info_1['engagement_id'] = engagement.id
    user, claims = setup_admin_user_and_claims
    headers = factory_auth_header(jwt=jwt, claims=claims)
    rv = client.post(f'/api/widgets/engagement/{engagement.id}', data=json.dumps(widget_info_1),
                     headers=headers, content_type=ContentType.JSON.value)
    assert rv.status_code == 200

    widget_info_2 = TestWidgetInfo.widget2
    widget_info_2['engagement_id'] = engagement.id
    headers = factory_auth_header(jwt=jwt, claims=claims)
    rv = client.post(f'/api/widgets/engagement/{engagement.id}', data=json.dumps(widget_info_2),
                     headers=headers, content_type=ContentType.JSON.value)
    assert rv.status_code == 200

    rv = client.get('/api/widgets/engagement/' + str(engagement.id),
                    headers=headers, content_type=ContentType.JSON.value)
    assert rv.status_code == 200
    assert len(rv.json) == 2, 'Two Widgets Should exist.'
    widgets = rv.json
    who_is_widget = _find_widget(widgets, WidgetType.WHO_IS_LISTENING)
    assert who_is_widget.get('sort_index') == 1

    doc_widget = _find_widget(widgets, WidgetType.DOCUMENTS)
    assert doc_widget.get('sort_index') == 2

    # Do reorder

    reorder_dict = [
        {
            'id': doc_widget.get('id'),
        },
        {
            'id': who_is_widget.get('id'),
        }
    ]

    rv = client.patch(f'/api/widgets/engagement/{engagement.id}/sort_index', data=json.dumps(reorder_dict),
                      headers=headers, content_type=ContentType.JSON.value)
    assert rv.status_code == 204

    rv = client.get(f'/api/widgets/engagement/{engagement.id}',
                    headers=headers, content_type=ContentType.JSON.value)
    widgets = rv.json
    who_is_widget = _find_widget(widgets, WidgetType.WHO_IS_LISTENING)
    assert who_is_widget.get('sort_index') == 2

    doc_widget = _find_widget(widgets, WidgetType.DOCUMENTS)
    assert doc_widget.get('sort_index') == 1


def test_create_widget_sort_invalid(client, jwt, session,
                                    setup_admin_user_and_claims):  # pylint:disable=unused-argument
    """Assert that a widget can be POSTed."""
    engagement = factory_engagement_model()
    widget_info_1 = TestWidgetInfo.widget1
    widget_info_1['engagement_id'] = engagement.id
    user, claims = setup_admin_user_and_claims
    headers = factory_auth_header(jwt=jwt, claims=claims)
    rv = client.post(f'/api/widgets/engagement/{engagement.id}', data=json.dumps(widget_info_1),
                     headers=headers, content_type=ContentType.JSON.value)
    assert rv.status_code == 200

    # invalid reorder
    reorder_dict = [{
        'id': 123,
        'sort_index': 2
    }, {
        'id': 1234,
        'sort_index': 1
    }
    ]
    rv = client.patch(f'/api/widgets/engagement/{engagement.id}/sort_index', data=json.dumps(reorder_dict),
                      headers=headers, content_type=ContentType.JSON.value)
    assert rv.status_code == HTTPStatus.BAD_REQUEST


def _find_widget(widgets, widget_type):
    who_is_widget = next(x for x in widgets if x.get('widget_type_id') == widget_type.value)
    return who_is_widget


@pytest.mark.parametrize('widget_item_info', [TestWidgetItemInfo.widget_item1])
def test_create_widget_items(client, jwt, session, widget_item_info,
                             setup_admin_user_and_claims):  # pylint:disable=unused-argument
    """Assert that widget items can be POSTed."""
    engagement = factory_engagement_model()
    TestWidgetInfo.widget1['engagement_id'] = engagement.id
    widget = factory_widget_model(TestWidgetInfo.widget1)
    user, claims = setup_admin_user_and_claims

    headers = factory_auth_header(jwt=jwt, claims=claims)

    data = {
        'widget_data_id': widget_item_info.get('widget_data_id'),
        'widget_id': widget.id,
    }
    rv = client.post('/api/widgets/' + str(widget.id) + '/items', data=json.dumps([data]),
                     headers=headers, content_type=ContentType.JSON.value)
    assert rv.status_code == 200
