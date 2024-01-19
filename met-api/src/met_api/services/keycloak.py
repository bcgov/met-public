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

import json
from typing import List

import requests
from flask import current_app

from met_api.utils.enums import ContentType


class KeycloakService:  # pylint: disable=too-few-public-methods
    """Keycloak services."""

    @staticmethod
    def get_user_groups(user_id):
        """Get user group from Keycloak by userid."""
        keycloak = current_app.config['KEYCLOAK_CONFIG']
        timeout = keycloak['CONNECT_TIMEOUT']
        base_url = keycloak['BASE_URL']
        realm = keycloak['REALMNAME']
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
        keycloak = current_app.config['KEYCLOAK_CONFIG']
        base_url = keycloak['BASE_URL']
        # TODO fix this during tests and remove below
        if not base_url:
            return {}
        keycloak = current_app.config['KEYCLOAK_CONFIG']
        realm = keycloak['REALMNAME']
        timeout = keycloak['CONNECT_TIMEOUT']
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
        keycloak = current_app.config['KEYCLOAK_CONFIG']
        base_url = keycloak['BASE_URL']
        realm = keycloak['REALMNAME']
        timeout = keycloak['CONNECT_TIMEOUT']
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
        keycloak = current_app.config['KEYCLOAK_CONFIG']
        admin_client_id = keycloak['ADMIN_USERNAME']
        admin_secret = keycloak['ADMIN_SECRET']
        timeout = keycloak['CONNECT_TIMEOUT']

        headers = {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
        token_issuer = current_app.config['JWT_CONFIG']['ISSUER']
        token_url = f'{token_issuer}/protocol/openid-connect/token'
        response = requests.post(
            token_url,
            headers=headers,
            timeout=timeout,
            data=f'client_id={admin_client_id}&grant_type=client_credentials'
                 f'&client_secret={admin_secret}'
        )
        return response.json().get('access_token')

    @staticmethod
    def _remove_user_from_group(user_id: str, group_name: str):
        """Remove user from the keycloak group."""
        keycloak = current_app.config['KEYCLOAK_CONFIG']
        base_url = keycloak['BASE_URL']
        realm = keycloak['REALMNAME']
        timeout = keycloak['CONNECT_TIMEOUT']
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
        keycloak = current_app.config['KEYCLOAK_CONFIG']
        base_url = keycloak['BASE_URL']
        realm = keycloak['REALMNAME']
        timeout = keycloak['CONNECT_TIMEOUT']
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

    @staticmethod
    def add_attribute_to_user(user_id: str, attribute_value: str, attribute_id: str = 'tenant_id'):
        """Add attribute to a keyclaok user.Default is set as tenant Id."""
        config = current_app.config
        base_url = config.get('KEYCLOAK_BASE_URL')
        realm = config.get('KEYCLOAK_REALMNAME')
        admin_token = KeycloakService._get_admin_token()

        tenant_attributes = {
            attribute_id: attribute_value
        }

        user_url = f'{base_url}/auth/admin/realms/{realm}/users/{user_id}'
        headers = {'Authorization': f'Bearer {admin_token}'}
        response = requests.get(user_url, headers=headers)
        user_data = response.json()
        user_data.setdefault('attributes', {}).update(tenant_attributes)
        requests.put(user_url, json=user_data, headers=headers)
        response.raise_for_status()

    @staticmethod
    def remove_user_from_group(user_id: str, group_name: str):
        """Remove user from the keycloak group."""
        keycloak = current_app.config['KEYCLOAK_CONFIG']
        base_url = keycloak['BASE_URL']
        realm = keycloak['REALMNAME']
        timeout = keycloak['CONNECT_TIMEOUT']
        # Create an admin token
        admin_token = KeycloakService._get_admin_token()
        # Get the '$group_name' group
        group_id = KeycloakService._get_group_id(admin_token, group_name)

        # Remove user from the keycloak group '$group_name'
        headers = {
            'Content-Type': ContentType.JSON.value,
            'Authorization': f'Bearer {admin_token}'
        }
        remove_from_group_url = f'{base_url}/auth/admin/realms/{realm}/users/{user_id}/groups/{group_id}'
        response = requests.delete(remove_from_group_url, headers=headers, timeout=timeout)
        response.raise_for_status()

    @staticmethod
    def add_user(user: dict):
        """Add user to Keycloak.Mainly used for Tests;Dont use it for actual user creation in application."""
        # Add user and set password
        admin_token = KeycloakService._get_admin_token()
        keycloak = current_app.config['KEYCLOAK_CONFIG']
        base_url = keycloak['BASE_URL']
        realm = keycloak['REALMNAME']
        timeout = keycloak['CONNECT_TIMEOUT']

        # Add user to the keycloak group '$group_name'
        headers = {
            'Content-Type': ContentType.JSON.value,
            'Authorization': f'Bearer {admin_token}'
        }

        add_user_url = f'{base_url}/auth/admin/realms/{realm}/users'
        response = requests.post(add_user_url, data=json.dumps(user), headers=headers,
                                 timeout=timeout)
        response.raise_for_status()

        return KeycloakService.get_user_by_username(user.get('username'), admin_token)

    @staticmethod
    def get_user_by_username(username, admin_token=None):
        """Get user from Keycloak by username."""
        keycloak = current_app.config['KEYCLOAK_CONFIG']
        base_url = keycloak['BASE_URL']
        realm = keycloak['REALMNAME']
        timeout = keycloak['CONNECT_TIMEOUT']
        if not admin_token:
            admin_token = KeycloakService._get_admin_token()

        headers = {
            'Content-Type': ContentType.JSON.value,
            'Authorization': f'Bearer {admin_token}'
        }
        # Get the user and return
        query_user_url = f'{base_url}/auth/admin/realms/{realm}/users?username={username}'
        response = requests.get(query_user_url, headers=headers, timeout=timeout)
        return response.json()[0]

    @staticmethod
    def toggle_user_enabled_status(user_id, enabled):
        """Toggle the enabled status of a user in Keycloak."""
        keycloak = current_app.config['KEYCLOAK_CONFIG']
        base_url = keycloak['BASE_URL']
        realm = keycloak['REALMNAME']
        timeout = keycloak['CONNECT_TIMEOUT']
        admin_token = KeycloakService._get_admin_token()
        headers = {
            'Content-Type': ContentType.JSON.value,
            'Authorization': f'Bearer {admin_token}'
        }

        user_data = {
            'enabled': enabled  # Set the user's enabled status based on 'enable' parameter
        }

        # Update the user's enabled status
        update_user_url = f'{base_url}/auth/admin/realms/{realm}/users/{user_id}'
        response = requests.put(update_user_url, json=user_data, headers=headers, timeout=timeout)
        response.raise_for_status()
