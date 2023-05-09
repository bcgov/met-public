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
"""API endpoints for managing an engagement resource."""

from http import HTTPStatus

from flask import jsonify, request
from flask_cors import cross_origin
from flask_restx import Namespace, Resource

from met_api.auth import jwt as _jwt
from met_api.exceptions.business_exception import BusinessException
from met_api.schemas.memberships import MembershipSchema
from met_api.services.membership_service import MembershipService
from met_api.utils.roles import Role
from met_api.utils.util import allowedorigins, cors_preflight

API = Namespace('engagements', description='Endpoints for Engagements Management')
"""Custom exception messages
"""


@cors_preflight('GET,OPTIONS')
@API.route('')
class EngagementMembership(Resource):
    """Resource for managing engagement's membership."""

    @staticmethod
    @cross_origin(origins=allowedorigins())
    @_jwt.has_one_of_roles([Role.VIEW_MEMBERS.value])
    def get(engagement_id):
        """Create a new membership."""
        # TODO validate against a schema.
        try:
            members = MembershipService.get_memberships(engagement_id)
            return jsonify(MembershipSchema().dump(members, many=True)), HTTPStatus.OK
        except BusinessException as err:
            return {'message': err.error}, err.status_code

    @staticmethod
    @cross_origin(origins=allowedorigins())
    @_jwt.has_one_of_roles([Role.EDIT_MEMBERS.value])
    def post(engagement_id):
        """Create a new membership."""
        # TODO validate against a schema.
        try:
            member = MembershipService.create_membership(engagement_id, request.get_json())
            return MembershipSchema().dump(member), HTTPStatus.OK
        except BusinessException as err:
            return {'message': err.error}, err.status_code


@cors_preflight('GET,OPTIONS')
@API.route('/<user_id>')
class EngagementMembershipUser(Resource):
    """Resource for fetching memberships for user."""

    @staticmethod
    @cross_origin(origins=allowedorigins())
    @_jwt.has_one_of_roles([Role.VIEW_MEMBERS.value])
    def get(engagement_id, user_id):  # pylint: disable=unused-argument
        """Get membership by id."""
        try:
            members = MembershipService.get_assigned_engagements(user_id)
            return jsonify(MembershipSchema().dump(members, many=True)), HTTPStatus.OK
        except BusinessException as err:
            return {'message': err.error}, err.status_code
