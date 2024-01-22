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
from met_api.utils.ip_util import hash_ip

API = Namespace('widget_polls', description='Endpoints for Poll Widget Management')


@cors_preflight('GET, POST')
@API.route('')
class Polls(Resource):
    """Resource for managing poll widgets."""

    @staticmethod
    @cross_origin(origins=allowedorigins())
    def get(widget_id):
        """Get poll widgets."""
        try:
            widget_poll = WidgetPollService().get_polls_by_widget_id(widget_id)
            return WidgetPollSchema().dump(widget_poll, many=True), HTTPStatus.OK
        except BusinessException as err:
            return str(err), err.status_code

    @staticmethod
    @cross_origin(origins=allowedorigins())
    @_jwt.requires_auth
    def post(widget_id):
        """Create poll widget."""
        try:
            request_json = request.get_json()
            valid_format, errors = Polls.validate_response_format(request_json)
            if not valid_format:
                return {'message': 'Invalid response format', 'errors': errors}, HTTPStatus.BAD_REQUEST
            widget_poll = WidgetPollService().create_poll(widget_id, request_json)
            return WidgetPollSchema().dump(widget_poll), HTTPStatus.OK
        except BusinessException as err:
            return str(err), err.status_code

    @staticmethod
    def validate_response_format(data):
        valid_format, errors = schema_utils.validate(data, 'poll_widget')
        if not valid_format:
            errors = schema_utils.serialize(errors)
        return valid_format, errors


@cors_preflight('PATCH')
@API.route('/<int:poll_widget_id>')
class Poll(Resource):
    """Resource for managing poll widgets."""

    @staticmethod
    @cross_origin(origins=allowedorigins())
    @_jwt.requires_auth
    def patch(widget_id, poll_widget_id):
        """Update poll widget."""

        try:
            request_json = request.get_json()
            valid_format, errors = Poll.validate_response_format(request_json)
            if not valid_format:
                return {'message': 'Invalid response format', 'errors': errors}, HTTPStatus.BAD_REQUEST

            widget_poll = WidgetPollService().update_poll(widget_id, poll_widget_id, request_json)
            return WidgetPollSchema().dump(widget_poll), HTTPStatus.OK
        except BusinessException as err:
            return str(err), err.status_code

    @staticmethod
    def validate_response_format(data):
        valid_format, errors = schema_utils.validate(data, 'poll_widget_update')
        if not valid_format:
            errors = schema_utils.serialize(errors)
        return valid_format, errors

@cors_preflight('POST')
@API.route('/<int:poll_widget_id>/responses')
class PollResponseRecord(Resource):
    """Resource for recording responses for a poll widget. Not require authentication."""

    @staticmethod
    @cross_origin(origins=allowedorigins())
    def post(widget_id, poll_widget_id):
        """Record a response for a given poll widget."""
        try:
            response_data = request.get_json()
            valid_format, errors = PollResponseRecord.validate_response_format(response_data)
            if not valid_format:
                return {'message': 'Invalid response format', 'errors': errors}, HTTPStatus.BAD_REQUEST

            response_dict = PollResponseRecord.prepare_response_data(response_data, widget_id, poll_widget_id)

            if not PollResponseRecord.is_poll_active(poll_widget_id):
                return {'message': 'Poll is not active'}, HTTPStatus.BAD_REQUEST

            if PollResponseRecord.is_poll_limit_exceeded(poll_widget_id, response_dict['participant_id']):
                return {'message': 'Limit exceeded for this poll'}, HTTPStatus.FORBIDDEN

            return PollResponseRecord.record_poll_response(response_dict)

        except BusinessException as err:
            return err.error, err.status_code

    @staticmethod
    def validate_response_format(data):
        valid_format, errors = schema_utils.validate(data, 'poll_response')
        if not valid_format:
            errors = schema_utils.serialize(errors)
        return valid_format, errors

    @staticmethod
    def prepare_response_data(data, widget_id, poll_widget_id):
        response_dict = dict(data)
        response_dict['poll_id'] = poll_widget_id
        response_dict['widget_id'] = widget_id
        response_dict['participant_id'] = hash_ip(request.remote_addr)
        return response_dict

    @staticmethod
    def is_poll_active(poll_id):
        return WidgetPollService.is_poll_active(poll_id)

    @staticmethod
    def is_poll_limit_exceeded(poll_id, participant_id):
        return WidgetPollService.check_already_polled(poll_id, participant_id, 10)

    @staticmethod
    def record_poll_response(response_dict):
        poll_response = WidgetPollService.record_response(response_dict)
        if poll_response.id:
            return {'message': 'Response recorded successfully'}, HTTPStatus.CREATED
        else:
            return {'message': 'Response failed to record'}, HTTPStatus.INTERNAL_SERVER_ERROR
