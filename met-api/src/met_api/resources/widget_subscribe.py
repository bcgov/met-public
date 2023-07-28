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

from met_api.exceptions.business_exception import BusinessException
from met_api.schemas.subscribe_item import SubscribeItemSchema
from met_api.schemas.widget_subscribe import WidgetSubscribeSchema
from met_api.services.widget_subscribe_service import WidgetSubscribeService
from met_api.utils.token_info import TokenInfo
from met_api.utils.util import allowedorigins, cors_preflight


API = Namespace('widgets_subscribe',
                description='Endpoints for Widget Subscribe')
"""Widget Subscribe
"""


@cors_preflight('GET, POST, OPTIONS, DELETE')
@API.route('')
class WidgetSubscribe(Resource):
    """Resource for managing a Widget Subscribe."""

    @staticmethod
    @cross_origin(origins=allowedorigins())
    def get(widget_id):
        """Fetch a list of widgets by engagement_id."""
        try:
            subscribe = WidgetSubscribeService().get_subscribe_by_widget_id(widget_id)
            return jsonify(WidgetSubscribeSchema().dump(subscribe, many=True)), HTTPStatus.OK
        except (KeyError, ValueError) as err:
            return str(err), HTTPStatus.INTERNAL_SERVER_ERROR

    @staticmethod
    @cross_origin(origins=allowedorigins())
    def post(widget_id):
        """Add new subscribe to the widgets."""
        request_json = request.get_json()
        try:
            subscribe = WidgetSubscribeService().create_subscribe(widget_id, request_json)
            return WidgetSubscribeSchema().dump(subscribe, many=False), HTTPStatus.OK
        except BusinessException as err:
            return str(err), err.status_code

    @staticmethod
    @cross_origin(origins=allowedorigins())
    def delete(widget_id, subscribe_id):
        """Delete  an subscribe ."""
        try:
            WidgetSubscribeService().delete_subscribe(subscribe_id, widget_id)
            response, status = {}, HTTPStatus.OK
        except BusinessException as err:
            response, status = str(err), err.status_code
        return response, status


@cors_preflight('GET,POST,OPTIONS')
@API.route('/<int:subscribe_id>/items', methods=['GET', 'DELETE', 'OPTIONS'])
class WidgetSubscribeItems(Resource):
    """Resource for managing a Widget Subscribe."""

    @staticmethod
    @cross_origin(origins=allowedorigins())
    def post(widget_id, subscribe_id):
        """Add new subscribe to the widgets."""
        request_json = request.get_json()
        print(request_json)
        try:
            subscribe = WidgetSubscribeService().create_subscribe_items(
                widget_id, subscribe_id, request_json)
            return WidgetSubscribeSchema().dump(subscribe), HTTPStatus.OK
        except BusinessException as err:
            return str(err), err.status_code


@cors_preflight('PATCH')
@API.route('/<int:subscribe_id>/item/<int:item_id>', methods=['PATCH'])
class SubscribeItems(Resource):
    """Resource for managing a Widget Subscribe Item."""

    @staticmethod
    @cross_origin(origins=allowedorigins())
    def patch(widget_id, subscribe_id, item_id):
        """Update subscribe item."""
        request_json = request.get_json()
        try:
            subscribe = WidgetSubscribeService().update_subscribe_item(
                widget_id, subscribe_id, item_id, request_json)
            return SubscribeItemSchema().dump(subscribe), HTTPStatus.OK
        except BusinessException as err:
            return str(err), err.status_code


@cors_preflight('PATCH')
@API.route('/sort_index')
class WidgetSubscribeSort(Resource):
    """Resource for managing subscribe sort order within subscribe widget."""

    @staticmethod
    @cross_origin(origins=allowedorigins())
    def patch(widget_id):
        """Sort subscribe for an subscribe widget."""
        try:
            request_json = request.get_json()
            sort_widget_subscribe = WidgetSubscribeService().save_widget_subscribes_bulk(widget_id, request_json,
                                                                                         user_id=TokenInfo.get_id())
            return WidgetSubscribeSchema().dump(sort_widget_subscribe), HTTPStatus.OK
        except BusinessException as err:
            return str(err), err.status_code
