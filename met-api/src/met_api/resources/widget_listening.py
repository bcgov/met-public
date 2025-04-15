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
"""API endpoints for managing a listening widget resource."""
from http import HTTPStatus

from flask import jsonify, request
from flask_cors import cross_origin
from flask_restx import Namespace, Resource

from met_api.auth import jwt as _jwt
from met_api.exceptions.business_exception import BusinessException
from met_api.schemas import utils as schema_utils
from met_api.schemas.widget_listening import WidgetListeningSchema
from met_api.services.widget_listening_service import WidgetListeningService
from met_api.utils.util import allowedorigins, cors_preflight


API = Namespace('widget_listenings', description='Endpoints for Who Is Listening Widget Management')
"""Widget Listenings"""


@cors_preflight('GET, POST')
@API.route('')
class Listenings(Resource):
    """Resource for managing Who is Listening widgets."""

    @staticmethod
    @cross_origin(origins=allowedorigins())
    def get(widget_id):
        """Get Who is Listening widget."""
        try:
            widget_listening = WidgetListeningService().get_listening(widget_id)
            return jsonify(WidgetListeningSchema().dump(widget_listening, many=True)), HTTPStatus.OK
        except BusinessException as err:
            return str(err), err.status_code

    @staticmethod
    @cross_origin(origins=allowedorigins())
    @_jwt.requires_auth
    def post(widget_id):
        """Create Who is Listening widget."""
        try:
            request_json = request.get_json()
            widget_listening = WidgetListeningService().create_listening(widget_id, request_json)
            return WidgetListeningSchema().dump(widget_listening), HTTPStatus.OK
        except BusinessException as err:
            return str(err), err.status_code


@cors_preflight('PATCH')
@API.route('/<int:listening_widget_id>')
class Listening(Resource):
    """Resource for managing Who is Listening widgets."""

    @staticmethod
    @cross_origin(origins=allowedorigins())
    @_jwt.requires_auth
    def patch(widget_id, listening_widget_id):
        """Update Who is Listening widget."""
        request_json = request.get_json()
        valid_format, errors = schema_utils.validate(request_json, 'listening_widget_update')
        if not valid_format:
            return {'message': schema_utils.serialize(errors)}, HTTPStatus.BAD_REQUEST
        try:
            widget_listening = WidgetListeningService().update_listening(widget_id, listening_widget_id, request_json)
            return WidgetListeningSchema().dump(widget_listening), HTTPStatus.OK
        except BusinessException as err:
            return str(err), err.status_code
