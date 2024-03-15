# Copyright © 2024 Province of British Columbia
#
# Licensed under the Apache License, Version 2.0 (the 'License');
"""API endpoints for managing a PollAnswerTranslation resource."""

from http import HTTPStatus

from flask import request
from flask_cors import cross_origin
from flask_restx import Namespace, Resource
from marshmallow import ValidationError

from met_api.auth import jwt as _jwt
from met_api.exceptions.business_exception import BusinessException
from met_api.schemas import utils as schema_utils
from met_api.schemas.poll_answer_translation_schema import PollAnswerTranslationSchema
from met_api.services.poll_answer_translation_service import PollAnswerTranslationService
from met_api.utils.util import allowedorigins, cors_preflight


API = Namespace(
    'poll_answer_translations',
    description='Endpoints for PollAnswerTranslation Management',
)


@cors_preflight('GET, POST, PATCH, DELETE, OPTIONS')
@API.route('/<int:poll_answer_translation_id>')
class PollAnswerTranslationResource(Resource):
    """Resource for managing poll answer translations."""

    @staticmethod
    @cross_origin(origins=allowedorigins())
    def get(poll_answer_translation_id, **_):
        """Fetch a poll answer translation by id."""
        try:
            poll_answer_translation = PollAnswerTranslationService.get_by_id(
                poll_answer_translation_id
            )
            return (
                PollAnswerTranslationSchema().dump(poll_answer_translation),
                HTTPStatus.OK,
            )
        except (KeyError, ValueError) as err:
            return str(err), HTTPStatus.INTERNAL_SERVER_ERROR

    @staticmethod
    @_jwt.requires_auth
    @cross_origin(origins=allowedorigins())
    def patch(poll_id, poll_answer_translation_id):
        """Update saved poll answer translation partially."""
        try:
            request_json = request.get_json()
            poll_answer_translation = (
                PollAnswerTranslationService.update_poll_answer_translation(
                    poll_id, poll_answer_translation_id, request_json
                )
            )
            return (
                PollAnswerTranslationSchema().dump(poll_answer_translation),
                HTTPStatus.OK,
            )
        except ValueError as err:
            return str(err), HTTPStatus.NOT_FOUND
        except ValidationError as err:
            return str(err.messages), HTTPStatus.BAD_REQUEST

    @staticmethod
    @_jwt.requires_auth
    @cross_origin(origins=allowedorigins())
    def delete(poll_id, poll_answer_translation_id):
        """Delete a poll answer translation."""
        try:
            success = (
                PollAnswerTranslationService.delete_poll_answer_translation(
                    poll_id, poll_answer_translation_id
                )
            )
            if success:
                return (
                    'Successfully deleted poll answer translation',
                    HTTPStatus.NO_CONTENT,
                )
            raise ValueError('Poll answer translation not found')
        except KeyError as err:
            return str(err), HTTPStatus.BAD_REQUEST
        except ValueError as err:
            return str(err), HTTPStatus.NOT_FOUND


@cors_preflight('GET, OPTIONS')
@API.route('/answer/<int:poll_answer_id>/language/<int:language_id>')
class PollAnswerTranslationResourceByLanguage(Resource):
    """Resource for managing poll answer using language_id."""

    @staticmethod
    @cross_origin(origins=allowedorigins())
    def get(poll_answer_id, language_id, **_):
        """Fetch a poll answer translation by language_id."""
        try:
            poll_answer_translations = (
                PollAnswerTranslationService.get_poll_answer_translation(
                    poll_answer_id, language_id
                )
            )
            return (
                PollAnswerTranslationSchema().dump(
                    poll_answer_translations, many=True
                ),
                HTTPStatus.OK,
            )
        except (KeyError, ValueError) as err:
            return str(err), HTTPStatus.INTERNAL_SERVER_ERROR


@cors_preflight('POST, OPTIONS')
@API.route('/')
class PollAnswerTranslations(Resource):
    """Resource for managing multiple poll answer translations."""

    @staticmethod
    @_jwt.requires_auth
    @cross_origin(origins=allowedorigins())
    def post(poll_id):
        """Create a new poll answer translation."""
        try:
            request_json = request.get_json()
            valid_format, errors = schema_utils.validate(
                request_json, 'poll_answer_translation'
            )
            if not valid_format:
                return {
                    'message': schema_utils.serialize(errors)
                }, HTTPStatus.BAD_REQUEST

            pre_populate = request_json.get('pre_populate', True)

            poll_answer_translation = (
                PollAnswerTranslationService.create_poll_answer_translation(
                    poll_id, request_json, pre_populate
                )
            )
            return (
                PollAnswerTranslationSchema().dump(poll_answer_translation),
                HTTPStatus.CREATED,
            )
        except (KeyError, ValueError) as err:
            return str(err), HTTPStatus.INTERNAL_SERVER_ERROR
        except ValidationError as err:
            return str(err.messages), HTTPStatus.BAD_REQUEST
        except BusinessException as err:
            return err.error, err.status_code
