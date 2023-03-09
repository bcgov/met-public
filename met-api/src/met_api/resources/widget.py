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
"""API endpoints for managing an user resource."""

from http import HTTPStatus

from flask import jsonify, request
from flask_cors import cross_origin
from flask_restx import Namespace, Resource
from marshmallow import ValidationError

from met_api.auth import jwt as _jwt
from met_api.exceptions.business_exception import BusinessException
from met_api.schemas import utils as schema_utils
from met_api.schemas.widget import WidgetSchema
from met_api.schemas.widget_item import WidgetItemSchema
from met_api.services.widget_service import WidgetService
from met_api.utils.token_info import TokenInfo
from met_api.utils.util import allowedorigins, cors_preflight


API = Namespace('widgets', description='Endpoints for Widget Management')
"""Custom exception messages
"""


@cors_preflight('GET, POST, OPTIONS')
@API.route('/engagement/<engagement_id>')
class Widget(Resource):
    """Resource for managing a survey submissions."""

    @staticmethod
    @cross_origin(origins=allowedorigins())
    def get(engagement_id):
        """Fetch a list of widgets by engagement_id."""
        try:
            widgets = WidgetService().get_widgets_by_engagement_id(engagement_id)
            return jsonify(widgets), HTTPStatus.OK
        except (KeyError, ValueError) as err:
            return str(err), HTTPStatus.INTERNAL_SERVER_ERROR

    @staticmethod
    @cross_origin(origins=allowedorigins())
    @_jwt.requires_auth
    def post(engagement_id):
        """Add new widget for an engagement."""
        try:
            user_id = TokenInfo.get_id()
            request_json = request.get_json()
            valid_format, errors = schema_utils.validate(request_json, 'widget')
            if not valid_format:
                return {'message': schema_utils.serialize(errors)}, HTTPStatus.BAD_REQUEST

            widget = WidgetSchema().load(request_json)
            created_widget = WidgetService().create_widget(widget, engagement_id, user_id)
            return created_widget, HTTPStatus.OK
        except (KeyError, ValueError) as err:
            return str(err), HTTPStatus.INTERNAL_SERVER_ERROR
        except ValidationError as err:
            return str(err.messages), HTTPStatus.INTERNAL_SERVER_ERROR


@cors_preflight('PATCH')
@API.route('/engagement/<engagement_id>/sort_index')
class EngagementWidgetSort(Resource):
    """Resource for managing widgets sort order with engagements."""

    @staticmethod
    @cross_origin(origins=allowedorigins())
    @_jwt.requires_auth
    def patch(engagement_id):
        """Sort widget for an engagement."""
        try:
            request_json = request.get_json()
            WidgetService().sort_widget(engagement_id, request_json, user_id=TokenInfo.get_id())
            return {}, HTTPStatus.NO_CONTENT
        except BusinessException as err:
            return {'message': err.error}, err.status_code


@cors_preflight('DELETE')
@API.route('/engagement/<engagement_id>/widget/<widget_id>')
class EngagementWidget(Resource):
    """Resource for managing widgets with engagements."""

    @staticmethod
    @cross_origin(origins=allowedorigins())
    @_jwt.requires_auth
    def delete(engagement_id, widget_id):
        """Remove widget for an engagement."""
        try:
            WidgetService().delete_widget(engagement_id, widget_id)
            return 'Widget successfully removed', HTTPStatus.OK
        except KeyError as err:
            return str(err), HTTPStatus.INTERNAL_SERVER_ERROR
        except ValueError as err:
            return str(err), HTTPStatus.INTERNAL_SERVER_ERROR


@cors_preflight('POST,OPTIONS')
@API.route('/<widget_id>/items')
class WidgetItems(Resource):
    """Resource for managing widget items."""

    @staticmethod
    # @TRACER.trace()
    @cross_origin(origins=allowedorigins())
    @_jwt.requires_auth
    def post(widget_id):
        """Add new widget items to a widget."""
        try:
            user_id = TokenInfo.get_id()
            request_json = request.get_json()
            valid_format, errors = schema_utils.validate(request_json, 'widget_item')
            if not valid_format:
                return {'message': schema_utils.serialize(errors)}, HTTPStatus.BAD_REQUEST

            widget_items = WidgetItemSchema(many=True).load(request_json)

            result = WidgetService().save_widget_items_bulk(widget_items, widget_id, user_id)
            return jsonify(result), HTTPStatus.OK
        except (KeyError, ValueError) as err:
            return str(err), HTTPStatus.INTERNAL_SERVER_ERROR
        except ValidationError as err:
            return str(err.messages), HTTPStatus.INTERNAL_SERVER_ERROR
