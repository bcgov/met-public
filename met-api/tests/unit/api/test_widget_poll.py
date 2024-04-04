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

from met_api.constants.engagement_status import Status
from met_api.utils.enums import ContentType
from tests.utilities.factory_scenarios import TestJwtClaims, TestPollAnswerInfo, TestWidgetPollInfo
from tests.utilities.factory_utils import (
    factory_auth_header, factory_engagement_model, factory_poll_answer_model, factory_poll_model,
    factory_poll_response_model, factory_widget_model)


fake = Faker()


def test_get_widget(client, jwt, session):
    """Assert that a get API endpoint is working as expected."""
    # Test setup: create a poll widget and a response model
    headers = factory_auth_header(jwt=jwt, claims=TestJwtClaims.no_role)
    engagement = factory_engagement_model()
    widget = factory_widget_model({'engagement_id': engagement.id})
    poll = factory_poll_model(widget, TestWidgetPollInfo.poll1)
    answer = factory_poll_answer_model(poll, TestPollAnswerInfo.answer1)

    # Sending POST request
    rv = client.get(
        f'/api/widgets/{widget.id}/polls',
        headers=headers,
        content_type=ContentType.JSON.value,
    )

    # Checking response
    assert rv.status_code == HTTPStatus.OK
    json_data = rv.json
    assert len(json_data) > 0
    assert json_data[0]['title'] == poll.title
    assert json_data[0]['answers'][0]['answer_text'] == answer.answer_text


def test_create_poll_widget(client, jwt, session, setup_admin_user_and_claims):
    """Assert that a poll widget can be POSTed."""
    # Test setup: create a poll widget model

    _, claims = setup_admin_user_and_claims
    headers = factory_auth_header(jwt=jwt, claims=claims)

    engagement = factory_engagement_model()
    widget = factory_widget_model({'engagement_id': engagement.id})

    poll_info = {
        'title': TestWidgetPollInfo.poll1.get('title'),
        'description': TestWidgetPollInfo.poll1.get('description'),
        'engagement_id': engagement.id,
        'status': TestWidgetPollInfo.poll1.get('status'),
        'widget_id': widget.id,
        'answers': [
            TestPollAnswerInfo.answer1.value,
            TestPollAnswerInfo.answer2.value,
            TestPollAnswerInfo.answer3.value,
        ],
    }

    # Preparing data for POST request
    data = {
        **poll_info,
    }

    # Sending POST request
    rv = client.post(
        f'/api/widgets/{widget.id}/polls',
        data=json.dumps(data),
        headers=headers,
        content_type=ContentType.JSON.value,
    )

    # Checking response
    assert rv.status_code == HTTPStatus.OK
    assert rv.json.get('title') == poll_info.get('title')

    # testing Exceptions with wrong widget_id

    # Sending POST request
    rv = client.post(
        '/api/widgets/100/polls',
        data=json.dumps(data),
        headers=headers,
        content_type=ContentType.JSON.value,
    )

    assert rv.status_code == HTTPStatus.BAD_REQUEST


def test_update_poll_widget(client, jwt, session, setup_admin_user_and_claims):
    """Assert that a poll widget can be PATCHed."""
    # Test setup: create and post a poll widget model
    _, claims = setup_admin_user_and_claims
    headers = factory_auth_header(jwt=jwt, claims=claims)

    engagement = factory_engagement_model(status=Status.Draft.value)
    widget = factory_widget_model({'engagement_id': engagement.id})
    poll = factory_poll_model(widget, TestWidgetPollInfo.poll1)

    # Preparing data for PATCH request
    data = {
        'title': 'Updated Title',
        'engagement_id': engagement.id,
        'widget_id': widget.id,
        'answers': [TestPollAnswerInfo.answer3.value],
    }

    # Sending PATCH request
    rv = client.patch(
        f'/api/widgets/{widget.id}/polls/{poll.id}',
        data=json.dumps(data),
        headers=headers,
        content_type=ContentType.JSON.value,
    )

    assert rv.status_code == HTTPStatus.OK

    # Checking updating title if Engagement is published

    engagement = factory_engagement_model(status=Status.Published.value)
    widget = factory_widget_model({'engagement_id': engagement.id})
    poll = factory_poll_model(widget, TestWidgetPollInfo.poll1)

    # Preparing data for PATCH request
    data = {
        'title': 'Updated Title',
        'answers': [TestPollAnswerInfo.answer3.value],
    }

    # Sending PATCH request
    rv = client.patch(
        f'/api/widgets/{widget.id}/polls/{poll.id}',
        data=json.dumps(data),
        headers=headers,
        content_type=ContentType.JSON.value,
    )

    # Checking response
    assert rv.status_code == HTTPStatus.BAD_REQUEST

    # testing Exceptions with wrong data
    # Sending patch request
    rv = client.patch(
        f'/api/widgets/{widget.id}/polls/{poll.id}',
        data=json.dumps({'title': 5}),
        headers=headers,
        content_type=ContentType.JSON.value,
    )

    assert rv.status_code == HTTPStatus.BAD_REQUEST


