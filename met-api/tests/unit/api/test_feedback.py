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

"""Tests to verify the Feedback API end-point.

Test-Suite to ensure that the /Feedbacks endpoint is working as expected.
"""
import json
from http import HTTPStatus
from unittest.mock import patch
from faker import Faker
import pytest

from met_api.constants.feedback import FeedbackSourceType, FeedbackStatusType
from met_api.services.feedback_service import FeedbackService
from met_api.utils.enums import ContentType
from tests.utilities.factory_scenarios import TestJwtClaims
from tests.utilities.factory_utils import factory_auth_header, factory_feedback_model

fake = Faker()


@pytest.mark.parametrize('side_effect, expected_status', [
    (KeyError('Test error'), HTTPStatus.INTERNAL_SERVER_ERROR),
    (ValueError('Test error'), HTTPStatus.INTERNAL_SERVER_ERROR),
])
def test_feedback(client, jwt, session, side_effect, expected_status,):  # pylint:disable=unused-argument
    """Assert that an feedback can be POSTed."""
    claims = TestJwtClaims.public_user_role

    feedback = factory_feedback_model()
    to_dict = {
        'status': feedback.status,
        'rating': feedback.rating,
        'comment_type': feedback.comment_type,
        'comment': feedback.comment
    }
    headers = factory_auth_header(jwt=jwt, claims=claims)
    rv = client.post('/api/feedbacks/', data=json.dumps(to_dict),
                     headers=headers, content_type=ContentType.JSON.value)

    assert rv.status_code == 200
    result = rv.json
    assert result is not None
    assert result.get('id') is not None
    assert result.get('rating') == feedback.rating
    assert result.get('comment_type') == feedback.comment_type
    assert result.get('status') == feedback.status
    assert result.get('comment') == feedback.comment
    assert result.get('source') == FeedbackSourceType.Internal

    with patch.object(FeedbackService, 'create_feedback', side_effect=side_effect):
        rv = client.post('/api/feedbacks/', data=json.dumps(to_dict),
                         headers=headers, content_type=ContentType.JSON.value)
    assert rv.status_code == expected_status


def test_invalid_feedback(client, jwt, session):  # pylint:disable=unused-argument
    """Assert that an invalid feedback can not be POSTed."""
    claims = TestJwtClaims.public_user_role

    feedback = factory_feedback_model()
    to_dict = {
        'blah': feedback.rating,
        'comment_type': feedback.comment_type,
        'comment': feedback.comment
    }
    headers = factory_auth_header(jwt=jwt, claims=claims)
    rv = client.post('/api/feedbacks/', data=json.dumps(to_dict),
                     headers=headers, content_type=ContentType.JSON.value)
    rating_error_msg = "'rating' is a required property"

    assert rating_error_msg in rv.json.get('message')

    to_dict = {
    }
    headers = factory_auth_header(jwt=jwt, claims=claims)
    rv = client.post('/api/feedbacks/', data=json.dumps(to_dict),
                     headers=headers, content_type=ContentType.JSON.value)
    print(rv.json.get('message'))
    assert rating_error_msg in rv.json.get('message')


def test_patch_feedback(client, jwt, session):  # pylint:disable=unused-argument
    """Assert that feedback can be updated via PATCH."""
    # Setup: Create a new feedback first
    claims = TestJwtClaims.public_user_role
    feedback = factory_feedback_model()
    feedback_creation = {
        'status': feedback.status,
        'rating': feedback.rating,
        'comment_type': feedback.comment_type,
        'comment': feedback.comment
    }
    headers = factory_auth_header(jwt=jwt, claims=claims)
    rv = client.post('/api/feedbacks/', data=json.dumps(feedback_creation),
                     headers=headers, content_type=ContentType.JSON.value)
    feedback_id = rv.json.get('id')

    assert rv.status_code == 200

    feedback_creation['status'] = FeedbackStatusType.Archived.value

    rv = client.patch(f'/api/feedbacks/{feedback_id}', data=json.dumps(feedback_creation),
                      headers=headers, content_type=ContentType.JSON.value)
    assert rv.status_code == 200
    # Check if the status is update
    assert rv.json.get('status') == FeedbackStatusType.Archived.value

    # Patching a non existing feedback should give an error
    feedback_id = fake.pyint()
    rv = client.patch(f'/api/feedbacks/{feedback_id}', data=json.dumps(feedback_creation),
                      headers=headers, content_type=ContentType.JSON.value)
    assert rv.status_code == HTTPStatus.NOT_FOUND


@pytest.mark.parametrize('side_effect, expected_status', [
    (KeyError('Test error'), HTTPStatus.INTERNAL_SERVER_ERROR),
    (ValueError('Test error'), HTTPStatus.INTERNAL_SERVER_ERROR),
])
def test_delete_feedback(client, jwt, session, side_effect, expected_status,):  # pylint:disable=unused-argument
    """Assert that feedback can be deleted."""
    # Setup: Create a new feedback first
    claims = TestJwtClaims.public_user_role
    feedback = factory_feedback_model()
    feedback_creation = {
        'status': feedback.status,
        'rating': feedback.rating,
        'comment_type': feedback.comment_type,
        'comment': feedback.comment
    }
    headers = factory_auth_header(jwt=jwt, claims=claims)
    rv = client.post('/api/feedbacks/', data=json.dumps(feedback_creation),
                     headers=headers, content_type=ContentType.JSON.value)
    feedback_id = rv.json.get('id')
    assert rv.status_code == 200
    # Now, delete this feedback
    rv = client.delete(f'/api/feedbacks/{feedback_id}', headers=headers)
    assert rv.status_code == 200

    # Delete a non existing feedback
    rv = client.delete(f'/api/feedbacks/{feedback_id}', headers=headers)
    assert rv.status_code == HTTPStatus.NOT_FOUND

    rv = client.post('/api/feedbacks/', data=json.dumps(feedback_creation),
                     headers=headers, content_type=ContentType.JSON.value)
    assert rv.status_code == 200
    with patch.object(FeedbackService, 'delete_feedback', side_effect=side_effect):
        rv = client.delete(f'/api/feedbacks/{feedback_id}', headers=headers)
    assert rv.status_code == expected_status


@pytest.mark.parametrize('side_effect, expected_status', [
    (ValueError('Test error'), HTTPStatus.INTERNAL_SERVER_ERROR),
])
def test_get_feedback(client, jwt, session, side_effect, expected_status,):  # pylint:disable=unused-argument
    """Assert that feedback can be fetched."""
    # Setup: Create a new feedback first
    claims = TestJwtClaims.public_user_role
    feedback = factory_feedback_model()
    headers = factory_auth_header(jwt=jwt, claims=claims)

    page = 1
    page_size = 10
    sort_key = 'created_date'
    sort_order = 'desc'
    feedback_status = feedback.status

    rv = client.get(f'/api/feedbacks/?page={page}&size={page_size}&sort_key={sort_key}\
                    &sort_order={sort_order}&engagement_status={[feedback_status]}',
                    headers=headers, content_type=ContentType.JSON.value)

    assert rv.status_code == 200
    assert rv.json.get('total') == 1

    with patch.object(FeedbackService, 'get_feedback_paginated', side_effect=side_effect):
        rv = client.get(f'/api/feedbacks/?page={page}&size={page_size}&sort_key={sort_key}\
                        &sort_order={sort_order}&engagement_status={[feedback_status]}',
                        headers=headers, content_type=ContentType.JSON.value)
    assert rv.status_code == expected_status
