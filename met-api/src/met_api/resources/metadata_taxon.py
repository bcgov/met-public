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
"""
API endpoints for managing a tenant's metadata taxa.

This determines what taxa are available for a tenant's normal users to select when creating a new
engagement. This API is located at /api/tenants/<tenant_id>/metadata/taxa
"""

from functools import wraps
from http import HTTPStatus
from typing import Callable
from flask import abort, g, request
from flask_cors import cross_origin
from flask_restx import Namespace, Resource, fields
from marshmallow import ValidationError
from met_api.auth import auth_methods
from met_api.models.tenant import Tenant
from met_api.services.metadata_taxon_service import MetadataTaxonService
from met_api.utils.roles import Role
from met_api.utils.tenant_validator import require_role
from met_api.utils.util import allowedorigins, cors_preflight


VIEW_TAXA_ROLES = [Role.VIEW_ENGAGEMENT.value, Role.CREATE_ENGAGEMENT.value]
MODIFY_TAXA_ROLES = [Role.EDIT_ENGAGEMENT.value]
TAXON_NOT_FOUND_MSG = 'Metadata taxon was not found'

API = Namespace('metadata_taxa', description='Endpoints for managing the taxa '
                "that organize a tenant's metadata. Admin-level users only.",
                authorizations=auth_methods)

taxon_service = MetadataTaxonService()

taxon_modify_model = API.model('MetadataTaxon', taxon_model_dict := {
    'name': fields.String(required=False, description='The name of the taxon'),
    'description': fields.String(required=False, description='The taxon description'),
    'freeform': fields.Boolean(required=False, description='Whether the taxon is freeform'),
    'default_value': fields.String(required=False, description='The default value for the taxon'),
    'data_type': fields.String(required=False, description='The data type for the taxon'),
    'one_per_engagement': fields.Boolean(required=False, description='Whether the taxon is limited'
                                         ' to one entry per engagement'),
})

taxon_return_model = API.model('MetadataTaxonReturn', {
    'id': fields.Integer(required=True, description='The id of the taxon'),
    'tenant_id': fields.Integer(required=True, description='The tenant id'),
    'position': fields.Integer(required=False,
                               description="The taxon's position within the tenant"),
    **taxon_model_dict
})

params = {'tenant_id': 'The short name of the tenant'}

responses = {
    HTTPStatus.UNAUTHORIZED.value: 'No known user logged in',
    HTTPStatus.BAD_REQUEST.value: 'Invalid request',
    HTTPStatus.FORBIDDEN.value: 'Not authorized to access taxa for tenant',
    HTTPStatus.NOT_FOUND.value: 'Tenant not found',
    HTTPStatus.INTERNAL_SERVER_ERROR.value: 'Internal server error'
}


def ensure_tenant_access():
    """
    Ensure that the user is authorized to access the tenant specified in the request.

    This decorator should be used on any endpoint that requires
    access to a tenant's data. Makes the tenant accessible via kwargs.
    """
    def wrapper(f: Callable):
        @wraps(f)
        def decorated_function(*args, **func_kwargs):
            tenant_short_name = func_kwargs.pop('tenant_name')
            tenant = Tenant.find_by_short_name(tenant_short_name)
            if not tenant:
                abort(HTTPStatus.NOT_FOUND,
                      f'Tenant with short name {tenant_short_name} not found')
            if tenant.short_name.upper() != g.tenant_name:
                abort(HTTPStatus.FORBIDDEN,
                      f'You are not authorized to access tenant {tenant_short_name}')
            func_kwargs['tenant'] = tenant
            return f(*args, **func_kwargs)
        return decorated_function
    return wrapper


