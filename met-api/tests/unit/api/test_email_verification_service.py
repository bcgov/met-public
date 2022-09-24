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

"""Tests to verify the Engagement API end-point.

Test-Suite to ensure that the /user endpoint is working as expected.
"""
import json

from tests.utilities.factory_scenarios import TestJwtClaims
from tests.utilities.factory_utils import factory_auth_header, factory_survey_and_eng_model


def test_email_verification(client, jwt, session, notify_mock, ):  # pylint:disable=unused-argument
    """Assert that an Email can be sent."""
    claims = TestJwtClaims.public_user_role

    survey, eng = factory_survey_and_eng_model()
    to_dict = {
        'email_address': 'a@a.com',
        'survey_id': survey.id
    }
    headers = factory_auth_header(jwt=jwt, claims=claims)
    rv = client.post('/api/email_verification/', data=json.dumps(to_dict),
                     headers=headers, content_type='application/json')

    assert rv.status_code == 200
