"""API endpoints for managing a poll widget resource."""
from http import HTTPStatus

from flask import jsonify, request
from flask_cors import cross_origin
from flask_restx import Namespace, Resource

from met_api.auth import jwt as _jwt
from met_api.exceptions.business_exception import BusinessException
from met_api.schemas import utils as schema_utils
from met_api.schemas.widget_poll import WidgetPollSchema
from met_api.services.widget_poll_service import WidgetPollService
from met_api.utils.util import allowedorigins, cors_preflight


API = Namespace('widget_polls', description='Endpoints for Poll Widget Management')


@cors_preflight('GET, POST')
@API.route('')
class Polls(Resource):
    """Resource for managing poll widgets."""

    @staticmethod
    @cross_origin(origins=allowedorigins())
    def get(widget_id):
        """Get poll widget."""
        try:
            widget_poll = WidgetPollService().get_poll(widget_id)
            return jsonify(WidgetPollSchema().dump(widget_poll, many=True)), HTTPStatus.OK
        except BusinessException as err:
            return str(err), err.status_code

    @staticmethod
    @cross_origin(origins=allowedorigins())
    @_jwt.requires_auth
    def post(widget_id):
        """Create poll widget."""
        try:
            request_json = request.get_json()
            widget_poll = WidgetPollService().create_poll(widget_id, request_json)
            return WidgetPollSchema().dump(widget_poll), HTTPStatus.OK
        except BusinessException as err:
            return str(err), err.status_code


@cors_preflight('PATCH')
@API.route('/<int:poll_widget_id>')
class Poll(Resource):
    """Resource for managing poll widgets."""

    @staticmethod
    @cross_origin(origins=allowedorigins())
    @_jwt.requires_auth
    def patch(widget_id, poll_widget_id):
        """Update poll widget."""
        request_json = request.get_json()
        valid_format, errors = schema_utils.validate(request_json, 'poll_widget_update')
        if not valid_format:
            return {'message': schema_utils.serialize(errors)}, HTTPStatus.BAD_REQUEST
        try:
            widget_poll = WidgetPollService().update_poll(widget_id, poll_widget_id, request_json)
            return WidgetPollSchema().dump(widget_poll), HTTPStatus.OK
        except BusinessException as err:
            return str(err), err.status_code

