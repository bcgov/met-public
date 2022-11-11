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
"""Tests for the Widget service.

Test suite to ensure that the Widget service routines are working as expected.
"""

from faker import Faker

from met_api.constants.widget import WidgetType
from met_api.services.widget_service import WidgetService
from tests.utilities.factory_scenarios import TestUserInfo, TestWidgetInfo
from tests.utilities.factory_utils import factory_engagement_model, factory_widget_model


fake = Faker()
date_format = '%Y-%m-%d'


def test_create_widget(session):  # pylint:disable=unused-argument
    """Assert that a widget can be created."""
    engagement = factory_engagement_model()
    user_id = TestUserInfo.user['id']

    widget_to_create = {
        'engagement_id': engagement.id,
        'widget_type_id': WidgetType.WHO_IS_LISTENING.value
    }

    widget_record = WidgetService().create_widget(widget_to_create, engagement.id, user_id)

    # Assert that was created
    assert widget_record.get('engagement_id') == widget_to_create.get('engagement_id')
    assert widget_record.get('widget_type_id') == widget_to_create.get('widget_type_id')


def test_create_widget_items(session):  # pylint:disable=unused-argument
    """Assert that widget items can be created in bulk."""
    engagement = factory_engagement_model()
    TestWidgetInfo.widget1['engagement_id'] = engagement.id
    widget = factory_widget_model(TestWidgetInfo.widget1)
    user_id = TestUserInfo.user['id']

    widget_item_to_create_1 = {
        'widget_id': widget.id,
        'widget_data_id': fake.pyint()
    }

    widget_item_to_create_2 = {
        'widget_id': widget.id,
        'widget_data_id': fake.pyint()
    }

    widget_item_records = WidgetService()\
        .create_widget_items_bulk(
            [widget_item_to_create_1, widget_item_to_create_2],
            user_id)

    # Assert that was created
    assert len(widget_item_records) == 2
    assert widget_item_records[0].get('widget_id') == widget_item_to_create_1.get('widget_id')
    assert widget_item_records[0].get('widget_data_id') == widget_item_to_create_1.get('widget_data_id')
    assert widget_item_records[1].get('widget_id') == widget_item_to_create_2.get('widget_id')
    assert widget_item_records[1].get('widget_data_id') == widget_item_to_create_2.get('widget_data_id')
