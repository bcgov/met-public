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
from met_api.utils.enums import ContentType
from tests.utilities.factory_scenarios import TestJwtClaims
from tests.utilities.factory_utils import factory_auth_header


def test_create_user(client, jwt, session, ):  # pylint:disable=unused-argument
    """Assert that an user can be POSTed."""
    claims = TestJwtClaims.public_user_role
    headers = factory_auth_header(jwt=jwt, claims=claims)
    rv = client.put('/api/user/',
                    headers=headers, content_type=ContentType.JSON.value)
    assert rv.status_code == 200
    print(rv.json)
    assert rv.json.get('status') is True
    assert rv.json.get('id') is not None
    assert rv.json.get('message') == ''
    assert rv.json.get('result').get('email_id') == claims.get('email')
    assert rv.json.get('result').get('external_id') == claims.get('sub')
