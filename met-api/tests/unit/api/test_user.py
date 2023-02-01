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
from http import HTTPStatus
from unittest.mock import MagicMock

from met_api.utils.enums import ContentType, KeycloakGroupName, UserType
from tests.utilities.factory_scenarios import TestJwtClaims, TestUserInfo
from tests.utilities.factory_utils import factory_auth_header, factory_user_model


def test_create_public_user(client, jwt, session, ):  # pylint:disable=unused-argument
    """Assert that an user can be POSTed."""
    claims = TestJwtClaims.public_user_role
    headers = factory_auth_header(jwt=jwt, claims=claims)
    rv = client.put('/api/user/',
                    headers=headers, content_type=ContentType.JSON.value)
    assert rv.status_code == HTTPStatus.OK
    # TODO check this
    # assert rv.json.get('username') is not None
    assert rv.json.get('email_id') == claims.get('email')
    assert rv.json.get('access_type') == UserType.PUBLIC_USER.value


def test_create_staff_user(client, jwt, session, ):  # pylint:disable=unused-argument
    """Assert that an user can be POSTed."""
    claims = TestJwtClaims.staff_admin_role
    headers = factory_auth_header(jwt=jwt, claims=claims)
    rv = client.put('/api/user/',
                    headers=headers, content_type=ContentType.JSON.value)
    assert rv.status_code == HTTPStatus.OK
    assert rv.json.get('email_id') == claims.get('email')
    assert rv.json.get('access_type') == UserType.STAFF.value


def test_get_staff_users(client, jwt, session, ):  # pylint:disable=unused-argument
    """Assert that an user can be POSTed."""
    staff_1 = dict(TestUserInfo.user_staff_1)
    staff_2 = dict(TestUserInfo.user_staff_1)
    factory_user_model(user_info=staff_1)
    factory_user_model(user_info=staff_2)

    claims = TestJwtClaims.staff_admin_role
    headers = factory_auth_header(jwt=jwt, claims=claims)
    rv = client.get('/api/user/',
                    headers=headers, content_type=ContentType.JSON.value)
    assert rv.status_code == HTTPStatus.OK
    assert rv.json.get('total') == 2
    assert len(rv.json.get('items')) == 2


def test_get_staff_users_exclude_public_user(client, jwt, session, ):  # pylint:disable=unused-argument
    """Assert that an user can be POSTed."""
    staff_1 = dict(TestUserInfo.user_staff_1)
    staff_2 = dict(TestUserInfo.user_staff_1)
    public_1 = dict(TestUserInfo.user_public_1)
    public_email = public_1.get('email_id')
    staff_email = staff_1.get('email_id')
    factory_user_model(user_info=staff_1)
    factory_user_model(user_info=staff_2)
    factory_user_model(user_info=public_1)

    claims = TestJwtClaims.staff_admin_role
    headers = factory_auth_header(jwt=jwt, claims=claims)
    rv = client.get('/api/user/',
                    headers=headers, content_type=ContentType.JSON.value)
    assert rv.status_code == HTTPStatus.OK
    assert rv.json.get('total') == 2
    assert len(rv.json.get('items')) == 2
    # public user is not fetched
    public_user = _find_user(public_email, rv)
    assert public_user is None

    staff_user = _find_user(staff_email, rv)
    assert staff_user is not None


def test_add_user_to_admin_group(mocker, client, jwt, session):  # pylint:disable=unused-argument
    """Assert that you can add a user to admin group."""
    user = factory_user_model()

    mock_add_user_to_group_keycloak_response = MagicMock()
    mock_add_user_to_group_keycloak_response.status_code = HTTPStatus.NO_CONTENT
    mock_add_user_to_group_keycloak = mocker.patch(
        'met_api.services.keycloak.KeycloakService.add_user_to_group',
        return_value=mock_add_user_to_group_keycloak_response
    )
    mock_add_user_to_group_keycloak = mocker.patch(
        'met_api.services.keycloak.KeycloakService.get_user_groups',
        return_value=[{'name': KeycloakGroupName.EAO_IT_VIEWER.value}]
    )

    claims = TestJwtClaims.staff_admin_role
    headers = factory_auth_header(jwt=jwt, claims=claims)
    rv = client.post(
        f'/api/user/{user.external_id}/groups?group=Adminstrator',
        headers=headers, content_type=ContentType.JSON.value
    )
    assert rv.status_code == HTTPStatus.OK
    mock_add_user_to_group_keycloak.assert_called()


def _find_user(public_email, rv):
    return next((x for x in rv.json.get('items') if x.get('email_id') == public_email), None)
