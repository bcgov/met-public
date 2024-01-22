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

from met_api.models.poll_answers import PollAnswer
from tests.utilities.factory_scenarios import TestPollAnswerInfo
from tests.utilities.factory_utils import (
    factory_engagement_model, factory_poll_answer_model, factory_poll_model, factory_widget_model)


def test_get_answers(session):
    """Assert that answers for a poll can be fetched."""
    poll = _create_poll()
    factory_poll_answer_model(poll, TestPollAnswerInfo.answer1)
    factory_poll_answer_model(poll, TestPollAnswerInfo.answer2)
    session.commit()
    answers = PollAnswer.get_answers(poll.id)
    assert len(answers) == 2


def test_update_answer(session):
    """Assert that an answer can be updated."""
    poll = _create_poll()
    answer = factory_poll_answer_model(poll, TestPollAnswerInfo.answer1)
    session.commit()
    updated_text = 'Updated Answer'
    updated_answer = PollAnswer.update_answer(answer.id, {'answer_text': updated_text})
    assert updated_answer.answer_text == updated_text


def test_delete_answers_by_poll_id(session):
    """Assert that answers for a poll can be deleted."""
    poll = _create_poll()
    factory_poll_answer_model(poll, TestPollAnswerInfo.answer1)
    factory_poll_answer_model(poll, TestPollAnswerInfo.answer2)
    session.commit()
    PollAnswer.delete_answers_by_poll_id(poll.id)
    answers = PollAnswer.get_answers(poll.id)
    assert len(answers) == 0


def test_bulk_insert_answers(session):
    """Assert that answers can be bulk inserted for a poll."""
    poll = _create_poll()
    answers_data = [{'answer_text': 'Answer 1'}, {'answer_text': 'Answer 2'}]
    PollAnswer.bulk_insert_answers(poll.id, answers_data)
    answers = PollAnswer.get_answers(poll.id)
    assert len(answers) == 2


def _create_poll():
    """Create and return a sample poll for testing."""
    widget = _create_widget()
    return factory_poll_model(widget, {'title': 'Sample Poll', 'engagement_id': widget.engagement_id})


def _create_widget():
    """Create and return a sample widget for testing."""
    engagement = factory_engagement_model()
    widget = factory_widget_model({'engagement_id': engagement.id})
    return widget
