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
"""API endpoints for managing an user resource."""

from http import HTTPStatus

from flask import jsonify, request
from flask_cors import cross_origin
from flask_restx import Namespace, Resource

from met_api.auth import jwt as _jwt
from met_api.exceptions.business_exception import BusinessException
from met_api.models.pagination_options import PaginationOptions
from met_api.schemas.engagement import EngagementSchema
from met_api.schemas.staff_user import StaffUserSchema
from met_api.services.membership_service import MembershipService
from met_api.services.staff_user_service import StaffUserService
from met_api.utils.roles import Role
from met_api.utils.token_info import TokenInfo
from met_api.utils.util import allowedorigins, cors_preflight

API = Namespace('user', description='Endpoints for User Management')
"""Custom exception messages
"""


@cors_preflight('PUT')
@API.route('/')
class StaffUser(Resource):
    """User controller class."""

    @staticmethod
    @cross_origin(origins=allowedorigins())
    @_jwt.requires_auth
    def put():
        """Update or create a user."""
        try:
            user_data = TokenInfo.get_user_data()
            user = StaffUserService().create_or_update_user(user_data)
            user.roles = user_data.get('roles')
            return StaffUserSchema().dump(user), HTTPStatus.OK
        except KeyError as err:
            return str(err), HTTPStatus.INTERNAL_SERVER_ERROR
        except ValueError as err:
            return str(err), HTTPStatus.INTERNAL_SERVER_ERROR

    @staticmethod
    @cross_origin(origins=allowedorigins())
    @_jwt.has_one_of_roles([Role.VIEW_USERS.value])
    def get():
        """Return a set of users(staff only)."""
        args = request.args
        pagination_options = PaginationOptions(
            page=args.get('page', None, int),
            size=args.get('size', None, int),
            sort_key=args.get('sort_key', '', str),
            sort_order=args.get('sort_order', 'asc', str),
        )
        users = StaffUserService.find_users(
            pagination_options=pagination_options,
            search_text=args.get('search_text', '', str),
            include_groups=args.get('include_groups', default=False, type=lambda v: v.lower() == 'true'),
        )
        return jsonify(users), HTTPStatus.OK


@cors_preflight('POST')
@API.route('/<user_id>/groups')
class UserGroup(Resource):
    """Add user to group."""

    @staticmethod
    @cross_origin(origins=allowedorigins())
    @_jwt.has_one_of_roles([Role.CREATE_ADMIN_USER.value])
    def post(user_id):
        """Add user to group."""
        try:
            args = request.args
            user_schema = StaffUserService().add_user_to_group(user_id, args.get('group'))
            return user_schema, HTTPStatus.OK
        except KeyError as err:
            return str(err), HTTPStatus.INTERNAL_SERVER_ERROR
        except ValueError as err:
            return str(err), HTTPStatus.INTERNAL_SERVER_ERROR
        except BusinessException as err:
            return {'message': err.error}, err.status_code


@cors_preflight('GET,OPTIONS')
@API.route('/<user_id>/engagements')
class EngagementMemberships(Resource):
    """Resource for fetching engagements for user."""

    @staticmethod
    @cross_origin(origins=allowedorigins())
    @_jwt.has_one_of_roles([Role.VIEW_USERS.value])
    def get(user_id):
        """Get engagement details by user id."""
        try:
            members = MembershipService.get_engagements_by_user(user_id)
            engagement_schema = EngagementSchema(exclude=['surveys', 'rich_content', 'rich_description'], many=True)
            return jsonify(engagement_schema.dump(members, many=True)), HTTPStatus.OK
        except BusinessException as err:
            return {'message': err.error}, err.status_code
