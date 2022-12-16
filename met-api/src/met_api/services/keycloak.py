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
"""Utils for keycloak administration."""
from typing import List

import requests
from flask import current_app

from met_api.utils.enums import ContentType


class KeycloakService:  # pylint: disable=too-few-public-methods
    """Keycloak services."""

    @staticmethod
    def get_user_groups(user_id):
        """Get user group from Keycloak by userid."""
        base_url = current_app.config.get('KEYCLOAK_BASE_URL')
        realm = current_app.config.get('KEYCLOAK_REALMNAME')
        timeout = current_app.config.get('CONNECT_TIMEOUT', 60)
        admin_token = KeycloakService._get_admin_token()
        headers = {
            'Content-Type': ContentType.JSON.value,
            'Authorization': f'Bearer {admin_token}'
        }

        # Get the user and return
        query_user_url = f'{base_url}/auth/admin/realms/{realm}/users/{user_id}/groups'
        response = requests.get(query_user_url, headers=headers, timeout=timeout)
        response.raise_for_status()
        return response.json()

    @staticmethod
    def get_users_groups(user_ids: List):
        """Get user groups from Keycloak by user ids.For bulk purposes."""
        # TODO if List is bigger than a number ; if so reject.
        base_url = current_app.config.get('KEYCLOAK_BASE_URL')
        # TODO fix this during tests and remove below
        if not base_url:
            return {}
        realm = current_app.config.get('KEYCLOAK_REALMNAME')
        timeout = current_app.config.get('CONNECT_TIMEOUT', 60)
        admin_token = KeycloakService._get_admin_token()
        headers = {
            'Content-Type': ContentType.JSON.value,
            'Authorization': f'Bearer {admin_token}'
        }
        user_group_mapping = {}
        # Get the user and return
        for user_id in user_ids:
            query_user_url = f'{base_url}/auth/admin/realms/{realm}/users/{user_id}/groups'
            response = requests.get(query_user_url, headers=headers, timeout=timeout)
            if response.status_code == 200:
                if (groups := response.json()) is not None:
                    user_group_mapping[user_id] = [group.get('name') for group in groups]
            else:
                user_group_mapping[user_id] = []
        return user_group_mapping

    @staticmethod
    def _get_group_id(admin_token: str, group_name: str):
        """Get a group id for the group name."""
        config = current_app.config
        base_url = config.get('KEYCLOAK_BASE_URL')
        realm = config.get('KEYCLOAK_REALMNAME')
        timeout = config.get('CONNECT_TIMEOUT', 60)
        get_group_url = f'{base_url}/auth/admin/realms/{realm}/groups?search={group_name}'
        headers = {
            'Content-Type': ContentType.JSON.value,
            'Authorization': f'Bearer {admin_token}'
        }
        response = requests.get(get_group_url, headers=headers, timeout=timeout)
        return KeycloakService._find_group_or_subgroup_id(response.json(), group_name)

    @staticmethod
    def _find_group_or_subgroup_id(groups: list, group_name: str):
        """Return group id by searching main and sub groups."""
        for group in groups:
            if group['name'] == group_name:
                return group['id']
            if group_id := KeycloakService._find_group_or_subgroup_id(group['subGroups'], group_name):
                return group_id
        return None

    @staticmethod
    def _get_admin_token():
        """Create an admin token."""
        config = current_app.config
        base_url = config.get('KEYCLOAK_BASE_URL')
        realm = config.get('KEYCLOAK_REALMNAME')
        admin_client_id = config.get(
            'KEYCLOAK_ADMIN_USERNAME')
        admin_secret = config.get('KEYCLOAK_ADMIN_SECRET')
        timeout = config.get('CONNECT_TIMEOUT', 60)
        headers = {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
        token_url = f'{base_url}/auth/realms/{realm}/protocol/openid-connect/token'
        response = requests.post(token_url,
                                 data=f'client_id={admin_client_id}&grant_type=client_credentials'
                                      f'&client_secret={admin_secret}', headers=headers,
                                 timeout=timeout)
        return response.json().get('access_token')

    @staticmethod
    def _remove_user_from_group(user_id: str, group_name: str):
        """Remove user from the keycloak group."""
        config = current_app.config
        base_url = config.get('KEYCLOAK_BASE_URL')
        realm = config.get('KEYCLOAK_REALMNAME')
        timeout = config.get('CONNECT_TIMEOUT', 60)
        # Create an admin token
        admin_token = KeycloakService._get_admin_token()
        # Get the '$group_name' group
        group_id = KeycloakService._get_group_id(admin_token, group_name)

        # Add user to the keycloak group '$group_name'
        headers = {
            'Content-Type': ContentType.JSON.value,
            'Authorization': f'Bearer {admin_token}'
        }
        remove_group_url = f'{base_url}/auth/admin/realms/{realm}/users/{user_id}/groups/{group_id}'
        response = requests.delete(remove_group_url, headers=headers,
                                   timeout=timeout)
        response.raise_for_status()

    @staticmethod
    def add_user_to_group(user_id: str, group_name: str):
        """Add user to the keycloak group."""
        config = current_app.config
        base_url = config.get('KEYCLOAK_BASE_URL')
        realm = config.get('KEYCLOAK_REALMNAME')
        timeout = config.get('CONNECT_TIMEOUT', 60)
        # Create an admin token
        admin_token = KeycloakService._get_admin_token()
        # Get the '$group_name' group
        group_id = KeycloakService._get_group_id(admin_token, group_name)

        # Add user to the keycloak group '$group_name'
        headers = {
            'Content-Type': ContentType.JSON.value,
            'Authorization': f'Bearer {admin_token}'
        }
        add_to_group_url = f'{base_url}/auth/admin/realms/{realm}/users/{user_id}/groups/{group_id}'
        response = requests.put(add_to_group_url, headers=headers,
                                timeout=timeout)
        response.raise_for_status()
