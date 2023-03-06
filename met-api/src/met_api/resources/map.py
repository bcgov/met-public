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
"""API endpoints for managing a FOI Requests resource."""

from http import HTTPStatus

from flask import request
from flask_cors import cross_origin
from flask_restx import Namespace, Resource
from met_api.exceptions.business_exception import BusinessException
from met_api.auth import jwt as _jwt
from met_api.services.widget_map_service import WidgetMapService
from met_api.schemas.map import WidgetMapSchema
from met_api.utils.roles import Role
from met_api.utils.util import allowedorigins, cors_preflight


API = Namespace('map', description='Endpoints for Map Widget Management')
"""Custom exception messages"""


@cors_preflight('GET, POST, OPTIONS')
@API.route('/map')
class Map(Resource):
    """Resource for managing map widgets."""

    @staticmethod
    @cross_origin(origins=allowedorigins())
    @_jwt.has_one_of_roles([Role.EDIT_ENGAGEMENT.value])
    def get(widget_id):
        """Get map widget."""
        try:
            widget_map = WidgetMapService().get_map(widget_id)
            return WidgetMapSchema().dump(widget_map), HTTPStatus.OK
        except BusinessException as err:
            return str(err), err.status_code

    @staticmethod
    @cross_origin(origins=allowedorigins())
    @_jwt.has_one_of_roles([Role.EDIT_ENGAGEMENT.value])
    def post(widget_id):
        """Create map widget."""
        request_json = request.get_json()
        try:
            widget_map = WidgetMapService().create_map(widget_id, request_json)
            return WidgetMapSchema().dump(widget_map), HTTPStatus.OK
        except BusinessException as err:
            return str(err), err.status_code


@cors_preflight('PATCH')
@API.route('widget/<widget_id>/map/<map_id>')
class MapUpdate(Resource):
    """Resource for updating map widgets."""

    @staticmethod
    @cross_origin(origins=allowedorigins())
    @_jwt.has_one_of_roles([Role.EDIT_ENGAGEMENT.value])
    def get(widget_id):
        """Update map widget."""
        request_json = request.get_json()
        try:
            widget_map = WidgetMapService().update_map(widget_id, request_json)
            return WidgetMapSchema().dump(widget_map), HTTPStatus.OK
        except BusinessException as err:
            return str(err), err.status_code
