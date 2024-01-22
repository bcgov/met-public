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
"""Tests for the document widget service.

Test suite to ensure that the document widget service routines are working as expected.
"""

from http import HTTPStatus

import pytest

from met_api.exceptions.business_exception import BusinessException
from met_api.services.poll_answers_service import PollAnswerService
from tests.utilities.factory_scenarios import TestPollAnswerInfo, TestWidgetPollInfo
from tests.utilities.factory_utils import (
    factory_engagement_model, factory_poll_answer_model, factory_poll_model, factory_widget_model)


def test_get_poll_answer(session):
    """Assert that poll answers can be fetched by poll ID."""
    widget = _create_widget()
    poll = factory_poll_model(widget, TestWidgetPollInfo.poll1)
    factory_poll_answer_model(poll, TestPollAnswerInfo.answer1)
    session.commit()
    poll_answers = PollAnswerService.get_poll_answer(poll.id)
    assert len(poll_answers) > 0


def test_delete_poll_answers(session):
    """Assert that poll answers can be deleted for a given poll ID."""
    widget = _create_widget()
    poll = factory_poll_model(widget, TestWidgetPollInfo.poll1)
    factory_poll_answer_model(poll, TestPollAnswerInfo.answer1)
    session.commit()
    PollAnswerService.delete_poll_answers(poll.id)
    poll_answers = PollAnswerService.get_poll_answer(poll.id)
    assert len(poll_answers) == 0


def test_create_bulk_poll_answers(session):
    """Assert that poll answers can be deleted for a given poll ID."""
    widget = _create_widget()
    poll = factory_poll_model(widget, TestWidgetPollInfo.poll1)
    session.commit()
    answers_data = [TestPollAnswerInfo.answer1, TestPollAnswerInfo.answer2, TestPollAnswerInfo.answer3]
    PollAnswerService.create_bulk_poll_answers(poll.id, answers_data)
    poll_answers = PollAnswerService.get_poll_answer(poll.id)
    assert len(poll_answers) == 3

    # Testing Exception
    with pytest.raises(BusinessException) as exc_info:
        _ = PollAnswerService.create_bulk_poll_answers(100, answers_data)

    assert exc_info.value.status_code == HTTPStatus.INTERNAL_SERVER_ERROR


def _create_widget():
    """Create sample widget for testing."""
    engagement = factory_engagement_model()
    widget = factory_widget_model({'engagement_id': engagement.id})
    return widget
