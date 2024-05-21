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

from flask_cors import cross_origin
from flask_restx import Namespace, Resource

from met_api.auth import auth
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


@cors_preflight('GET OPTIONS')
@API.route('/<tenant_id>')
class Tenant(Resource):
    """Resource for managing a single tenant."""

    @staticmethod
    @cross_origin(origins=allowedorigins())
    @auth.optional
    def get(tenant_id):
        """Fetch a tenant."""
        try:
            tenant = TenantService().get(tenant_id)

            return tenant, HTTPStatus.OK
        except ValueError as err:
            return str(err), HTTPStatus.INTERNAL_SERVER_ERROR
