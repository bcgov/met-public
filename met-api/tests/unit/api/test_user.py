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

"""
Tests to verify the Engagement API end-point.

Test-Suite to ensure that the /user endpoint is working as expected.
"""
import copy
from http import HTTPStatus
from unittest.mock import MagicMock, patch
import pytest
from flask import current_app

from met_api.exceptions.business_exception import BusinessException
from met_api.models import Tenant as TenantModel
from met_api.services.staff_user_membership_service import StaffUserMembershipService
from met_api.services.staff_user_service import StaffUserService
from met_api.utils.enums import ContentType, KeycloakGroupName, UserStatus
from tests.utilities.factory_scenarios import TestJwtClaims, TestUserInfo
from tests.utilities.factory_utils import factory_auth_header, factory_staff_user_model, set_global_tenant

KEYCLOAK_SERVICE_MODULE = 'met_api.services.keycloak.KeycloakService'


def mock_add_user_to_group(mocker, mock_group_names):
    """Mock the KeycloakService.add_user_to_group method."""
    mock_response = MagicMock()
    mock_response.status_code = HTTPStatus.NO_CONTENT

    mock_add_user_to_group_keycloak = mocker.patch(
        f'{KEYCLOAK_SERVICE_MODULE}.add_user_to_group',
        return_value=mock_response
    )
    mock_get_user_groups_keycloak = mocker.patch(
        f'{KEYCLOAK_SERVICE_MODULE}.get_user_groups',
        return_value=[{'name': group_name} for group_name in mock_group_names]
    )
    mock_get_user_groups_keycloak = mocker.patch(
        f'{KEYCLOAK_SERVICE_MODULE}.get_user_groups',
        return_value=[{'name': group_name} for group_name in mock_group_names]
    )

    mock_add_attribute_to_user = mocker.patch(
        f'{KEYCLOAK_SERVICE_MODULE}.add_attribute_to_user',
        return_value=mock_response
    )
    return mock_add_user_to_group_keycloak, mock_get_user_groups_keycloak, mock_add_attribute_to_user


@pytest.mark.parametrize('side_effect, expected_status', [
    (KeyError('Test error'), HTTPStatus.INTERNAL_SERVER_ERROR),
    (ValueError('Test error'), HTTPStatus.INTERNAL_SERVER_ERROR),
])
def test_create_staff_user(client, jwt, session, side_effect, expected_status):
    """Assert that a user can be POSTed."""
    claims = TestJwtClaims.staff_admin_role
    headers = factory_auth_header(jwt=jwt, claims=claims)
    rv = client.put('/api/user/', headers=headers, content_type=ContentType.JSON.value)
    assert rv.status_code == HTTPStatus.OK
    assert rv.json.get('email_address') == claims.get('email')
    tenant_short_name = current_app.config.get('DEFAULT_TENANT_SHORT_NAME')
    tenant = TenantModel.find_by_short_name(tenant_short_name)
    assert rv.json.get('tenant_id') == str(tenant.id)

    with patch.object(StaffUserService, 'create_or_update_user', side_effect=side_effect):
        rv = client.put('/api/user/', headers=headers, content_type=ContentType.JSON.value)
    assert rv.status_code == expected_status


def test_get_staff_users(client, jwt, session,
                         setup_admin_user_and_claims):
    """Assert that a user can be POSTed."""
    set_global_tenant()
    staff_1 = dict(TestUserInfo.user_staff_1)
    staff_2 = dict(TestUserInfo.user_staff_1)
    factory_staff_user_model(user_info=staff_1)
    factory_staff_user_model(user_info=staff_2)

    user, claims = setup_admin_user_and_claims
    headers = factory_auth_header(jwt=jwt, claims=claims)
    rv = client.get('/api/user/', headers=headers, content_type=ContentType.JSON.value)
    assert rv.status_code == HTTPStatus.OK
    assert rv.json.get('total') == 4
    assert len(rv.json.get('items')) == 4


