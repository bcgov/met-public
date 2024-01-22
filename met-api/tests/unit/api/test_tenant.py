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

"""Tests to verify the tenant API end-point.

Test-Suite to ensure that the tenant endpoint is working as expected.
"""
from http import HTTPStatus
from unittest.mock import patch

from met_api.services.tenant_service import TenantService
from met_api.utils.enums import ContentType
from tests.utilities.factory_scenarios import TestJwtClaims, TestTenantInfo
from tests.utilities.factory_utils import factory_auth_header, factory_tenant_model


def test_get_tenant(client, jwt, session):  # pylint:disable=unused-argument
    """Assert that a tenant can be fetched."""
    claims = TestJwtClaims.public_user_role

    tenant_data = TestTenantInfo.tenant1
    factory_tenant_model(tenant_data)
    tenant_short_name = tenant_data['short_name']

    headers = factory_auth_header(jwt=jwt, claims=claims)
    rv = client.get(f'/api/tenants/{tenant_short_name}', headers=headers, content_type=ContentType.JSON.value)

    assert rv.status_code == HTTPStatus.OK.value
    assert rv.json.get('name') == tenant_data['name']

    with patch.object(TenantService, 'get', side_effect=ValueError('Test error')):
        rv = client.get(f'/api/tenants/{tenant_short_name}',
                        headers=headers, content_type=ContentType.JSON.value)
    assert rv.status_code == HTTPStatus.INTERNAL_SERVER_ERROR
