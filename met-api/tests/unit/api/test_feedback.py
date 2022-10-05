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

from met_api.constants.feedback import FeedbackSourceType

from tests.utilities.factory_scenarios import TestJwtClaims
from tests.utilities.factory_utils import factory_auth_header, factory_feedback_model


def test_feedback(client, jwt, session):  # pylint:disable=unused-argument
    """Assert that an feedback can be POSTed."""
    claims = TestJwtClaims.public_user_role

    feedback = factory_feedback_model()
    to_dict = {
        'rating': feedback.rating,
        'comment_type': feedback.comment_type,
        'comment': feedback.comment
    }
    headers = factory_auth_header(jwt=jwt, claims=claims)
    rv = client.post('/api/feedbacks/', data=json.dumps(to_dict),
                     headers=headers, content_type='application/json')

    assert rv.status_code == 200
    result = rv.json.get('result')
    assert result is not None
    assert result.get('id') is not None
    assert result.get('rating') == feedback.rating
    assert result.get('comment_type') == feedback.comment_type
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
                     headers=headers, content_type='application/json')
    rating_error_msg = "'rating' is a required property"

    assert rating_error_msg in rv.json.get('message')

    to_dict = {
    }
    headers = factory_auth_header(jwt=jwt, claims=claims)
    rv = client.post('/api/feedbacks/', data=json.dumps(to_dict),
                     headers=headers, content_type='application/json')
    print(rv.json.get('message'))
    assert rating_error_msg in rv.json.get('message')
