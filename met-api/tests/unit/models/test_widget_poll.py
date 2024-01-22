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
"""Tests for the Org model.

Test suite to ensure that the Engagement model routines are working as expected.
"""

from faker import Faker

from met_api.models.widget_poll import Poll
from tests.utilities.factory_scenarios import TestWidgetPollInfo
from tests.utilities.factory_utils import factory_engagement_model, factory_poll_model, factory_widget_model


fake = Faker()


def test_create_poll(session):
    """Assert that a poll can be created."""
    widget = _create_widget()
    poll = factory_poll_model(widget, TestWidgetPollInfo.poll1)
    session.commit()
    assert poll.id is not None
    assert poll.title == TestWidgetPollInfo.poll1['title']


def test_get_polls_by_widget_id(session):
    """Assert that polls for a widget can be fetched."""
    widget = _create_widget()
    factory_poll_model(widget, TestWidgetPollInfo.poll1)
    factory_poll_model(widget, TestWidgetPollInfo.poll2)
    session.commit()
    polls = Poll.get_polls(widget.id)
    assert len(polls) == 2


def test_update_poll(session):
    """Assert that a poll can be updated."""
    widget = _create_widget()
    poll = factory_poll_model(widget, TestWidgetPollInfo.poll1)
    session.commit()
    updated_title = 'Updated Title'
    updated_poll = Poll.update_poll(poll.id, {'title': updated_title})
    assert updated_poll.title == updated_title


def _create_widget():
    """Create sample widget for testing."""
    engagement = factory_engagement_model()
    widget = factory_widget_model({'engagement_id': engagement.id})
    return widget
