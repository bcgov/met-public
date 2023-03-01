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
from met_api.schemas.widget_events import WidgetEventsSchema
from met_api.schemas.event_item import EventItemSchema
from met_api.services.widget_events_service import WidgetEventsService
from met_api.utils.token_info import TokenInfo
from met_api.utils.util import allowedorigins, cors_preflight

API = Namespace('widgets_events', description='Endpoints for Widget Events')
"""Widget Events
"""


@cors_preflight('GET, POST, OPTIONS')
@API.route('')
class WidgetEvents(Resource):
    """Resource for managing a Widget Events."""

    @staticmethod
    @cross_origin(origins=allowedorigins())
    def get(widget_id):
        """Fetch a list of widgets by engagement_id."""
        try:
            events = WidgetEventsService().get_event_by_widget_id(widget_id)
            return jsonify(WidgetEventsSchema().dump(events, many=True)), HTTPStatus.OK
        except (KeyError, ValueError) as err:
            return str(err), HTTPStatus.INTERNAL_SERVER_ERROR

    @staticmethod
    @cross_origin(origins=allowedorigins())
    def post(widget_id):
        """Add new events to the widgets."""
        request_json = request.get_json()
        try:
            event = WidgetEventsService().create_event(widget_id, request_json)
            return WidgetEventsSchema().dump(event), HTTPStatus.OK
        except BusinessException as err:
            return str(err), err.status_code


@cors_preflight('GET,POST,OPTIONS')
@API.route('/<int:event_id>/items', methods=['GET', 'DELETE', 'OPTIONS'])
class WidgetEventItems(Resource):
    """Resource for managing a Widget Events."""

    @staticmethod
    @cross_origin(origins=allowedorigins())
    def post(widget_id, event_id):
        """Add new events to the widgets."""
        request_json = request.get_json()
        try:
            event = WidgetEventsService().create_event_items(widget_id, event_id, request_json)
            return WidgetEventsSchema().dump(event), HTTPStatus.OK
        except BusinessException as err:
            return str(err), err.status_code


@cors_preflight('DELETE')
@API.route('/<int:event_id>', methods=['DELETE'])
class WidgetEvent(Resource):
    """Resource for managing a Widget Events."""

    @staticmethod
    @cross_origin(origins=allowedorigins())
    def delete(widget_id, event_id):
        """Delete  an event ."""
        try:
            WidgetEventsService().delete_event(event_id, widget_id)
            response, status = {}, HTTPStatus.OK
        except BusinessException as err:
            response, status = str(err), err.status_code
        return response, status


@cors_preflight('PATCH')
@API.route('/<int:event_id>/item/<int:item_id>', methods=['PATCH'])
class EventItems(Resource):
    """Resource for managing a Widget Events Item."""

    @staticmethod
    @cross_origin(origins=allowedorigins())
    def patch(widget_id, event_id, item_id):
        """Update event item."""
        request_json = request.get_json()
        try:
            event = WidgetEventsService().update_event_item(widget_id, event_id, item_id, request_json)
            return EventItemSchema().dump(event), HTTPStatus.OK
        except BusinessException as err:
            return str(err), err.status_code


@cors_preflight('PATCH')
@API.route('/sort_index')
class WidgetEventsSort(Resource):
    """Resource for managing events sort order within event widget."""

    @staticmethod
    @cross_origin(origins=allowedorigins())
    def patch(widget_id):
        """Sort events for an event widget."""
        try:
            request_json = request.get_json()
            sort_widget_events = WidgetEventsService().save_widget_events_bulk(widget_id, request_json,
                                                                               user_id=TokenInfo.get_id())
            return WidgetEventsSchema().dump(sort_widget_events), HTTPStatus.OK
        except BusinessException as err:
            return str(err), err.status_code
