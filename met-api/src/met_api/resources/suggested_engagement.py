# Copyright © 2026 Province of British Columbia
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
"""API endpoints for managing suggested engagements."""

from http import HTTPStatus

from flask import jsonify, request
from flask_cors import cross_origin
from flask_restx import Namespace, Resource
from marshmallow import ValidationError

from met_api.auth import jwt as _jwt
from met_api.exceptions.business_exception import BusinessException
from met_api.services.suggested_engagement_service import SuggestedEngagementService
from met_api.utils.util import allowedorigins, cors_preflight

API = Namespace('suggested_engagements', description='Endpoints for Suggested Engagements')


@cors_preflight('GET, PUT, OPTIONS')
@API.route('')  # /api/engagement/<int:engagement_id>/suggestions
class SuggestedEngagementResource(Resource):
    """Resource for managing suggested engagements."""

    @staticmethod
    @cross_origin(origins=allowedorigins())
    def get(engagement_id):
        """Fetch all suggested engagements for a given engagement."""
        try:
            attach = request.args.get('attach')
            attach_bool = attach == 'true'
            suggested = SuggestedEngagementService.get_suggestions_by_engagement_id(
                engagement_id, attach=attach_bool
            )
            return jsonify(suggested), HTTPStatus.OK
        except (KeyError, ValueError) as err:
            return {'message': str(err)}, HTTPStatus.INTERNAL_SERVER_ERROR

    @staticmethod
    @cross_origin(origins=allowedorigins())
    @_jwt.requires_auth
    def put(engagement_id):
        """Bulk update suggested engagements (sync create/update/delete)."""
        try:
            request_json = request.get_json()
            result = SuggestedEngagementService.sync_suggestions(engagement_id, request_json)
            return result, HTTPStatus.OK
        except BusinessException as err:
            return {'status': 'failure', 'message': err.error}, HTTPStatus.BAD_REQUEST
        except ValidationError as err:
            return {'status': 'failure', 'message': err.messages}, HTTPStatus.BAD_REQUEST
