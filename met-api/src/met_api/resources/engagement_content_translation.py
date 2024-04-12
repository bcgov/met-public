"""API endpoints for managing an engagement content translation resource."""

from http import HTTPStatus

from flask import jsonify, request
from flask_cors import cross_origin
from flask_restx import Namespace, Resource
from marshmallow import ValidationError

from met_api.auth import jwt as _jwt
from met_api.schemas import utils as schema_utils
from met_api.schemas.engagement_content_translation import EngagementContentTranslationSchema
from met_api.services.engagement_content_translation_service import EngagementContentTranslationService
from met_api.exceptions.business_exception import BusinessException
from met_api.utils.util import allowedorigins, cors_preflight

API = Namespace('engagement_content_translation', description='Endpoints for Engagement Content Translation Management')


@cors_preflight('GET, POST, OPTIONS')
@API.route('/language/<language_id>')
class EngagementContentTranslationsByLanguage(Resource):
    """Resource for managing engagement content translations."""

    @staticmethod
    @cross_origin(origins=allowedorigins())
    def get(content_id, language_id):
        """Fetch content translations based on content_id AND language_id."""
        translations = EngagementContentTranslationService().get_translations_by_content_and_language(
            content_id, language_id
        )
        return jsonify(translations), HTTPStatus.OK

    @staticmethod
    @cross_origin(origins=allowedorigins())
    @_jwt.requires_auth
    def post():
        """Add new engagement content translation."""
        request_json = request.get_json()
        valid_format, errors = schema_utils.validate(request_json, 'engagement_content_translation')
        if not valid_format:
            return {'message': schema_utils.serialize(errors)}, HTTPStatus.BAD_REQUEST

        pre_populate = request_json.get('pre_populate', True)

        try:
            translation = EngagementContentTranslationSchema().load(request_json)
            created_translation = EngagementContentTranslationService().create_engagement_content_translation(
                translation, pre_populate
            )
            return jsonify(created_translation), HTTPStatus.CREATED
        except (ValidationError, BusinessException) as err:
            return {'message': str(err)}, HTTPStatus.BAD_REQUEST


@cors_preflight('GET, PATCH, DELETE, OPTIONS')
@API.route('/<int:translation_id>')
class EditEngagementContentTranslation(Resource):
    """Resource for updating or deleting an engagement content translation."""

    @staticmethod
    @cross_origin(origins=allowedorigins())
    def get(translation_id, **_):
        """Get engagement content translation by id."""
        translation = EngagementContentTranslationService().get_engagement_content_translation_by_id(translation_id)
        if translation:
            return jsonify(translation), HTTPStatus.OK
        return {'message': 'Translation not found'}, HTTPStatus.NOT_FOUND

    @staticmethod
    @cross_origin(origins=allowedorigins())
    @_jwt.requires_auth
    def patch(translation_id, **_):
        """Update engagement content translation."""
        translation_data = request.get_json()
        try:
            updated_translation = EngagementContentTranslationService().update_engagement_content_translation(
                translation_id, translation_data
            )
            return jsonify(updated_translation), HTTPStatus.OK
        except (ValidationError, BusinessException) as err:
            return {'message': str(err)}, HTTPStatus.BAD_REQUEST

    @staticmethod
    @cross_origin(origins=allowedorigins())
    @_jwt.requires_auth
    def delete(translation_id, **_):
        """Remove engagement content translation."""
        try:
            EngagementContentTranslationService().delete_engagement_content_translation(translation_id)
            return {'message': 'Translation successfully removed'}, HTTPStatus.NO_CONTENT
        except BusinessException as err:
            return {'message': str(err)}, HTTPStatus.BAD_REQUEST


@cors_preflight('GET, POST, OPTIONS')
@API.route('/')
class EngagementContentTranslations(Resource):
    """Resource for managing engagement content translations."""

    @staticmethod
    @cross_origin(origins=allowedorigins())
    @_jwt.requires_auth
    def post(**_):
        """Add new engagement content translation."""
        request_json = request.get_json()
        valid_format, errors = schema_utils.validate(request_json, 'engagement_content_translation')
        if not valid_format:
            return {'message': schema_utils.serialize(errors)}, HTTPStatus.BAD_REQUEST

        pre_populate = request_json.get('pre_populate', True)

        try:
            translation = EngagementContentTranslationSchema().load(request_json)
            created_translation = EngagementContentTranslationService().create_engagement_content_translation(
                translation, pre_populate
            )
            return jsonify(created_translation), HTTPStatus.CREATED
        except (ValidationError, BusinessException) as err:
            return {'message': str(err)}, HTTPStatus.BAD_REQUEST