@cors_preflight('GET,POST,PATCH,OPTIONS')
@API.route('/taxa')  # /api/tenants/{tenant.short_name}/metadata/taxa
@API.doc(params=params, security='apikey', responses=responses)
class MetadataTaxa(Resource):
    """Resource for managing engagement metadata taxa."""

    @staticmethod
    @cross_origin(origins=allowedorigins())
    @API.marshal_list_with(taxon_return_model)
    @ensure_tenant_access()
    @require_role(VIEW_TAXA_ROLES)
    def get(tenant: Tenant):
        """Fetch a list of metadata taxa by tenant id."""
        tenant_taxa = taxon_service.get_by_tenant(tenant.id)
        return tenant_taxa, HTTPStatus.OK

    @staticmethod
    @cross_origin(origins=allowedorigins())
    @API.expect(taxon_modify_model)
    @API.marshal_with(taxon_return_model, code=HTTPStatus.CREATED)  # type: ignore
    @ensure_tenant_access()
    @require_role(MODIFY_TAXA_ROLES)
    def post(tenant: Tenant):
        """Create a new metadata taxon for a tenant and return it."""
        request_json = request.get_json(force=True)
        try:
            metadata_taxon = taxon_service.create(tenant.id, request_json)
            return metadata_taxon, HTTPStatus.CREATED
        except ValidationError as err:
            return err.messages, HTTPStatus.BAD_REQUEST
        except ValueError as err:
            return str(err), HTTPStatus.INTERNAL_SERVER_ERROR

    @staticmethod
    @cross_origin(origins=allowedorigins())
    @API.expect({'taxon_ids': fields.List(fields.Integer(required=True))})
    @API.marshal_list_with(taxon_return_model)
    @ensure_tenant_access()
    @require_role(MODIFY_TAXA_ROLES)
    def patch(tenant: Tenant):
        """Reorder the tenant's metadata taxa."""
        request_json = request.get_json(force=True)
        try:
            taxon_ids = request_json['taxon_ids']
            taxon_service.reorder_tenant(tenant.id, taxon_ids)
            return taxon_service.get_by_tenant(tenant.id), HTTPStatus.OK
        except ValidationError as err:
            return err.messages, HTTPStatus.BAD_REQUEST
        except ValueError as err:
            return str(err), HTTPStatus.INTERNAL_SERVER_ERROR


params['taxon_id'] = 'The numeric id of the taxon'
responses[HTTPStatus.NOT_FOUND.value] = 'Metadata taxon or tenant not found'


@cors_preflight('GET,PATCH,DELETE,OPTIONS')
@API.route('/taxon/<taxon_id>')  # /tenants/<tenant_id>/metadata/taxon/<taxon_id>
@API.doc(security='apikey', params=params, responses=responses)
class MetadataTaxon(Resource):
    """Resource for managing a single metadata taxon."""

    @staticmethod
    @cross_origin(origins=allowedorigins())
    @ensure_tenant_access()
    @require_role(VIEW_TAXA_ROLES)
    @API.marshal_with(taxon_return_model)
    def get(tenant: Tenant, taxon_id: int):
        """Fetch a single metadata taxon matching the provided id."""
        metadata_taxon = taxon_service.get_by_id(taxon_id)
        if not metadata_taxon or metadata_taxon['tenant_id'] != tenant.id:
            return TAXON_NOT_FOUND_MSG, HTTPStatus.NOT_FOUND
        return metadata_taxon, HTTPStatus.OK

    @staticmethod
    @cross_origin(origins=allowedorigins())
    @API.expect(taxon_modify_model)
    @API.marshal_with(taxon_return_model)
    @ensure_tenant_access()
    @require_role(MODIFY_TAXA_ROLES)
    def patch(tenant: Tenant, taxon_id: int):
        """Update a metadata taxon."""
        metadata_taxon = taxon_service.get_by_id(taxon_id)
        if not metadata_taxon or metadata_taxon['tenant_id'] != tenant.id:
            return TAXON_NOT_FOUND_MSG, HTTPStatus.NOT_FOUND
        patch = {**request.get_json(), 'tenant_id': tenant.id}
        return taxon_service.update(taxon_id, patch), HTTPStatus.OK

    @staticmethod
    @cross_origin(origins=allowedorigins())
    @ensure_tenant_access()
    @require_role(MODIFY_TAXA_ROLES)
    @API.doc(responses={**responses, HTTPStatus.NO_CONTENT.value: 'Taxon deleted'})
    def delete(tenant: Tenant, taxon_id: int):
        """Delete a metadata taxon."""
        try:
            metadata_taxon = taxon_service.get_by_id(taxon_id)
            if not metadata_taxon or metadata_taxon['tenant_id'] != tenant.id:
                return TAXON_NOT_FOUND_MSG, HTTPStatus.NOT_FOUND
            taxon_service.delete(taxon_id)
            return {}, HTTPStatus.NO_CONTENT
        except ValueError as err:
            return str(err), HTTPStatus.INTERNAL_SERVER_ERROR
