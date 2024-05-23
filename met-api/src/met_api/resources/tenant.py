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
"""API endpoints for managing tenant resources."""

from http import HTTPStatus

from flask import request
from flask_cors import cross_origin
from flask_restx import Namespace, Resource
from marshmallow import ValidationError

from met_api.auth import auth
from met_api.auth import jwt as _jwt
from met_api.schemas import utils as schema_utils
from met_api.schemas.tenant import TenantSchema
from met_api.services.tenant_service import TenantService
from met_api.utils.roles import Role
from met_api.utils.tenant_validator import require_role
from met_api.utils.util import allowedorigins, cors_preflight


API = Namespace('tenants', description='Endpoints for Tenants Management')
"""Custom exception messages
"""


@cors_preflight('GET OPTIONS')
@API.route('/')
class Tenants(Resource):
    """Resource for managing tenants."""

    @staticmethod
    @cross_origin(origins=allowedorigins())
    @require_role(Role.SUPER_ADMIN.value)
    def get():
        """Fetch all tenants."""
        try:
            tenants = TenantService().get_all()

            return tenants, HTTPStatus.OK
        except ValueError as err:
            return str(err), HTTPStatus.INTERNAL_SERVER_ERROR

    @staticmethod
    @cross_origin(origins=allowedorigins())
    @_jwt.requires_auth
    def post():
        """Create a new tenant."""
        try:
            request_json = request.get_json()
            valid_format, errors = schema_utils.validate(request_json, 'tenant')
            if not valid_format:
                print(errors)
                return {'message': schema_utils.serialize(errors)}, HTTPStatus.BAD_REQUEST

            tenant = TenantSchema().load(request_json)
            created_tenant = TenantService().create(tenant)
            return created_tenant, HTTPStatus.CREATED
        except (KeyError, ValueError) as err:
            return str(err), HTTPStatus.INTERNAL_SERVER_ERROR
        except ValidationError as err:
            return str(err.messages), HTTPStatus.INTERNAL_SERVER_ERROR


@cors_preflight('GET PATCH DELETE OPTIONS')
@API.route('/<tenant_short_name>')
class Tenant(Resource):
    """Resource for managing a single tenant."""

    @staticmethod
    @cross_origin(origins=allowedorigins())
    @auth.optional
    def get(tenant_short_name: str):
        """Fetch a tenant."""
        try:
            tenant = TenantService().get(tenant_short_name)
            return tenant, HTTPStatus.OK

        except ValueError as err:
            return str(err), HTTPStatus.INTERNAL_SERVER_ERROR

    @staticmethod
    @cross_origin(origins=allowedorigins())
    @_jwt.requires_auth
    def delete(tenant_short_name: str):
        """Delete a tenant."""
        try:
            TenantService().delete(tenant_short_name)
            return {'status': 'success', 'message': 'Tenant deleted successfully'}, HTTPStatus.OK
        except KeyError as err:
            return str(err), HTTPStatus.INTERNAL_SERVER_ERROR
        except ValueError as err:
            return str(err), HTTPStatus.INTERNAL_SERVER_ERROR

    @staticmethod
    @cross_origin(origins=allowedorigins())
    @_jwt.requires_auth
    def patch(tenant_short_name: str):
        """Update a tenant."""
        try:
            request_json = request.get_json()
            valid_format, errors = schema_utils.validate(request_json, 'tenant_update')
            if not valid_format:
                return {'message': schema_utils.serialize(errors)}, HTTPStatus.BAD_REQUEST
            updated_tenant = TenantService().update(tenant_short_name, request_json)
            return updated_tenant, HTTPStatus.OK
        except (KeyError, ValueError) as err:
            return str(err), HTTPStatus.INTERNAL_SERVER_ERROR
        except ValidationError as err:
            return str(err.messages), HTTPStatus.INTERNAL_SERVER_ERROR
