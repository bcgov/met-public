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
from met_api.utils.roles import Role
from met_api.models.staff_user import StaffUser


def require_role(role, skip_tenant_check_for_admin=False):
    """Validate a token for roles and against tenant as well.

    Args:
        role (str): The role that the user is required to have.
        skip_tenant_check_for_admin (bool, optional): A flag to indicate
        whether to skip tenant checks for MET Admins.
            If set to True, tenant checks are skipped for users with MET
            administrative privileges.
            Defaults to False. Set it to True for cross tenant operations
            like first time adding a administrator to tenant.

    Returns:
        function: A decorator function that can be used to enforce
        role-based authorization.
    """

    def decorator(func):
        @wraps(func)
        @_jwt.has_one_of_roles(role)
        def wrapper(*args, **kwargs):
            # single tenanted env doesn't need tenant id checks..so pass
            if current_app.config.get('IS_SINGLE_TENANT_ENVIRONMENT'):
                return func(*args, **kwargs)

            # Get the tenant information from the JWT payload or any global context
            token_info: Dict = _get_token_info() or {}

            if skip_tenant_check_for_admin and is_met_global_admin(token_info):
                return func(*args, **kwargs)

            user_id = token_info.get('sub', None)
            # fetch user from the db
            user = StaffUser.get_user_by_external_id(user_id)
            if user and user.tenant_id == g.tenant_id:
                return func(*args, **kwargs)
            else:
                abort(HTTPStatus.FORBIDDEN,
                      description='The user does not exist or has no access to this tenant')

        return wrapper

    return decorator


def _get_token_info() -> Dict:
    return g.jwt_oidc_token_info if g and 'jwt_oidc_token_info' in g else {}


def is_met_global_admin(token_info) -> bool:
    """Return True if the user is MET Admin ie who can manage all tenants."""
    roles = current_app.config['JWT_ROLE_CALLBACK'](token_info)
    return Role.CREATE_TENANT.value in roles
