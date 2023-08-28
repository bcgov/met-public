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

"""Roles validator decorator.

A simple decorator to validate roles with in the tenant.
"""
from functools import wraps
from http import HTTPStatus
from typing import Dict

from flask import abort, current_app, g

from met_api.auth import jwt as _jwt
from met_api.utils.constants import TENANT_ID_JWT_CLAIM


def require_role(role):
    """Validate a token for roles and against tenant as well."""

    def decorator(func):
        @wraps(func)
        @_jwt.has_one_of_roles(role)
        def wrapper(*args, **kwargs):
            # Get the tenant information from the JWT payload or any global context
            token_info: Dict = _get_token_info() or {}
            tenant_id = token_info.get(TENANT_ID_JWT_CLAIM, None)
            current_app.logger.debug(f'Tenant Id From JWT Claim {tenant_id}')
            current_app.logger.debug(f'Tenant Id From g {g.tenant_id}')
            if g.tenant_id and str(g.tenant_id) == str(tenant_id):
                return func(*args, **kwargs)
            else:
                abort(HTTPStatus.FORBIDDEN,
                      description='The user has no access to this tenant')

        return wrapper

    return decorator


def _get_token_info() -> Dict:
    return g.jwt_oidc_token_info if g and 'jwt_oidc_token_info' in g else {}
