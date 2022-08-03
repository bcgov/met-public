# Copyright © 2019 Province of British Columbia
#
# Licensed under the Apache License, Version 2.0 (the 'License');
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an 'AS IS' BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
"""Service to invoke Rest services."""
import requests
from flask import current_app

from met_api.utils.enums import ContentType


class RestService:  # pylint: disable=too-few-public-methods
    """Service to invoke Rest services which uses OAuth 2.0 implementation."""

    @staticmethod
    def get_service_account_token() -> str:
        """Generate a service account token."""
        kc_service_id = current_app.config.get('KEYCLOAK_SERVICE_ACCOUNT_ID')
        kc_secret = current_app.config.get('KEYCLOAK_SERVICE_ACCOUNT_SECRET')
        issuer_url = current_app.config.get('JWT_OIDC_ISSUER')
        # https://sso-dev.pathfinder.gov.bc.ca/auth/realms/fcf0kpqr/protocol/openid-connect/token
        token_url = issuer_url + '/protocol/openid-connect/token'
        auth_response = requests.post(token_url, auth=(kc_service_id, kc_secret), headers={
            'Content-Type': ContentType.FORM_URL_ENCODED.value}, data='grant_type=client_credentials')
        auth_response.raise_for_status()
        return auth_response.json().get('access_token')
