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
"""API endpoints for managing an engagement content resource."""

from http import HTTPStatus

from flask import jsonify, request
from flask_cors import cross_origin
from flask_restx import Namespace, Resource
from marshmallow import ValidationError

from met_api.auth import jwt as _jwt
from met_api.exceptions.business_exception import BusinessException
from met_api.schemas import utils as schema_utils
from met_api.services.engagement_content_service import EngagementContentService
from met_api.utils.token_info import TokenInfo
from met_api.utils.util import allowedorigins, cors_preflight


API = Namespace('engagement_content', description='Endpoints for Engagement Content Management')
"""Custom exception messages
"""


@cors_preflight('GET, POST, OPTIONS')
@API.route('')
class EngagementContent(Resource):
    """Resource for managing a engagement content."""

    @staticmethod
    @cross_origin(origins=allowedorigins())
    def get(engagement_id):
        """Fetch a list of engagement contents by engagement id."""
        try:
            engagement_contents = EngagementContentService().get_contents_by_engagement_id(engagement_id)
            return jsonify(engagement_contents), HTTPStatus.OK
        except (KeyError, ValueError) as err:
            return str(err), HTTPStatus.INTERNAL_SERVER_ERROR

    @staticmethod
    @cross_origin(origins=allowedorigins())
    @_jwt.requires_auth
    def post(engagement_id):
        """Add new engagement content for an engagement."""
        try:
            request_json = request.get_json()
            valid_format, errors = schema_utils.validate(request_json, 'engagement_content')
            if not valid_format:
                return {'message': schema_utils.serialize(errors)}, HTTPStatus.BAD_REQUEST

            created_content = EngagementContentService().create_engagement_content(request_json,
                                                                                   engagement_id)
            return jsonify(created_content), HTTPStatus.OK
        except (KeyError, ValueError) as err:
            return str(err), HTTPStatus.INTERNAL_SERVER_ERROR
        except ValidationError as err:
            return str(err.messages), HTTPStatus.INTERNAL_SERVER_ERROR


@cors_preflight('PATCH')
@API.route('/sort_index')
class EngagementContentSort(Resource):
    """Resource for managing engagement contents sort order with engagements."""

    @staticmethod
    @cross_origin(origins=allowedorigins())
    @_jwt.requires_auth
    def patch(engagement_id):
        """Sort contents for an engagement."""
        try:
            request_json = request.get_json()
            EngagementContentService().sort_engagement_content(engagement_id, request_json,
                                                               user_id=TokenInfo.get_id())
            return {}, HTTPStatus.NO_CONTENT
        except BusinessException as err:
            return {'message': err.error}, err.status_code


@cors_preflight('GET, DELETE, PATCH')
@API.route('/<engagement_content_id>')
class EngagementContentEdit(Resource):
    """Resource for managing engagement contents with engagements."""

    @staticmethod
    @cross_origin(origins=allowedorigins())
    @_jwt.requires_auth
    def delete(engagement_id, engagement_content_id):
        """Remove engagement content for an engagement."""
        try:
            EngagementContentService().delete_engagement_content(engagement_id, engagement_content_id)
            return 'Engagement content successfully removed', HTTPStatus.OK
        except KeyError as err:
            return str(err), HTTPStatus.INTERNAL_SERVER_ERROR
        except ValueError as err:
            return str(err), HTTPStatus.INTERNAL_SERVER_ERROR

    @staticmethod
    @cross_origin(origins=allowedorigins())
    @_jwt.requires_auth
    def patch(engagement_id, engagement_content_id):
        """Update engagement content."""
        try:
            user_id = TokenInfo.get_id()
            engagement_content_data = request.get_json()
            valid_format, errors = schema_utils.validate(engagement_content_data, 'engagement_content_update')
            if not valid_format:
                return {'message': schema_utils.serialize(errors)}, HTTPStatus.BAD_REQUEST

            updated_engagement_content = EngagementContentService().update_engagement_content(engagement_id,
                                                                                              engagement_content_id,
                                                                                              engagement_content_data,
                                                                                              user_id)
            return updated_engagement_content, HTTPStatus.OK
        except (KeyError, ValueError) as err:
            return str(err), HTTPStatus.INTERNAL_SERVER_ERROR
        except ValidationError as err:
            return str(err.messages), HTTPStatus.INTERNAL_SERVER_ERROR
