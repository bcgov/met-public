# Copyright © 2021 Province of British Columbia
#
# Licensed under the Apache License, Version 2.0 (the 'License');
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an 'AS IS' BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
"""API endpoints for managing an widget translation resource."""

from http import HTTPStatus

from flask import jsonify, request
from flask_cors import cross_origin
from flask_restx import Namespace, Resource
from marshmallow import ValidationError

from met_api.auth import jwt as _jwt
from met_api.schemas import utils as schema_utils
from met_api.schemas.widget_translation import WidgetTranslationSchema
from met_api.services.widget_translation_service import WidgetTranslationService
from met_api.utils.util import allowedorigins, cors_preflight


API = Namespace('widgettranslation', description='Endpoints for Widget translation Management')
"""Custom exception messages
"""


@cors_preflight('GET, OPTIONS')
@API.route('/widget/<widget_id>/language/<language_id>')
class WidgetTranslation(Resource):
    """Resource for managing a widget translation."""

    @staticmethod
    @cross_origin(origins=allowedorigins())
    def get(widget_id, language_id):
        """Fetch a list of widgets by language_id."""
        try:
            widgets = WidgetTranslationService().get_translation_by_widget_id_and_language_id(
                widget_id, language_id)
            return jsonify(widgets), HTTPStatus.OK
        except (KeyError, ValueError) as err:
            return str(err), HTTPStatus.INTERNAL_SERVER_ERROR


@cors_preflight('POST, OPTIONS')
@API.route('/engagement/<engagement_id>')
class CreateWidgetTranslation(Resource):
    """Resource for creating a widget translation."""

    @staticmethod
    @cross_origin(origins=allowedorigins())
    @_jwt.requires_auth
    def post(engagement_id):
        """Add new widget translation."""
        try:
            request_json = request.get_json()
            valid_format, errors = schema_utils.validate(request_json, 'widget_translation')
            if not valid_format:
                return {'message': schema_utils.serialize(errors)}, HTTPStatus.BAD_REQUEST

            args = request.args
            is_default_language = args.get(
                'is_default_language',
                default=True,
                type=lambda v: v.lower() == 'true'
            )

            translation = WidgetTranslationSchema().load(request_json)
            created_widget_translation = WidgetTranslationService().create_widget_translation(translation,
                                                                                              engagement_id,
                                                                                              is_default_language)
            return created_widget_translation, HTTPStatus.OK
        except (KeyError, ValueError) as err:
            return str(err), HTTPStatus.INTERNAL_SERVER_ERROR
        except ValidationError as err:
            return str(err.messages), HTTPStatus.INTERNAL_SERVER_ERROR


@cors_preflight('GET, DELETE, PATCH')
@API.route('/<widget_translation_id>/engagement/<engagement_id>')
class EditWidgetTranslation(Resource):
    """Resource for updating or deleting a widget translation."""

    @staticmethod
    @cross_origin(origins=allowedorigins())
    @_jwt.requires_auth
    def delete(engagement_id, widget_translation_id):
        """Remove widget translation for a widget."""
        try:
            WidgetTranslationService().delete_widget_translation(engagement_id, widget_translation_id)
            return 'Widget translation successfully removed', HTTPStatus.OK
        except KeyError as err:
            return str(err), HTTPStatus.INTERNAL_SERVER_ERROR
        except ValueError as err:
            return str(err), HTTPStatus.INTERNAL_SERVER_ERROR

    @staticmethod
    @cross_origin(origins=allowedorigins())
    @_jwt.requires_auth
    def patch(engagement_id, widget_translation_id):
        """Update widget translation."""
        try:
            translation_data = request.get_json()
            updated_widget = WidgetTranslationService().update_widget_translation(engagement_id,
                                                                                  widget_translation_id,
                                                                                  translation_data)
            return updated_widget, HTTPStatus.OK
        except (KeyError, ValueError) as err:
            return str(err), HTTPStatus.INTERNAL_SERVER_ERROR
        except ValidationError as err:
            return str(err.messages), HTTPStatus.INTERNAL_SERVER_ERROR
