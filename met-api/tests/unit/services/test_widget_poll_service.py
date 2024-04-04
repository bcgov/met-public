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
from unittest.mock import patch

import pytest

from met_api.constants.engagement_status import Status as EngagementStatus
from met_api.exceptions.business_exception import BusinessException
from met_api.services import authorization
from met_api.services.poll_response_service import PollResponseService
from met_api.services.widget_poll_service import WidgetPollService
from tests.utilities.factory_scenarios import TestPollAnswerInfo, TestPollResponseInfo, TestWidgetPollInfo
from tests.utilities.factory_utils import (
    factory_engagement_model, factory_poll_answer_model, factory_poll_model, factory_widget_model)


def test_get_polls_by_widget_id(session):
    """Assert that polls can be fetched by widget ID."""
    widget = _create_widget()
    factory_poll_model(widget, TestWidgetPollInfo.poll1)
    factory_poll_model(widget, TestWidgetPollInfo.poll2)
    session.commit()
    polls = WidgetPollService.get_polls_by_widget_id(widget.id)
    assert len(polls) == 2


def test_get_poll_by_id(session):
    """Assert that polls can be fetched by poll ID."""
    widget = _create_widget()
    poll = factory_poll_model(widget, TestWidgetPollInfo.poll1)
    session.commit()
    response = WidgetPollService.get_poll_by_id(poll.id)
    assert response.id == poll.id

    # Test invalid poll ID
    with pytest.raises(BusinessException) as exc_info:
        _ = WidgetPollService.get_poll_by_id(100)

    assert exc_info.value.status_code == HTTPStatus.NOT_FOUND


def test_create_poll(session, monkeypatch):
    """Assert that a poll can be created."""
    with patch.object(authorization, 'check_auth', return_value=True):
        widget = _create_widget()
        poll_data = TestWidgetPollInfo.poll1
        poll_data['engagement_id'] = widget.engagement_id
        poll = WidgetPollService.create_poll(widget.id, poll_data)
        assert poll.id is not None
        assert poll.title == poll_data['title']

        # Test invalid widget ID
        with pytest.raises(BusinessException) as exc_info:
            _ = WidgetPollService.create_poll(100, poll_data)

        assert exc_info.value.status_code == HTTPStatus.BAD_REQUEST


def test_update_poll(session):
    """Assert that a poll can be updated."""
    with patch.object(authorization, 'check_auth', return_value=True):
        widget = _create_widget()
        poll = factory_poll_model(widget, TestWidgetPollInfo.poll1)
        session.commit()
        updated_data = {
            'title': 'Updated Title',
            'answers': [{'answer_text': 'Python'}],
        }
        updated_poll = WidgetPollService.update_poll(
            widget.id, poll.id, updated_data
        )
        assert updated_poll.title == updated_data['title']
        assert (
            updated_poll.answers[0].answer_text == updated_data['answers'][0]['answer_text']
        )

        # Test invalid poll ID
        with pytest.raises(BusinessException) as exc_info:
            _ = WidgetPollService.update_poll(widget.id, 150, updated_data)

        assert exc_info.value.status_code == HTTPStatus.NOT_FOUND

        # Test invalid widget ID
        with pytest.raises(BusinessException) as exc_info:
            _ = WidgetPollService.update_poll(150, poll.id, updated_data)

        assert exc_info.value.status_code == HTTPStatus.BAD_REQUEST


def test_record_response(session):
    """Assert that a poll can be created."""
    widget = _create_widget()
    poll = factory_poll_model(widget, TestWidgetPollInfo.poll1)
    answer = factory_poll_answer_model(poll, TestPollAnswerInfo.answer1)
    response_data = TestPollResponseInfo.response1
    response_data['poll_id'] = poll.id
    response_data['widget_id'] = widget.id
    response_data['selected_answer_id'] = answer.id

    response = WidgetPollService.record_response(response_data)
    assert response.id is not None
    assert response.selected_answer_id == answer.id

    # Test creating response with invalid selected_answer_id
    response_data['selected_answer_id'] = 100
    with pytest.raises(BusinessException) as exc_info:
        _ = WidgetPollService.record_response(response_data)

    assert exc_info.value.status_code == HTTPStatus.BAD_REQUEST


def test_check_already_polled(session):
    """Checking whether the poll is already polled the specfied limit with same ip."""
    response_data = TestPollResponseInfo.response1
    widget = _create_widget()
    poll = factory_poll_model(widget, TestWidgetPollInfo.poll1)
    already_polled = WidgetPollService.check_already_polled(
        poll.id, response_data['participant_id'], 1
    )
    assert already_polled is False

    # Check already polled or not after poll response is created
    answer = factory_poll_answer_model(poll, TestPollAnswerInfo.answer1)
    response_data['poll_id'] = poll.id
    response_data['widget_id'] = widget.id
    response_data['selected_answer_id'] = answer.id
    PollResponseService.create_response(response_data)

    already_polled = WidgetPollService.check_already_polled(
        poll.id, response_data['participant_id'], 1
    )
    assert already_polled is True


def test_is_poll_active(session):
    """Check if poll is active or not."""
    widget = _create_widget()
    poll = factory_poll_model(widget, TestWidgetPollInfo.poll1)
    is_active = WidgetPollService.is_poll_active(poll.id)
    assert is_active is True

    # Test wrong poll id
    with pytest.raises(BusinessException) as exc_info:
        _ = WidgetPollService.is_poll_active(100)

    assert exc_info.value.status_code == HTTPStatus.NOT_FOUND


def test_is_poll_engagement_published(session):
    """Check if poll engagement is published or not."""
    widget = _create_widget()
    poll = factory_poll_model(widget, TestWidgetPollInfo.poll1)
    is_published = WidgetPollService.is_poll_engagement_published(poll.id)
    assert is_published is True

    # Test not published status
    engagement = factory_engagement_model(
        status=EngagementStatus.Unpublished.value
    )
    widget = factory_widget_model({'engagement_id': engagement.id})
    poll = factory_poll_model(widget, TestWidgetPollInfo.poll1)
    is_published = WidgetPollService.is_poll_engagement_published(poll.id)
    assert is_published is False

    # Test wrong poll id
    with pytest.raises(BusinessException) as exc_info:
        _ = WidgetPollService.is_poll_active(100)

    assert exc_info.value.status_code == HTTPStatus.NOT_FOUND


def _create_widget():
    """Create a widget for testing."""
    engagement = factory_engagement_model()
    widget = factory_widget_model({'engagement_id': engagement.id})
    return widget
