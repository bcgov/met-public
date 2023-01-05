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

"""Tests to verify the comment API end-point.

Test-Suite to ensure that the /Comment endpoint is working as expected.
"""
import json

from met_api.utils.enums import ContentType
from tests.utilities.factory_scenarios import TestJwtClaims
from tests.utilities.factory_utils import (
    factory_auth_header, factory_comment_model, factory_submission_model, factory_survey_and_eng_model,
    factory_user_model)


def test_get_comments(client, jwt, session):  # pylint:disable=unused-argument
    """Assert that comments can be fetched."""
    claims = TestJwtClaims.public_user_role

    user_details = factory_user_model()
    survey, eng = factory_survey_and_eng_model()
    submission = factory_submission_model(survey.id, eng.id, user_details.id)
    factory_comment_model(survey.id, submission.id)
    headers = factory_auth_header(jwt=jwt, claims=claims)
    rv = client.get(f'/api/comments/survey/{survey.id}', headers=headers, content_type=ContentType.JSON.value)
    assert rv.status_code == 200


def test_review_comment(client, jwt, session):  # pylint:disable=unused-argument
    """Assert that a comment can be reviewed."""
    claims = TestJwtClaims.public_user_role

    factory_user_model(TestJwtClaims.public_user_role.get('sub'))
    user_details = factory_user_model()
    survey, eng = factory_survey_and_eng_model()
    submission = factory_submission_model(survey.id, eng.id, user_details.id)
    factory_comment_model(survey.id, submission.id)
    to_dict = {
        'status_id': 2,
    }
    headers = factory_auth_header(jwt=jwt, claims=claims)
    rv = client.put(f'/api/submissions/{submission.id}',
                    data=json.dumps(to_dict), headers=headers, content_type=ContentType.JSON.value)
    assert rv.status_code == 200


def test_get_comments_spreadsheet(client, jwt, session):  # pylint:disable=unused-argument
    """Assert that comments sheet can be fetched."""
    claims = TestJwtClaims.public_user_role

    user_details = factory_user_model()
    survey, eng = factory_survey_and_eng_model()
    submission = factory_submission_model(survey.id, eng.id, user_details.id)
    factory_comment_model(survey.id, submission.id)
    headers = factory_auth_header(jwt=jwt, claims=claims)
    rv = client.get(f'/api/comments/survey/{survey.id}', headers=headers, content_type=ContentType.JSON.value)
    assert rv.status_code == 200
    