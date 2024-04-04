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

from met_api.config import Config
from met_api.utils.enums import ContentType, KeycloakCompositeRoleNames


class KeycloakService:  # pylint: disable=too-few-public-methods
    """Keycloak services."""

    # pylint: disable=too-many-instance-attributes
    # Eight is reasonable in this case.
    def __init__(self):
        """Initialize Keycloak configuration."""
        keycloak = Config().KEYCLOAK_CONFIG
        self.base_url = keycloak['CSS_API_URL']
        self.realm = keycloak['REALMNAME']
        self.integration_id = keycloak['CSS_API_INTEGRATION_ID']
        self.environment = keycloak['CSS_API_ENVIRONMENT']
        self.timeout = keycloak['CONNECT_TIMEOUT']
        self.admin_base_url = keycloak['ADMIN_BASE_URL']
        self.admin_client_id = keycloak['ADMIN_USERNAME']
        self.admin_secret = keycloak['ADMIN_SECRET']

    def get_user_roles(self, user_id):
        """Get user composite roles from Keycloak by userid."""
        admin_token = self._get_admin_token()
        headers = {
            'Content-Type': ContentType.JSON.value,
            'Authorization': f'Bearer {admin_token}'
        }

        # Get the user and return
        query_user_url = (f'{self.base_url}/{self.integration_id}/'
                          f'{self.environment}/users/{user_id}/roles')
        response = requests.get(query_user_url, headers=headers, timeout=self.timeout)
        response.raise_for_status()
        return response.json()

    def get_users_roles(self, user_ids: List):
        """Get user composite roles from Keycloak by user ids."""
        # TODO if List is bigger than a number ; if so reject.
        admin_token = self._get_admin_token()
        headers = {
            'Content-Type': ContentType.JSON.value,
            'Authorization': f'Bearer {admin_token}'
        }
        user_role_mapping = {}
        # Get the user and return
        for user_id in user_ids:
            query_user_url = (f'{self.base_url}/{self.integration_id}/'
                              f'{self.environment}/users/{user_id}/roles')
            response = requests.get(query_user_url, headers=headers, timeout=self.timeout)
            if response.status_code == 200:
                if (roles := response.json().get('data')) is not None:
                    user_role_mapping[user_id] = [role.get('name') for role in roles]
            else:
                user_role_mapping[user_id] = []

        return user_role_mapping

    def _get_admin_token(self):
        """Create an admin token."""
        headers = {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
        token_url = f'{self.admin_base_url}/realms/{self.realm}/protocol/openid-connect/token'
        response = requests.post(
            token_url,
            headers=headers,
            timeout=self.timeout,
            data=f'client_id={self.admin_client_id}&grant_type=client_credentials'
                 f'&client_secret={self.admin_secret}'
        )
        return response.json().get('access_token')

    def assign_composite_role_to_user(self, user_id: str, composite_role: str):
        """Add user to the keycloak composite roles."""
        admin_token = self._get_admin_token()
        # Add user to the keycloak composite roles '$composite_role'
        headers = {
            'Content-Type': ContentType.JSON.value,
            'Authorization': f'Bearer {admin_token}'
        }
        add_to_role_url = f'{self.base_url}/{self.integration_id}/{self.environment}/users/{user_id}/roles'

        # Creating data payload
        data = [{'name': composite_role}]
        response = requests.post(add_to_role_url, headers=headers, json=data,
                                 timeout=self.timeout)
        response.raise_for_status()

    def remove_composite_role_from_user(self, user_id: str, role: str):
        """Remove user from the keycloak composite role."""
        # Create an admin token
        admin_token = self._get_admin_token()

        # Remove user from the keycloak composite role '$role'
        headers = {
            'Content-Type': ContentType.JSON.value,
            'Authorization': f'Bearer {admin_token}'
        }
        remove_from_role_url = f'{self.base_url}/{self.integration_id}/{self.environment}/users/{user_id}/roles/{role}'
        response = requests.delete(remove_from_role_url, headers=headers, timeout=self.timeout)
        response.raise_for_status()

    def toggle_user_enabled_status(self, user_id, enabled):
        """Toggle the enabled status of a user in Keycloak."""
        admin_token = self._get_admin_token()
        headers = {
            'Content-Type': ContentType.JSON.value,
            'Authorization': f'Bearer {admin_token}'
        }

        query_user_url = f'{self.base_url}/{self.integration_id}/{self.environment}/users/{user_id}/roles'
        response = requests.get(query_user_url, headers=headers, timeout=self.timeout)

        if response.status_code == 200 and enabled:
            role_name = KeycloakCompositeRoleNames.IT_VIEWER.value
            self.assign_composite_role_to_user(user_id=user_id, composite_role=role_name)

        if response.status_code == 200 and not enabled:
            roles_data = response.json().get('data', [])
            for role in roles_data:
                role_name = role.get('name')
                self.remove_composite_role_from_user(user_id=user_id, role=role_name)

        response.raise_for_status()
