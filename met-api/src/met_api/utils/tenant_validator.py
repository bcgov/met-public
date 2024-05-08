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
from typing import Dict, List

from flask import current_app, g

from met_api.auth import jwt as _jwt
from met_api.utils.roles import Role


def require_role(required_roles: List[str] | str) -> callable:
    """Validate a token for roles and against tenant as well.

    Args:
        required_roles (str|list[str]): The role(s) that the user is required to have.

    Returns:
        function: A decorator function that can be used to enforce
        role-based authorization.
    """
    # allow for a single role or a list of roles
    if isinstance(required_roles, str):
        required_roles = [required_roles]

    def decorator(func: callable) -> callable:
        @wraps(func)
        @_jwt.has_one_of_roles({Role.SUPER_ADMIN.value}.union(required_roles))
        def wrapper(*args, **kwargs) -> callable:
            return func(*args, **kwargs)

        return wrapper

    return decorator


def _get_token_info() -> Dict:
    return g.jwt_oidc_token_info if g and 'jwt_oidc_token_info' in g else {}


def is_met_global_admin(token_info) -> bool:
    """Return True if the user is a MET Admin who can manage all tenants."""
    roles = current_app.config['JWT_ROLE_CALLBACK'](token_info)
    return Role.SUPER_ADMIN.value in roles
