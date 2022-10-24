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

import pytest

from tests.utilities.factory_scenarios import TestJwtClaims, TestWidgetInfo, TestWidgetItemInfo
from tests.utilities.factory_utils import factory_auth_header, factory_engagement_model, factory_widget_model


@pytest.mark.parametrize('widget_info', [TestWidgetInfo.widget1])
def test_create_widget(client, jwt, session, widget_info):  # pylint:disable=unused-argument
    """Assert that a widget can be POSTed."""
    engagement = factory_engagement_model()
    widget_info['engagement_id'] = engagement.id
    headers = factory_auth_header(jwt=jwt, claims=TestJwtClaims.no_role)
    rv = client.post('/api/widgets/engagement/' + str(engagement.id), data=json.dumps(widget_info),
                     headers=headers, content_type='application/json')
    assert rv.status_code == 200


@pytest.mark.parametrize('widget_item_info', [TestWidgetItemInfo.widget_item1])
def test_create_widget_items(client, jwt, session, widget_item_info):  # pylint:disable=unused-argument
    """Assert that widget items can be POSTed."""
    engagement = factory_engagement_model()
    TestWidgetInfo.widget1['engagement_id'] = engagement.id
    widget = factory_widget_model(TestWidgetInfo.widget1)

    headers = factory_auth_header(jwt=jwt, claims=TestJwtClaims.no_role)

    data = {
        'widget_data_id': widget_item_info.get('widget_data_id'),
        'widget_id': widget.id,
    }
    rv = client.post('/api/widgets/' + str(widget.id) + '/items', data=json.dumps([data]),
                     headers=headers, content_type='application/json')
    assert rv.status_code == 200
