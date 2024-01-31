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

API = Namespace(
    'widget_polls', description='Endpoints for Poll Widget Management'
)


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
            valid_format, errors = schema_utils.validate(
                request_json, 'poll_widget'
            )
            if not valid_format:
                raise BusinessException(
                    error=schema_utils.serialize(errors),
                    status_code=HTTPStatus.BAD_REQUEST,
                )

            widget_poll = WidgetPollService().create_poll(
                widget_id, request_json
            )
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
        try:
            request_json = request.get_json()
            valid_format, errors = schema_utils.validate(
                request_json, 'poll_widget_update'
            )
            if not valid_format:
                raise BusinessException(
                    error=schema_utils.serialize(errors),
                    status_code=HTTPStatus.BAD_REQUEST,
                )
            # Check if the poll engagement is published
            if WidgetPollService.is_poll_engagement_published(poll_widget_id):
                # Define the keys to check in the request_json
                keys_to_check = ['title', 'description', 'answers']
                if any(key in request_json for key in keys_to_check):
                    raise BusinessException(
                        error='Cannot update poll widget as the engagement is published',
                        status_code=HTTPStatus.BAD_REQUEST,
                    )

            widget_poll = WidgetPollService().update_poll(
                widget_id, poll_widget_id, request_json
            )
            return WidgetPollSchema().dump(widget_poll), HTTPStatus.OK
        except BusinessException as err:
            return str(err), err.status_code


@cors_preflight('POST')
@API.route('/<int:poll_widget_id>/responses')
class PollResponseRecord(Resource):
    """Resource for recording responses for a poll widget. Does not require authentication."""

    @staticmethod
    @cross_origin(origins=allowedorigins())
    def post(widget_id, poll_widget_id):
        # pylint: disable=too-many-return-statements
        """Record a response for a given poll widget."""
        try:
            poll_response_data = request.get_json()
            valid_format, errors = schema_utils.validate(
                poll_response_data, 'poll_response'
            )
            if not valid_format:
                raise BusinessException(
                    error=schema_utils.serialize(errors),
                    status_code=HTTPStatus.BAD_REQUEST,
                )

            # Prepare poll request object
            poll_response_dict = {
                **poll_response_data,
                'poll_id': poll_widget_id,
                'widget_id': widget_id,
                'participant_id': hash_ip(request.remote_addr),
            }

            # Check if poll active or not
            if not WidgetPollService.is_poll_active(poll_widget_id):
                raise BusinessException(
                    error='Poll is not active',
                    status_code=HTTPStatus.BAD_REQUEST,
                )

            # Check if engagement of this poll is published or not
            if not WidgetPollService.is_poll_engagement_published(
                poll_widget_id
            ):
                raise BusinessException(
                    error='Poll engagement is not published',
                    status_code=HTTPStatus.BAD_REQUEST,
                )

            # Check poll limit execeeded or not
            if WidgetPollService.check_already_polled(
                poll_widget_id, poll_response_dict['participant_id'], 10
            ):
                raise BusinessException(
                    error='Limit exceeded for this poll',
                    status_code=HTTPStatus.BAD_REQUEST,
                )

            # Record poll response in database
            poll_response = WidgetPollService.record_response(
                poll_response_dict
            )
            if poll_response.id:
                return {
                    'message': 'Response recorded successfully'
                }, HTTPStatus.CREATED

            raise BusinessException(
                error='Response failed to record',
                status_code=HTTPStatus.INTERNAL_SERVER_ERROR,
            )

        except BusinessException as err:
            return err.error, err.status_code
