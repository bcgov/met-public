"""API endpoints for managing an engagement details tab translation resource."""

from http import HTTPStatus

from flask import jsonify, request
from flask_cors import cross_origin
from flask_restx import Namespace, Resource
from marshmallow import ValidationError

from met_api.auth import jwt as _jwt
from met_api.exceptions.business_exception import BusinessException
from met_api.schemas import utils as schema_utils
from met_api.services.engagement_details_tab_translation_service import EngagementDetailsTabTranslationService
from met_api.utils.token_info import TokenInfo
from met_api.utils.util import allowedorigins, cors_preflight


API = Namespace(
    'engagement_details_tab_translation',
    description='Endpoints for Engagement Details Tab Translation Management',
)


@cors_preflight('GET, POST, OPTIONS')
@API.route('/language/<language_id>')
class EngagementDetailsTabTranslationsByLanguage(Resource):
    """Resource for managing engagement details tab translations."""

    @staticmethod
    @cross_origin(origins=allowedorigins())
    def get(engagement_id, language_id):
        """Fetch all details tab translations for a given engagement and language."""
        try:
            translations = (
                EngagementDetailsTabTranslationService()
                .get_translations_by_engagement_and_language(engagement_id, language_id)
            )
            return jsonify(translations), HTTPStatus.OK
        except (KeyError, ValueError) as err:
            return {'message': str(err)}, HTTPStatus.BAD_REQUEST

    @staticmethod
    @cross_origin(origins=allowedorigins())
    @_jwt.requires_auth
    def post(engagement_id, language_id):
        """Create new details tab translations for an engagement and language (single or bulk)."""
        try:
            request_json = request.get_json()
            schema_id = 'engagement_details_tab_translation'
            payload = request_json if isinstance(request_json, list) else [request_json]

            for idx, item in enumerate(payload):
                item.setdefault('language_id', language_id)
                valid, errors = schema_utils.validate(item, schema_id)

                if not valid:
                    return (
                        {
                            'message': f'Item {idx} invalid: {schema_utils.serialize(errors)}',
                        },
                        HTTPStatus.BAD_REQUEST,
                    )
            created_translations = (
                EngagementDetailsTabTranslationService()
                .create_translations(
                    engagement_id,
                    language_id,
                    payload,
                )
            )
            return jsonify(created_translations), HTTPStatus.CREATED
        except ValidationError as err:
            return {'message': err.messages}, HTTPStatus.BAD_REQUEST

    @staticmethod
    @cross_origin(origins=allowedorigins())
    @_jwt.requires_auth
    def put(engagement_id, language_id):
        """Bulk update details tabs for an engagement (sync create/update/delete)."""
        try:
            request_json = request.get_json()
            schema_id = 'engagement_details_tab_translation'
            payload = request_json if isinstance(request_json, list) else [request_json]

            for idx, item in enumerate(payload):
                item.setdefault('language_id', language_id)
                valid, errors = schema_utils.validate(item, schema_id)
                if not valid:
                    return (
                        {
                            'status': 'failure',
                            'message': f'Item {idx} invalid: ' + schema_utils.serialize(errors),
                        },
                        HTTPStatus.BAD_REQUEST,
                    )
            updated_translations = EngagementDetailsTabTranslationService().sync_translations(
                engagement_id,
                language_id,
                payload,
                user_id=TokenInfo.get_id(),
            )
            return jsonify(updated_translations), HTTPStatus.OK
        except BusinessException as err:
            return {'status': 'failure', 'message': err.error}, HTTPStatus.BAD_REQUEST
        except ValidationError as err:
            return {'status': 'failure', 'message': err.messages}, HTTPStatus.BAD_REQUEST
