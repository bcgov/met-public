"""
Tests to verify the EngagementMembership API endpoints.

Test-Suite to ensure that the /engagements/{engagement_id}/memberships endpoint is working as expected.
"""
import json
from http import HTTPStatus
from unittest.mock import MagicMock

from met_api.constants.membership_type import MembershipType
from met_api.utils.enums import ContentType, KeycloakGroupName, MembershipStatus
from tests.utilities.factory_scenarios import TestJwtClaims
from tests.utilities.factory_utils import factory_auth_header, factory_engagement_model, factory_staff_user_model


memberships_url = '/api/engagements/{}/members'


def test_create_engagement_membership_team_member(mocker, client, jwt, session):
    """Assert that a team member engagement membership can be created."""
    engagement = factory_engagement_model()
    staff_user = factory_staff_user_model()
    headers = factory_auth_header(jwt=jwt, claims=TestJwtClaims.staff_admin_role)

    mock_add_user_to_group_keycloak_response = MagicMock()
    mock_add_user_to_group_keycloak_response.status_code = HTTPStatus.NO_CONTENT
    mock_add_user_to_group_keycloak = mocker.patch(
        'met_api.services.keycloak.KeycloakService.add_user_to_group',
        return_value=mock_add_user_to_group_keycloak_response
    )
    mock_get_users_groups_keycloak = mocker.patch(
        'met_api.services.keycloak.KeycloakService.get_users_groups',
        return_value={staff_user.external_id: [KeycloakGroupName.EAO_TEAM_MEMBER.value]}
    )

    data = {'user_id': staff_user.external_id}

    rv = client.post(
        memberships_url.format(engagement.id),
        data=json.dumps(data),
        headers=headers,
        content_type=ContentType.JSON.value
    )
    assert rv.status_code == HTTPStatus.OK
    assert rv.json.get('engagement_id') == engagement.id
    assert rv.json.get('user_id') == staff_user.id
    assert rv.json.get('type') == MembershipType.TEAM_MEMBER
    assert rv.json.get('status') == str(MembershipStatus.ACTIVE.value)
    mock_add_user_to_group_keycloak.assert_called()
    mock_get_users_groups_keycloak.assert_called()


def test_create_engagement_membership_reviewer(mocker, client, jwt, session):
    """Assert that a reviewer engagement membership can be created."""
    engagement = factory_engagement_model()
    staff_user = factory_staff_user_model()
    headers = factory_auth_header(jwt=jwt, claims=TestJwtClaims.staff_admin_role)

    mock_add_user_to_group_keycloak_response = MagicMock()
    mock_add_user_to_group_keycloak_response.status_code = HTTPStatus.NO_CONTENT
    mock_add_user_to_group_keycloak = mocker.patch(
        'met_api.services.keycloak.KeycloakService.add_user_to_group',
        return_value=mock_add_user_to_group_keycloak_response
    )
    mock_get_users_groups_keycloak = mocker.patch(
        'met_api.services.keycloak.KeycloakService.get_users_groups',
        return_value={staff_user.external_id: [KeycloakGroupName.EAO_REVIEWER.value]}
    )

    data = {'user_id': staff_user.external_id}

    rv = client.post(
        memberships_url.format(engagement.id),
        data=json.dumps(data),
        headers=headers,
        content_type=ContentType.JSON.value
    )
    assert rv.status_code == HTTPStatus.OK
    assert rv.json.get('engagement_id') == engagement.id
    assert rv.json.get('user_id') == staff_user.id
    assert rv.json.get('type') == MembershipType.REVIEWER
    assert rv.json.get('status') == str(MembershipStatus.ACTIVE.value)
    mock_add_user_to_group_keycloak.assert_called()
    mock_get_users_groups_keycloak.assert_called()


def test_create_engagement_membership_unauthorized(client, jwt, session):
    """Assert that creating an engagement membership without proper authorization fails."""
    engagement = factory_engagement_model()
    staff_user = factory_staff_user_model()
    headers = factory_auth_header(jwt=jwt, claims=TestJwtClaims.no_role)
    data = {'user_id': staff_user.external_id}

    rv = client.post(
        memberships_url.format(engagement.id),
        data=json.dumps(data),
        headers=headers,
        content_type=ContentType.JSON.value
    )
    assert rv.status_code == HTTPStatus.UNAUTHORIZED
