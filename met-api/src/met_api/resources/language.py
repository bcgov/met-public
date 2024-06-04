# Copyright © 2021 Province of British Columbia
#
# Licensed under the Apache License, Version 2.0 (the 'License');
"""API endpoints for managing a Language resource."""

from http import HTTPStatus

from flask import jsonify, request
from flask_cors import cross_origin
from flask_restx import Namespace, Resource
from marshmallow import ValidationError
from sqlalchemy.exc import IntegrityError

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
        
@cors_preflight('GET, OPTIONS')
@API.route('/tenant/<int:tenant_id>')
class Languages(Resource):
    """Resource for getting existing language-tenant mappings."""

    @staticmethod
    @cross_origin(origins=allowedorigins())
    def get(tenant_id):
        """Fetch list of languages associated with a given tenant ID."""
        try:
            languages = LanguageService.get_languages_by_tenant(tenant_id)
            return (
                jsonify(LanguageSchema(many=True).dump(languages)),
                HTTPStatus.OK,
            )
        except (KeyError, ValueError) as err:
            return str(err), HTTPStatus.INTERNAL_SERVER_ERROR


@cors_preflight('POST, OPTIONS')
@API.route('/<int:language_id>/tenant/<int:tenant_id>')
class Languages(Resource):
    """Resource for adding or removing language-tenant relationships."""

    @staticmethod
    def post(language_id, tenant_id):
        """Create language-tenant mapping."""
        try:
            return LanguageService.map_language_to_tenant(language_id, tenant_id)
        except IntegrityError as e:
            # Catching language code already exists error
            detail = (
                str(e.orig).split('DETAIL: ')[1]
                if 'DETAIL: ' in str(e.orig)
                else 'Duplicate entry.'
            )
            raise BusinessException(
                str(detail), HTTPStatus.INTERNAL_SERVER_ERROR
            ) from e

@cors_preflight('DELETE, OPTIONS')
@API.route('/mappings/<int:language_mapping_id>')
class Languages(Resource):
    """Resourse for removing language-tenant relationships."""

    @staticmethod
    # @_jwt.requires_auth
    # @cross_origin(origins=allowedorigins())
    def delete(language_mapping_id):
        """Remove a language mapping from a tenant."""
        try:
            success = LanguageService.remove_language_mapping_from_tenant(language_mapping_id)
            if success:
                return 'Successfully deleted language-tenant mapping', HTTPStatus.NO_CONTENT
            raise ValueError('Language-tenant mapping not found')
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
