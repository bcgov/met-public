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

"""Tests to verify the Submission API end-point.

Test-Suite to ensure that the /Submission endpoint is working as expected.
"""
import json

from tests.utilities.factory_scenarios import TestJwtClaims
from tests.utilities.factory_utils import factory_auth_header, factory_email_verification, factory_survey_and_eng_model


def test_valid_submission(client, jwt, session):  # pylint:disable=unused-argument
    """Assert that an engagement can be POSTed."""
    claims = TestJwtClaims.public_user_role

    survey, eng = factory_survey_and_eng_model()
    email_verification = factory_email_verification(survey.id)
    to_dict = {
        'survey_id': str(survey.id),
        'submission_json': {'simplepostalcode': 'abc'},
        'verification_token': email_verification.verification_token
    }
    headers = factory_auth_header(jwt=jwt, claims=claims)
    rv = client.post('/api/submission/', data=json.dumps(to_dict),
                     headers=headers, content_type='application/json')
    assert rv.status_code == 200


def test_invalid_submission(client, jwt, session):  # pylint:disable=unused-argument
    """Assert that an engagement can be POSTed."""
    claims = TestJwtClaims.public_user_role

    survey, eng = factory_survey_and_eng_model()
    email_verification = factory_email_verification(survey.id)
    to_dict = {
        'blah': str(survey.id),
        'submission_json': {'simplepostalcode': 'abc'},
        'verification_token': email_verification.verification_token
    }
    headers = factory_auth_header(jwt=jwt, claims=claims)
    rv = client.post('/api/submission/', data=json.dumps(to_dict),
                     headers=headers, content_type='application/json')
    survey_id_error_msg = "'survey_id' is a required property"
    submission_json_error_msg = "'submission_json' is a required property"
    verification_token_error_msg = "'verification_token' is a required property"

    assert survey_id_error_msg in rv.json.get('message')
    assert submission_json_error_msg not in rv.json.get('message')
    assert verification_token_error_msg not in rv.json.get('message')

    to_dict = {
    }
    headers = factory_auth_header(jwt=jwt, claims=claims)
    rv = client.post('/api/submission/', data=json.dumps(to_dict),
                     headers=headers, content_type='application/json')
    print(rv.json.get('message'))
    assert survey_id_error_msg in rv.json.get('message')
    assert submission_json_error_msg in rv.json.get('message')
    assert verification_token_error_msg in rv.json.get('message')