@pytest.mark.parametrize('side_effect, expected_status', [
    (KeyError('Test error'), HTTPStatus.INTERNAL_SERVER_ERROR),
    (ValueError('Test error'), HTTPStatus.INTERNAL_SERVER_ERROR),
])
def test_add_user_to_admin_group(mocker, client, jwt, session, side_effect, expected_status,
                                 setup_admin_user_and_claims):
    """Assert that a user can be added to the admin group."""
    user = factory_staff_user_model()

    mock_add_user_to_group_keycloak, mock_get_user_groups_keycloak, mock_add_attribute_to_user = mock_add_user_to_group(
        mocker,
        [KeycloakGroupName.EAO_IT_VIEWER.value]
    )

    user, claims = setup_admin_user_and_claims
    headers = factory_auth_header(jwt=jwt, claims=claims)
    rv = client.post(
        f'/api/user/{user.external_id}/groups?group=Administrator',
        headers=headers,
        content_type=ContentType.JSON.value
    )
    assert rv.status_code == HTTPStatus.OK
    mock_add_user_to_group_keycloak.assert_called()
    mock_get_user_groups_keycloak.assert_called()
    mock_add_attribute_to_user.assert_called()

    with patch.object(StaffUserService, 'add_user_to_group', side_effect=side_effect):
        rv = client.post(
            f'/api/user/{user.external_id}/groups?group=Administrator',
            headers=headers,
            content_type=ContentType.JSON.value
        )
    assert rv.status_code == expected_status

    with patch.object(StaffUserService, 'add_user_to_group',
                      side_effect=BusinessException('Test error', status_code=HTTPStatus.INTERNAL_SERVER_ERROR)):
        rv = client.post(
            f'/api/user/{user.external_id}/groups?group=Administrator',
            headers=headers,
            content_type=ContentType.JSON.value
        )
    assert rv.status_code == HTTPStatus.INTERNAL_SERVER_ERROR


def test_add_user_to_reviewer_group(mocker, client, jwt, session,
                                    setup_admin_user_and_claims):
    """Assert that a user can be added to the reviewer group."""
    user = factory_staff_user_model()

    mock_add_user_to_group_keycloak, mock_get_user_groups_keycloak, mock_add_attribute_to_user = mock_add_user_to_group(
        mocker,
        [KeycloakGroupName.EAO_IT_VIEWER.value]
    )

    user, claims = setup_admin_user_and_claims
    headers = factory_auth_header(jwt=jwt, claims=claims)
    rv = client.post(
        f'/api/user/{user.external_id}/groups?group=Reviewer',
        headers=headers,
        content_type=ContentType.JSON.value
    )
    assert rv.status_code == HTTPStatus.OK
    mock_add_user_to_group_keycloak.assert_called()
    mock_get_user_groups_keycloak.assert_called()


def test_add_user_to_team_member_group(mocker, client, jwt, session,
                                       setup_admin_user_and_claims):
    """Assert that a user can be added to the team member group."""
    user = factory_staff_user_model()

    mock_add_user_to_group_keycloak, mock_get_user_groups_keycloak, mock_add_attribute_to_user = mock_add_user_to_group(
        mocker,
        [KeycloakGroupName.EAO_IT_VIEWER.value]
    )

    user, claims = setup_admin_user_and_claims
    headers = factory_auth_header(jwt=jwt, claims=claims)
    rv = client.post(
        f'/api/user/{user.external_id}/groups?group=TeamMember',
        headers=headers,
        content_type=ContentType.JSON.value
    )
    assert rv.status_code == HTTPStatus.OK
    mock_add_user_to_group_keycloak.assert_called()
    mock_get_user_groups_keycloak.assert_called()


def test_add_user_to_team_member_group_across_tenants(mocker, client, jwt, session):
    """Assert that a user can be added to the team member group."""
    set_global_tenant(tenant_id=1)
    user = factory_staff_user_model()

    mock_add_user_to_group_keycloak, mock_get_user_groups_keycloak, mock_add_attribute_to_user = mock_add_user_to_group(
        mocker,
        [KeycloakGroupName.EAO_IT_VIEWER.value]
    )

    claims = copy.deepcopy(TestJwtClaims.staff_admin_role.value)
    # sets a different tenant id in the request
    claims['tenant_id'] = 2
    headers = factory_auth_header(jwt=jwt, claims=claims)
    rv = client.post(
        f'/api/user/{user.external_id}/groups?group=TeamMember',
        headers=headers,
        content_type=ContentType.JSON.value
    )
    # assert staff admin cant do cross tenant operation
    assert rv.status_code == HTTPStatus.FORBIDDEN

    claims = copy.deepcopy(TestJwtClaims.met_admin_role.value)
    # sets a different tenant id in the request
    claims['tenant_id'] = 2
    headers = factory_auth_header(jwt=jwt, claims=claims)
    rv = client.post(
        f'/api/user/{user.external_id}/groups?group=TeamMember',
        headers=headers,
        content_type=ContentType.JSON.value
    )
    # assert MET admin can do cross tenant operation
    assert rv.status_code == HTTPStatus.OK

    mock_add_user_to_group_keycloak.assert_called()
    mock_get_user_groups_keycloak.assert_called()


def mock_toggle_user_status(mocker):
    """Mock the KeycloakService.add_user_to_group method."""
    mock_response = MagicMock()
    mock_response.status_code = HTTPStatus.NO_CONTENT

    mock_toggle_user_status = mocker.patch(
        f'{KEYCLOAK_SERVICE_MODULE}.toggle_user_enabled_status',
        return_value=mock_response
    )

    return mock_toggle_user_status


