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
from met_api.utils.roles import Role
from jose import jwt as jose_jwt
from flask import current_app

jwt = (
    JwtManager()
)  # pylint: disable=invalid-name; lower case name as used by convention in most Flask apps


class Auth:  # pylint: disable=too-few-public-methods
    """Extending JwtManager to include additional functionalities."""

    @classmethod
    def require(cls, f):
        """Validate the Bearer Token."""

        @jwt.requires_auth
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
                g.authorization_header = request.headers.get('Authorization', None)
                g.token_info = g.jwt_oidc_token_info
            except AuthError:
                g.authorization_header = None
                g.token_info = None
            return f(*args, **kwargs)

        return decorated  

    @classmethod
    def contains_role(self, roles):
        """Check that the listed roles are in the token using the registered callback.

        Args:
            roles [str,]: Comma separated list of valid roles
            JWT_ROLE_CALLBACK (fn): The callback added to the Flask configuration
        """
        token = jwt.get_token_auth_header()
        unverified_claims = jose_jwt.get_unverified_claims(token)
        roles_in_token = current_app.config['JWT_ROLE_CALLBACK'](
            unverified_claims)
        if any(elem in roles_in_token for elem in roles):
            return True
        return False

    @classmethod
    def has_role(cls, roles):
        """Validate an optional Bearer Token."""
        def decorated(f):
            @wraps(f)
            def wrapper(*args, **kwargs):
                # jwt._require_auth_validation(*args, **kwargs)
                if cls.contains_role(roles):
                    return f(*args, **kwargs)
                raise AuthError({'code': 'missing_a_valid_role',
                                 'description':
                                     'Missing a role required to access this endpoint'}, 401)
            return wrapper
        return decorated


auth = (
    Auth()
)