def test_record_poll_response(client, session, jwt):
    """Assert that a response for a poll widget can be POSTed."""
    # Test setup: create a poll widget and a response model
    headers = factory_auth_header(jwt=jwt, claims=TestJwtClaims.no_role)
    engagement = factory_engagement_model()
    widget = factory_widget_model({'engagement_id': engagement.id})
    poll = factory_poll_model(widget, TestWidgetPollInfo.poll1)
    answer = factory_poll_answer_model(poll, TestPollAnswerInfo.answer1)

    # Preparing data for poll response
    data = {
        'selected_answer_id': answer.id,
    }

    # Sending POST request
    rv = client.post(
        f'/api/widgets/{widget.id}/polls/{poll.id}/responses',
        data=json.dumps(data),
        headers=headers,
        content_type=ContentType.JSON.value,
    )

    # Checking response
    assert rv.status_code == HTTPStatus.CREATED
    assert rv.json.get('message') == 'Response recorded successfully'

    data = {
        'selected_answer_wrong_key': answer.id,
    }

    # Sending POST request
    rv = client.post(
        f'/api/widgets/{widget.id}/polls/{poll.id}/responses',
        data=json.dumps(data),
        headers=headers,
        content_type=ContentType.JSON.value,
    )

    assert rv.status_code == HTTPStatus.BAD_REQUEST


def test_get_poll_response(client, jwt, session, setup_admin_user_and_claims):
    """Assert that a response for a poll widget can be retrieved."""
    # Test setup: create a poll widget and a response model
    _, claims = setup_admin_user_and_claims
    headers = factory_auth_header(jwt=jwt, claims=claims)
    engagement = factory_engagement_model()
    widget = factory_widget_model({'engagement_id': engagement.id})
    poll = factory_poll_model(widget, TestWidgetPollInfo.poll1)
    answer1 = factory_poll_answer_model(poll, TestPollAnswerInfo.answer1)
    answer2 = factory_poll_answer_model(poll, TestPollAnswerInfo.answer2)
    answer3 = factory_poll_answer_model(poll, TestPollAnswerInfo.answer3)

    # Recording 2 votes for answer1
    factory_poll_response_model(poll, answer1)
    factory_poll_response_model(poll, answer1)

    # Recording 2 votes for answer2
    factory_poll_response_model(poll, answer2)
    factory_poll_response_model(poll, answer2)

    # Sending GET request
    rv = client.get(
        f'/api/widgets/{widget.id}/polls/{poll.id}/responses',
        headers=headers,
        content_type=ContentType.JSON.value,
    )

    # Checking response
    assert rv.status_code == HTTPStatus.OK
    # Testing Poll title and total_response
    assert rv.json.get('title') == poll.title
    assert rv.json.get('total_response') == 4
    # Testing First answer
    assert rv.json.get('answers')[0].get('answer_id') == answer1.id
    assert rv.json.get('answers')[0].get('total_response') == 2
    assert rv.json.get('answers')[0].get('percentage') == 50
    # Testing Second answer
    assert rv.json.get('answers')[1].get('answer_id') == answer2.id
    assert rv.json.get('answers')[1].get('total_response') == 2
    assert rv.json.get('answers')[1].get('percentage') == 50
    # Testing Third answer
    assert rv.json.get('answers')[2].get('answer_id') == answer3.id
    assert rv.json.get('answers')[2].get('total_response') == 0
    assert rv.json.get('answers')[2].get('percentage') == 0
