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

from met_api.constants.feedback import FeedbackSourceType, FeedbackStatusType
from met_api.utils.enums import ContentType

from tests.utilities.factory_scenarios import TestJwtClaims
from tests.utilities.factory_utils import factory_auth_header, factory_feedback_model


def test_feedback(client, jwt, session):  # pylint:disable=unused-argument
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

    updated_comment = "Updated comment for testing"
    update_data = {
        'status': FeedbackStatusType.Unreviewed.value,   # <-- Use a specific enum value
    }
    rv = client.patch(f'/api/feedbacks/{feedback_id}', data=json.dumps(update_data),
                      headers=headers, content_type=ContentType.JSON.value)
    assert rv.status_code == 200
    # Check if the comment is updated
    assert rv.json.get('comment') == updated_comment
    # Check if the status is update
    assert rv.json.get('status') == FeedbackStatusType.Unreviewed.value


def test_delete_feedback(client, jwt, session):  # pylint:disable=unused-argument
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

    # Now, delete this feedback
    rv = client.delete(f'/api/feedbacks/{feedback_id}', headers=headers)
    assert rv.status_code == 200
    assert rv.json == 'Feedback successfully removed'

    # Try fetching the deleted feedback (should return 404 NOT FOUND)
    rv = client.get(f'/api/feedbacks/{feedback_id}', headers=headers)
    assert rv.status_code == 404
