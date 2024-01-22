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

from tests.utilities.factory_scenarios import TestPollResponseInfo, TestPollAnswerInfo
from tests.utilities.factory_utils import factory_poll_response_model, factory_poll_model, factory_poll_answer_model, \
    factory_engagement_model, factory_widget_model

from met_api.models.poll_responses import PollResponse


def test_get_responses(session):
    """Assert that responses for a poll can be fetched."""
    poll, answer = _create_poll_answer()
    poll_response1 = factory_poll_response_model(poll, answer, TestPollResponseInfo.response1)
    poll_response2 = factory_poll_response_model(poll, answer, TestPollResponseInfo.response2)
    session.commit()
    responses = PollResponse.get_responses(poll.id)
    assert len(responses) == 2


def test_get_responses_by_participant_id(session):
    """Assert that responses for a poll by a specific participant can be fetched."""
    poll, answer = _create_poll_answer()
    poll_response1 = factory_poll_response_model(poll, answer, TestPollResponseInfo.response1)

    session.commit()
    responses = PollResponse.get_responses_by_participant_id(poll.id, poll_response1.participant_id)
    assert len(responses) > 0


def test_update_or_delete_response(session):
    """Assert that a poll response can be updated."""
    poll, answer = _create_poll_answer()
    poll_response1 = factory_poll_response_model(poll, answer, TestPollResponseInfo.response1)
    session.commit()
    updated_data = {'is_deleted': True}
    updated_response = PollResponse.update_response(poll_response1.id, updated_data)
    assert updated_response.is_deleted == True


def _create_poll():
    """Helper function to create a poll for testing."""
    widget = _create_widget()
    return factory_poll_model(widget, {'title': 'Sample Poll', 'engagement_id': widget.engagement_id})


def _create_widget():
    """Helper function to create a widget for testing."""
    engagement = factory_engagement_model()
    widget = factory_widget_model({'engagement_id': engagement.id})
    return widget


def _create_poll_answer():
    """Helper function to create a widget for testing."""
    poll = _create_poll()
    answer = factory_poll_answer_model(poll, TestPollAnswerInfo.answer1)
    return poll, answer
# Additional relevant tests can be added here
