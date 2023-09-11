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
import json

import requests
from flask import current_app
# pylint:disable=ungrouped-imports
from requests.exceptions import ConnectionError as ReqConnectionError
from requests.exceptions import ConnectTimeout, HTTPError

from met_api.utils.enums import AuthHeaderType, ContentType


class RestService:
    """Service to invoke Rest services which uses OAuth 2.0 implementation."""

    @staticmethod
    def post(endpoint, token=None,  # pylint: disable=too-many-arguments
             auth_header_type: AuthHeaderType = AuthHeaderType.BEARER,
             content_type: ContentType = ContentType.JSON, data=None, raise_for_status: bool = True):
        """POST service."""
        current_app.logger.debug('<post')

        headers = {
            'Authorization': auth_header_type.value.format(token),
            'Content-Type': content_type.value
        }
        if content_type == ContentType.JSON:
            data = json.dumps(data)

        current_app.logger.debug(f'Endpoint : {endpoint}')
        current_app.logger.debug(f'headers : {headers}')
        response = None
        try:
            response = requests.post(endpoint, data=data, headers=headers,
                                     timeout=current_app.config.get('CONNECT_TIMEOUT'))
            if raise_for_status:
                response.raise_for_status()
        except (ReqConnectionError, ConnectTimeout) as exc:
            current_app.logger.error('---Error on POST---')
            current_app.logger.error(exc)
            raise Exception(exc) from exc
        except HTTPError as exc:
            current_app.logger.error(f'HTTPError on POST with status code {response.status_code if response else ""}')
            if response and response.status_code >= 500:
                raise Exception(exc) from exc
            raise exc
        finally:
            current_app.logger.info(f'response : {response.text if response else ""}')

        current_app.logger.debug('>post')
        return response

    @staticmethod
    def get_service_account_token(kc_service_id: str = None, kc_secret: str = None, issuer_url: str = None) -> str:
        """Generate a service account token."""
        kc_service_id = kc_service_id or current_app.config.get('KEYCLOAK_SERVICE_ACCOUNT_ID')
        kc_secret = kc_secret or current_app.config.get('KEYCLOAK_SERVICE_ACCOUNT_SECRET')
        issuer_url = issuer_url or current_app.config.get('JWT_OIDC_ISSUER')

        if kc_service_id is None or kc_secret is None or issuer_url is None:
            raise ValueError('Missing required parameters')

        token_url = issuer_url + '/protocol/openid-connect/token'
        auth_response = requests.post(token_url, auth=(kc_service_id, kc_secret), headers={
            'Content-Type': ContentType.FORM_URL_ENCODED.value}, data='grant_type=client_credentials')
        auth_response.raise_for_status()
        return auth_response.json().get('access_token')
