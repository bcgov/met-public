# Copyright © 2021 Province of British Columbia
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
"""Bring in the common JWT Manager."""
from functools import wraps

from flask import g, request
from flask_jwt_oidc import JwtManager
from flask_jwt_oidc.exceptions import AuthError

from met_api.utils.constants import TENANT_ID_HEADER

auth_methods = {  # for swagger documentation
    'apikey': {
        'type': 'apiKey',
        'in': 'header',
        'name': 'Authorization'
    },
    'tenant': {
        'type': 'apiKey',
        'in': 'header',
        'name': TENANT_ID_HEADER
    }
}


class Auth(JwtManager):  # pylint: disable=too-few-public-methods
    """Extends the JwtManager to include additional functionalities."""

    @classmethod
    def require(cls, f):
        """Validate the Bearer Token."""

        @auth.requires_auth
        @wraps(f)
        def decorated(*args, **kwargs):
            g.authorization_header = request.headers.get('Authorization', None)
            g.token_info = g.jwt_oidc_token_info
            return f(*args, **kwargs)

        return decorated

    @classmethod
    def optional(cls, f):
        """Validate an optional Bearer Token."""

        @wraps(f)
        def decorated(*args, **kwargs):
            try:
                token = jwt.get_token_auth_header()
                # pylint: disable=protected-access
                jwt._validate_token(token)
                g.authorization_header = request.headers.get(
                    'Authorization', None)
                g.token_info = g.jwt_oidc_token_info
            except AuthError:
                g.authorization_header = None
                g.token_info = None
            return f(*args, **kwargs)

        return decorated


jwt = auth = (
    Auth()
)
