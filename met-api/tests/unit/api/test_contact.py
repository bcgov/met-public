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

"""Tests to verify the Contact API end-point.

Test-Suite to ensure that the Contact endpoint is working as expected.
"""
import json

import pytest

from met_api.utils.enums import ContentType
from tests.utilities.factory_scenarios import TestContactInfo, TestJwtClaims
from tests.utilities.factory_utils import factory_auth_header


@pytest.mark.parametrize('contact_info', [TestContactInfo.contact1])
def test_create_contact(client, jwt, session, contact_info):  # pylint:disable=unused-argument
    """Assert that a contact can be POSTed."""
    headers = factory_auth_header(jwt=jwt, claims=TestJwtClaims.no_role)
    rv = client.post('/api/contacts/', data=json.dumps(contact_info),
                     headers=headers, content_type=ContentType.JSON.value)
    assert rv.status_code == 200
    assert rv.json.get('result').get('name') == contact_info.get('name')
    assert rv.json.get('result').get('title') == contact_info.get('title')
    assert rv.json.get('result').get('phone_number') == contact_info.get('phone_number')
    assert rv.json.get('result').get('email') == contact_info.get('email')
    assert rv.json.get('result').get('address') == contact_info.get('address')
    assert rv.json.get('result').get('bio') == contact_info.get('bio')
