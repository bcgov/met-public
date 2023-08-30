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
"""API endpoints for managing a shapefile resource."""

from http import HTTPStatus

from flask import jsonify, make_response, request
from flask_cors import cross_origin
from flask_restx import Namespace, Resource

from met_api.exceptions.business_exception import BusinessException
from met_api.services.shapefile_service import ShapefileService
from met_api.utils.roles import Role
from met_api.utils.tenant_validator import require_role
from met_api.utils.util import allowedorigins, cors_preflight


API = Namespace('shapefile', description='Endpoints for shapefile preview')
"""Shapefile Maps"""


@cors_preflight('POST, OPTIONS')
@API.route('')
class ShapeFile(Resource):
    """Resource for managing map shapefile."""

    @staticmethod
    @cross_origin(origins=allowedorigins())
    @require_role([Role.EDIT_ENGAGEMENT.value])
    def post():
        """Convert and return the geojson of shapefile."""
        try:
            file = request.files.get('file')
            if not file:
                return jsonify({'error': 'No file uploaded.'}), HTTPStatus.BAD_REQUEST
            geojson = ShapefileService().convert_to_geojson(file)
            response = make_response(geojson)
            response.headers['Content-Type'] = 'application/json'
            return response, HTTPStatus.OK
        except BusinessException as err:
            return str(err), err.status_code
