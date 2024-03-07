# Copyright © 2024 Province of British Columbia
#
# Licensed under the Apache License, Version 2.0 (the 'License');
"""API endpoints for managing a SurveyTranslation resource."""

from http import HTTPStatus

from flask import request
from flask_cors import cross_origin
from flask_restx import Namespace, Resource
from marshmallow import ValidationError

from met_api.auth import jwt as _jwt
from met_api.exceptions.business_exception import BusinessException
from met_api.schemas import utils as schema_utils
from met_api.schemas.survey_translation_schema import SurveyTranslationSchema
from met_api.services.survey_translation_service import SurveyTranslationService
from met_api.utils.util import allowedorigins, cors_preflight


API = Namespace(
    'survey_translations',
    description='Endpoints for SurveyTranslation Management',
)


@cors_preflight('GET, POST, PATCH, DELETE, OPTIONS')
@API.route('/<int:survey_translation_id>')
class SurveyTranslationResource(Resource):
    """Resource for managing survey translations."""

    @staticmethod
    @cross_origin(origins=allowedorigins())
    # pylint: disable=unused-argument
    def get(survey_id, survey_translation_id):
        """Fetch a survey translation by id."""
        try:
            survey_translation = (
                SurveyTranslationService.get_survey_translation_by_id(
                    survey_translation_id
                )
            )
            return (
                SurveyTranslationSchema().dump(survey_translation),
                HTTPStatus.OK,
            )
        except (KeyError, ValueError) as err:
            return str(err), HTTPStatus.INTERNAL_SERVER_ERROR

    @staticmethod
    @_jwt.requires_auth
    @cross_origin(origins=allowedorigins())
    def patch(survey_id, survey_translation_id):
        """Update saved survey translation partially."""
        try:
            request_json = request.get_json()
            survey_translation = (
                SurveyTranslationService.update_survey_translation(
                    survey_id, survey_translation_id, request_json
                )
            )
            return (
                SurveyTranslationSchema().dump(survey_translation),
                HTTPStatus.OK,
            )
        except ValueError as err:
            return str(err), HTTPStatus.NOT_FOUND
        except ValidationError as err:
            return str(err.messages), HTTPStatus.BAD_REQUEST

    @staticmethod
    @_jwt.requires_auth
    @cross_origin(origins=allowedorigins())
    def delete(survey_id, survey_translation_id):
        """Delete a survey translation."""
        try:
            success = SurveyTranslationService.delete_survey_translation(
                survey_id, survey_translation_id
            )
            if success:
                return (
                    'Successfully deleted survey translation',
                    HTTPStatus.NO_CONTENT,
                )
            raise ValueError('Survey translation not found')
        except KeyError as err:
            return str(err), HTTPStatus.BAD_REQUEST
        except ValueError as err:
            return str(err), HTTPStatus.NOT_FOUND


@cors_preflight('GET, POST, PATCH, DELETE, OPTIONS')
@API.route('/language/<int:language_id>')
class SurveyTranslationResourceByLanguage(Resource):
    """Resource for managing survey using language_id."""

    @staticmethod
    @cross_origin(origins=allowedorigins())
    def get(survey_id, language_id):
        """Fetch a survey translation by language_id."""
        try:
            survey_translation = SurveyTranslationService.get_translation_by_survey_and_language(
                survey_id, language_id
            )
            return (
                SurveyTranslationSchema().dump(survey_translation, many=True),
                HTTPStatus.OK,
            )
        except (KeyError, ValueError) as err:
            return str(err), HTTPStatus.INTERNAL_SERVER_ERROR


@cors_preflight('POST, OPTIONS')
@API.route('/')
class SurveyTranslations(Resource):
    """Resource for managing multiple survey translations."""

    @staticmethod
    @_jwt.requires_auth
    @cross_origin(origins=allowedorigins())
    def post(survey_id):
        """Create a new survey translation."""
        try:
            request_json = request.get_json()
            request_json['survey_id'] = survey_id
            valid_format, errors = schema_utils.validate(
                request_json, 'survey_translation'
            )
            if not valid_format:
                return {
                    'message': schema_utils.serialize(errors)
                }, HTTPStatus.BAD_REQUEST
            pre_populate = request_json.get('pre_populate', True)

            survey_translation = (
                SurveyTranslationService.create_survey_translation(
                    request_json, pre_populate
                )
            )
            return (
                SurveyTranslationSchema().dump(survey_translation),
                HTTPStatus.CREATED,
            )
        except (KeyError, ValueError) as err:
            return str(err), HTTPStatus.INTERNAL_SERVER_ERROR
        except ValidationError as err:
            return str(err.messages), HTTPStatus.BAD_REQUEST
        except BusinessException as err:
            return err.error, err.status_code
