# Copyright © 2024 Province of British Columbia
#
# Licensed under the Apache License, Version 2.0 (the 'License');
"""API endpoints for managing a SubscribeItemTranslation resource."""

from http import HTTPStatus

from flask import request
from flask_cors import cross_origin
from flask_restx import Namespace, Resource
from marshmallow import ValidationError

from met_api.auth import jwt as _jwt
from met_api.exceptions.business_exception import BusinessException
from met_api.schemas import utils as schema_utils
from met_api.schemas.subscribe_item_translation_schema import SubscribeItemTranslationSchema
from met_api.services.subscribe_item_translation_service import SubscribeItemTranslationService
from met_api.utils.util import allowedorigins, cors_preflight


API = Namespace(
    'subscribe_item_translations',
    description='Endpoints for SubscribeItemTranslation Management',
)


@cors_preflight('GET, POST, PATCH, DELETE, OPTIONS')
@API.route('/<int:subscribe_item_translation_id>')
class SubscribeItemTranslationResource(Resource):
    """Resource for managing subscribe item translations."""

    @staticmethod
    @cross_origin(origins=allowedorigins())
    def get(subscribe_item_translation_id, **_):
        """Fetch a subscribe item translation by id."""
        try:
            subscribe_item_translation = (
                SubscribeItemTranslationService.get_by_id(
                    subscribe_item_translation_id
                )
            )
            return (
                SubscribeItemTranslationSchema().dump(subscribe_item_translation),
                HTTPStatus.OK,
            )
        except (KeyError, ValueError) as err:
            return str(err), HTTPStatus.INTERNAL_SERVER_ERROR

    @staticmethod
    @_jwt.requires_auth
    @cross_origin(origins=allowedorigins())
    def patch(widget_subscribe_id, subscribe_item_translation_id):
        """Update saved subscribe item translation partially."""
        try:
            request_json = request.get_json()
            subscribe_item_translation = (
                SubscribeItemTranslationService.update_subscribe_item_translation(
                    widget_subscribe_id, subscribe_item_translation_id, request_json
                )
            )
            return (
                SubscribeItemTranslationSchema().dump(subscribe_item_translation),
                HTTPStatus.OK,
            )
        except ValueError as err:
            return str(err), HTTPStatus.NOT_FOUND
        except ValidationError as err:
            return str(err.messages), HTTPStatus.BAD_REQUEST

    @staticmethod
    @_jwt.requires_auth
    @cross_origin(origins=allowedorigins())
    def delete(widget_subscribe_id, subscribe_item_translation_id):
        """Delete a subscribe item translation."""
        try:
            success = SubscribeItemTranslationService.delete_subscribe_item_translation(
                widget_subscribe_id, subscribe_item_translation_id
            )
            if success:
                return (
                    'Successfully deleted subscribe item translation',
                    HTTPStatus.NO_CONTENT,
                )
            raise ValueError('Subscribe item translation not found')
        except KeyError as err:
            return str(err), HTTPStatus.BAD_REQUEST
        except ValueError as err:
            return str(err), HTTPStatus.NOT_FOUND


@cors_preflight('GET, OPTIONS')
@API.route('/item/<int:subscribe_item_id>/language/<int:language_id>')
class SubscribeItemTranslationResourceByLanguage(Resource):
    """Resource for subscribe item using language_id."""

    @staticmethod
    @cross_origin(origins=allowedorigins())
    def get(subscribe_item_id, language_id, **_):
        """Fetch a subscribe item translation by language_id."""
        try:
            subscribe_item_translation = (
                SubscribeItemTranslationService.get_subscribe_item_translation(
                    subscribe_item_id, language_id
                )
            )
            return (
                SubscribeItemTranslationSchema().dump(
                    subscribe_item_translation[0], many=False
                ),
                HTTPStatus.OK,
            )
        except (KeyError, ValueError) as err:
            return str(err), HTTPStatus.INTERNAL_SERVER_ERROR


@cors_preflight('POST, OPTIONS')
@API.route('/')
class SubscribeItemTranslations(Resource):
    """Resource for managing multiple subscribe item translations."""

    @staticmethod
    @_jwt.requires_auth
    @cross_origin(origins=allowedorigins())
    def post(widget_subscribe_id):
        """Create a new subscribe item translation."""
        try:
            request_json = request.get_json()
            valid_format, errors = schema_utils.validate(
                request_json, 'subscribe_item_translation'
            )
            if not valid_format:
                return {
                    'message': schema_utils.serialize(errors)
                }, HTTPStatus.BAD_REQUEST
            # pre-populate is to indicate whether to pre-populate the translation with data in base language
            pre_populate = request_json.get('pre_populate', True)

            subscribe_item_translation = (
                SubscribeItemTranslationService.create_subscribe_item_translation(
                    widget_subscribe_id, request_json, pre_populate
                )
            )
            return (
                SubscribeItemTranslationSchema().dump(subscribe_item_translation),
                HTTPStatus.CREATED,
            )
        except (KeyError, ValueError) as err:
            return str(err), HTTPStatus.INTERNAL_SERVER_ERROR
        except ValidationError as err:
            return str(err.messages), HTTPStatus.BAD_REQUEST
        except BusinessException as err:
            return err.error, err.status_code
