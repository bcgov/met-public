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

"""Tests to verify the user membership operations.

Test-Suite to ensure that the user membership endpoints are working as expected.
"""
from http import HTTPStatus
from unittest.mock import MagicMock, patch
import pytest

from met_api.exceptions.business_exception import BusinessException
from met_api.models.membership import Membership as MembershipModel
from met_api.services.staff_user_membership_service import StaffUserMembershipService
from met_api.utils.enums import ContentType, KeycloakGroupName, MembershipStatus, UserStatus
from tests.utilities.factory_scenarios import TestJwtClaims
from tests.utilities.factory_utils import (
    factory_auth_header, factory_engagement_model, factory_membership_model, factory_staff_user_model)


KEYCLOAK_SERVICE_MODULE = 'met_api.services.keycloak.KeycloakService'


def mock_keycloak_methods(mocker, mock_group_names):
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

    mock_add_attribute_to_user = mocker.patch(
        f'{KEYCLOAK_SERVICE_MODULE}.add_attribute_to_user',
        return_value=mock_response
    )

    mock_remove_user_from_group_keycloak = mocker.patch(
        f'{KEYCLOAK_SERVICE_MODULE}.remove_user_from_group',
        return_value=mock_response
    )

    return (
        mock_add_user_to_group_keycloak,
        mock_get_user_groups_keycloak,
        mock_add_attribute_to_user,
        mock_remove_user_from_group_keycloak
    )


@pytest.mark.parametrize('side_effect, expected_status', [
    (KeyError('Test error'), HTTPStatus.INTERNAL_SERVER_ERROR),
    (ValueError('Test error'), HTTPStatus.INTERNAL_SERVER_ERROR),
])
def test_reassign_user_reviewer_team_member(mocker, client, jwt, session, side_effect, expected_status):
    """Assert that returns bad request if bad request body."""
    user = factory_staff_user_model()
    eng = factory_engagement_model()
    current_membership = factory_membership_model(user_id=user.id, engagement_id=eng.id)
    assert current_membership.status == MembershipStatus.ACTIVE.value
    mock_response = MagicMock()
    mock_response.status_code = HTTPStatus.NO_CONTENT

    (
        mock_add_user_to_group_keycloak,
        mock_get_user_groups_keycloak,
        mock_add_attribute_to_user,
        mock_remove_user_from_group_keycloak
    ) = mock_keycloak_methods(
        mocker,
        [KeycloakGroupName.EAO_REVIEWER.value]
    )

    mock_get_users_groups_keycloak = mocker.patch(
        f'{KEYCLOAK_SERVICE_MODULE}.get_users_groups',
        return_value={user.external_id: [KeycloakGroupName.EAO_REVIEWER.value]}
    )

    assert user.status_id == UserStatus.ACTIVE.value
    claims = TestJwtClaims.staff_admin_role
    headers = factory_auth_header(jwt=jwt, claims=claims)

    rv = client.put(
        f'/api/user/{user.id}/groups?group=EAO_TEAM_MEMBER',
        headers=headers,
        content_type=ContentType.JSON.value
    )

    assert rv.status_code == HTTPStatus.OK
    mock_add_user_to_group_keycloak.assert_called()
    mock_get_user_groups_keycloak.assert_called()
    mock_add_attribute_to_user.assert_called()
    mock_remove_user_from_group_keycloak.assert_called()
    mock_get_users_groups_keycloak.assert_called()

    memberships = MembershipModel.find_by_user_id(user.id)
    assert len(memberships) == 1
    assert memberships[0].status == MembershipStatus.REVOKED.value

    with patch.object(StaffUserMembershipService, 'reassign_user', side_effect=side_effect):
        rv = client.put(
            f'/api/user/{user.id}/groups?group=EAO_TEAM_MEMBER',
            headers=headers,
            content_type=ContentType.JSON.value
        )
    assert rv.status_code == expected_status

    with patch.object(StaffUserMembershipService, 'reassign_user',
                      side_effect=BusinessException('Test error', status_code=HTTPStatus.INTERNAL_SERVER_ERROR)):
        rv = client.put(
            f'/api/user/{user.id}/groups?group=EAO_TEAM_MEMBER',
            headers=headers,
            content_type=ContentType.JSON.value
        )
    assert rv.status_code == HTTPStatus.INTERNAL_SERVER_ERROR
