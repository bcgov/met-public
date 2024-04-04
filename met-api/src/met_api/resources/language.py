# Copyright © 2021 Province of British Columbia
#
# Licensed under the Apache License, Version 2.0 (the 'License');
"""API endpoints for managing a Language resource."""

from http import HTTPStatus

from flask import jsonify, request
from flask_cors import cross_origin
from flask_restx import Namespace, Resource
from marshmallow import ValidationError

from met_api.auth import jwt as _jwt
from met_api.schemas import utils as schema_utils
from met_api.schemas.language import LanguageSchema
from met_api.services.language_service import LanguageService
from met_api.utils.util import allowedorigins, cors_preflight
from met_api.exceptions.business_exception import BusinessException

API = Namespace('languages', description='Endpoints for Language Management')


@cors_preflight('GET, OPTIONS')
@API.route('/<int:language_id>')
class LanguageResource(Resource):
    """Resource for managing languages."""

    @staticmethod
    @cross_origin(origins=allowedorigins())
    def get(language_id):
        """Fetch a language by id."""
        try:
            language = LanguageService.get_language_by_id(language_id)
            return LanguageSchema().dump(language), HTTPStatus.OK
        except (KeyError, ValueError) as err:
            return str(err), HTTPStatus.INTERNAL_SERVER_ERROR

    @staticmethod
    @_jwt.requires_auth
    @cross_origin(origins=allowedorigins())
    def patch(language_id):
        """Update saved language partially."""
        try:
            request_json = request.get_json()
            valid_format, errors = schema_utils.validate(
                request_json, 'language_update'
            )
            if not valid_format:
                raise BusinessException(
                    error=schema_utils.serialize(errors),
                    status_code=HTTPStatus.BAD_REQUEST,
                )
            language = LanguageService.update_language(
                language_id, request_json
            )
            return LanguageSchema().dump(language), HTTPStatus.OK
        except ValueError as err:
            return str(err), HTTPStatus.NOT_FOUND
        except ValidationError as err:
            return str(err.messages), HTTPStatus.BAD_REQUEST

    @staticmethod
    @_jwt.requires_auth
    @cross_origin(origins=allowedorigins())
    def delete(language_id):
        """Delete a language."""
        try:
            success = LanguageService.delete_language(language_id)
            if success:
                return 'Successfully deleted language', HTTPStatus.NO_CONTENT
            raise ValueError('Language not found')
        except KeyError as err:
            return str(err), HTTPStatus.BAD_REQUEST
        except ValueError as err:
            return str(err), HTTPStatus.NOT_FOUND


@cors_preflight('GET, POST, OPTIONS, PATCH, DELETE')
@API.route('/')
class Languages(Resource):
    """Resource for managing multiple languages."""

    @staticmethod
    @cross_origin(origins=allowedorigins())
    def get():
        """Fetch list of languages."""
        try:
            languages = LanguageService.get_languages()
            return (
                jsonify(LanguageSchema(many=True).dump(languages)),
                HTTPStatus.OK,
            )
        except (KeyError, ValueError) as err:
            return str(err), HTTPStatus.INTERNAL_SERVER_ERROR

    @staticmethod
    @_jwt.requires_auth
    @cross_origin(origins=allowedorigins())
    def post():
        """Create a new language."""
        try:
            request_json = request.get_json()
            valid_format, errors = schema_utils.validate(
                request_json, 'language'
            )
            if not valid_format:
                return {
                    'message': schema_utils.serialize(errors)
                }, HTTPStatus.BAD_REQUEST
            result = LanguageService.create_language(request_json)
            return LanguageSchema().dump(result), HTTPStatus.CREATED
        except (KeyError, ValueError) as err:
            return str(err), HTTPStatus.INTERNAL_SERVER_ERROR
        except ValidationError as err:
            return str(err.messages), HTTPStatus.INTERNAL_SERVER_ERROR
        except BusinessException as err:
            return err.error, err.status_code