def test_toggle_user_active_status(mocker, client, jwt, session,
                                   setup_admin_user_and_claims):
    """Assert that a user can be toggled."""
    user = factory_staff_user_model()
    mocked_toggle_user_status = mock_toggle_user_status(mocker)

    assert user.status_id == UserStatus.ACTIVE.value
    user, claims = setup_admin_user_and_claims
    headers = factory_auth_header(jwt=jwt, claims=claims)
    rv = client.patch(
        f'/api/user/{user.external_id}/status',
        headers=headers,
        json={'active': False},
        content_type=ContentType.JSON.value
    )
    assert rv.status_code == HTTPStatus.OK
    assert rv.json.get('status_id') == UserStatus.INACTIVE.value
    mocked_toggle_user_status.assert_called()


def test_team_member_cannot_toggle_user_active_status(mocker, client, jwt, session,
                                                      setup_team_member_and_claims):
    """Assert that a team member cannot toggle user status."""
    user = factory_staff_user_model()
    mocked_toggle_user_status = mock_toggle_user_status(mocker)

    assert user.status_id == UserStatus.ACTIVE.value
    user, claims = setup_team_member_and_claims
    headers = factory_auth_header(jwt=jwt, claims=claims)
    rv = client.patch(
        f'/api/user/{user.external_id}/status',
        headers=headers,
        json={'active': False},
        content_type=ContentType.JSON.value
    )
    assert rv.status_code == HTTPStatus.UNAUTHORIZED
    mocked_toggle_user_status.assert_not_called()


def test_reviewer_cannot_toggle_user_active_status(mocker, client, jwt, session,
                                                   setup_reviewer_and_claims):
    """Assert that a reviewer cannot toggle user status."""
    user = factory_staff_user_model()
    mocked_toggle_user_status = mock_toggle_user_status(mocker)

    assert user.status_id == UserStatus.ACTIVE.value
    user, claims = setup_reviewer_and_claims
    headers = factory_auth_header(jwt=jwt, claims=claims)
    rv = client.patch(
        f'/api/user/{user.external_id}/status',
        headers=headers,
        json={'active': False},
        content_type=ContentType.JSON.value
    )
    assert rv.status_code == HTTPStatus.UNAUTHORIZED
    mocked_toggle_user_status.assert_not_called()


def test_toggle_user_active_status_empty_body(mocker, client, jwt, session,
                                              setup_admin_user_and_claims):
    """Assert that returns bad request if bad request body."""
    user = factory_staff_user_model()
    mocked_toggle_user_status = mock_toggle_user_status(mocker)

    assert user.status_id == UserStatus.ACTIVE.value
    user, claims = setup_admin_user_and_claims
    headers = factory_auth_header(jwt=jwt, claims=claims)
    rv = client.patch(
        f'/api/user/{user.external_id}/status',
        headers=headers,
        content_type=ContentType.JSON.value
    )
    assert rv.status_code == HTTPStatus.BAD_REQUEST
    mocked_toggle_user_status.assert_not_called()


def test_get_staff_users_by_id(client, jwt, session,
                               setup_admin_user_and_claims):
    """Assert that a user can be fetched."""
    user, claims = setup_admin_user_and_claims
    headers = factory_auth_header(jwt=jwt, claims=claims)
    rv = client.put('/api/user/', headers=headers, content_type=ContentType.JSON.value)
    assert rv.status_code == HTTPStatus.OK

    user_id = rv.json.get('id')
    rv = client.get(f'/api/user/{user_id}', headers=headers, content_type=ContentType.JSON.value)
    assert rv.status_code == HTTPStatus.OK
    assert rv.json.get('id') == user_id


@pytest.mark.parametrize('side_effect, expected_status', [
    (KeyError('Test error'), HTTPStatus.BAD_REQUEST),
    (ValueError('Test error'), HTTPStatus.BAD_REQUEST),
])
def test_errors_on_toggle_user_active_status(client, jwt, session, side_effect, expected_status,
                                             setup_admin_user_and_claims):
    """Assert that a user can be toggled."""
    user = factory_staff_user_model()

    assert user.status_id == UserStatus.ACTIVE.value
    user, claims = setup_admin_user_and_claims
    headers = factory_auth_header(jwt=jwt, claims=claims)

    with patch.object(StaffUserMembershipService, 'reactivate_deactivate_user', side_effect=side_effect):
        rv = client.patch(
            f'/api/user/{user.external_id}/status',
            headers=headers,
            json={'active': False},
            content_type=ContentType.JSON.value
        )
    assert rv.status_code == expected_status
