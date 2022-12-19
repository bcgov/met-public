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

"""Tests to assure the Keycloak Service.

Test-Suite to ensure that the Keycloak Service is working as expected.
"""
from met_api.services.keycloak import KeycloakService
from tests.utilities.factory_scenarios import KeycloakScenario

KEYCLOAK_SERVICE = KeycloakService()


def test_keycloak_add_user(session):
    """Add user to Keycloak. Assert return a user with the same username as the username in request."""
    request = KeycloakScenario.create_user_request()
    user = KEYCLOAK_SERVICE.add_user(request)
    assert user.get('username') == request.get('username')


def test_keycloak_get_user_by_username(session):
    """Get user by username. Assert get a user with the same username as the username in request."""
    request = KeycloakScenario.create_user_request()
    KEYCLOAK_SERVICE.add_user(request)
    user = KEYCLOAK_SERVICE.get_user_by_username(request.get('username'))
    assert user.get('username') == request.get('username')


def test_keycloak_get_user_groups(session):
    """Get user by username. Assert get a user with the same username as the username in request."""
    request = KeycloakScenario.create_user_request()
    group_name = 'admins'
    KEYCLOAK_SERVICE.add_user(request)
    user = KEYCLOAK_SERVICE.get_user_by_username(request.get('username'))
    user_id = user.get('id')
    user_group = KEYCLOAK_SERVICE.get_users_groups([user_id])

    assert group_name not in user_group.get(user_id)
    # add the group
    KEYCLOAK_SERVICE.add_user_to_group(user_id, '%s' % group_name)
    user_group = KEYCLOAK_SERVICE.get_users_groups([user_id])
    assert group_name in user_group.get(user_id)
