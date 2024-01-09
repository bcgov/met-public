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
"""API endpoints for managing a timeline widget resource."""
from http import HTTPStatus

from flask import jsonify, request
from flask_cors import cross_origin
from flask_restx import Namespace, Resource

from met_api.auth import jwt as _jwt
from met_api.exceptions.business_exception import BusinessException
from met_api.schemas import utils as schema_utils
from met_api.schemas.widget_timeline import WidgetTimelineSchema
from met_api.services.widget_timeline_service import WidgetTimelineService
from met_api.utils.util import allowedorigins, cors_preflight


API = Namespace('widget_timelines', description='Endpoints for Timeline Widget Management')
"""Widget Timelines"""


@cors_preflight('GET, POST')
@API.route('')
class Timelines(Resource):
    """Resource for managing timeline widgets."""

    @staticmethod
    @cross_origin(origins=allowedorigins())
    def get(widget_id):
        """Get timeline widget."""
        try:
            widget_timeline = WidgetTimelineService().get_timeline(widget_id)
            return jsonify(WidgetTimelineSchema().dump(widget_timeline, many=True)), HTTPStatus.OK
        except BusinessException as err:
            return str(err), err.status_code

    @staticmethod
    @cross_origin(origins=allowedorigins())
    @_jwt.requires_auth
    def post(widget_id):
        """Create timeline widget."""
        try:
            request_json = request.get_json()
            widget_timeline = WidgetTimelineService().create_timeline(widget_id, request_json)
            return WidgetTimelineSchema().dump(widget_timeline), HTTPStatus.OK
        except BusinessException as err:
            return str(err), err.status_code


@cors_preflight('PATCH')
@API.route('/<int:timeline_widget_id>')
class Timeline(Resource):
    """Resource for managing timeline widgets."""

    @staticmethod
    @cross_origin(origins=allowedorigins())
    @_jwt.requires_auth
    def patch(widget_id, timeline_widget_id):
        """Update timeline widget."""
        request_json = request.get_json()
        valid_format, errors = schema_utils.validate(request_json, 'timeline_widget_update')
        if not valid_format:
            return {'message': schema_utils.serialize(errors)}, HTTPStatus.BAD_REQUEST
        try:
            widget_timeline = WidgetTimelineService().update_timeline(widget_id, timeline_widget_id, request_json)
            return WidgetTimelineSchema().dump(widget_timeline), HTTPStatus.OK
        except BusinessException as err:
            return str(err), err.status_code
