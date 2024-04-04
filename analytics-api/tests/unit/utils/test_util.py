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

"""Tests to assure the CORS utilities.

Test-Suite to ensure that the CORS decorator is working as expected.
"""
import base64
import pytest
from urllib.parse import unquote

from analytics_api.utils.util import cors_preflight, escape_wam_friendly_url


TEST_CORS_METHODS_DATA = [
    ('GET'),
    ('PUT'),
    ('POST'),
    ('GET,PUT'),
    ('GET,POST'),
    ('PUT,POST'),
    ('GET,PUT,POST'),
]


@pytest.mark.parametrize('methods', TEST_CORS_METHODS_DATA)
def test_cors_preflight_post(methods):
    """Assert that the options methos is added to the class and that the correct access controls are set."""
    @cors_preflight(methods)  # pylint: disable=too-few-public-methods
    class TestCors():
        pass

    rv = TestCors().options()  # pylint: disable=no-member
    assert rv[0]['Access-Control-Allow-Origin'] == '*'
    assert rv[0]['Access-Control-Allow-Methods'] == methods


def test_escape_wam_friendly_url():
    """Assert conversion back yields same string."""
    org_name = 'foo-bar helo ..'
    org_name_encoded = escape_wam_friendly_url(org_name)
    param1 = unquote(org_name_encoded)
    org_name_actual = base64.b64decode(bytes(param1, encoding='utf-8')).decode('utf-8')
    assert org_name_actual == org_name
