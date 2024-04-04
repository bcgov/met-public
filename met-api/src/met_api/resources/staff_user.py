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
from met_api.services.staff_user_membership_service import StaffUserMembershipService
from met_api.services.staff_user_service import StaffUserService
from met_api.utils.roles import Role
from met_api.utils.tenant_validator import require_role
from met_api.utils.token_info import TokenInfo
from met_api.utils.util import allowedorigins, cors_preflight

API = Namespace('user', description='Endpoints for User Management')
"""Custom exception messages
"""


@cors_preflight('PUT')
@API.route('/')
class StaffUsers(Resource):
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
    @require_role([Role.VIEW_USERS.value], skip_tenant_check_for_admin=True)
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
            include_roles=args.get('include_roles', default=False, type=lambda v: v.lower() == 'true'),
            include_inactive=args.get('include_inactive', default=False, type=lambda v: v.lower() == 'true')
        )
        return jsonify(users), HTTPStatus.OK


@cors_preflight('GET')
@API.route('/<user_id>')
class StaffUser(Resource):
    """User controller class."""

    @staticmethod
    @cross_origin(origins=allowedorigins())
    @require_role([Role.VIEW_USERS.value], skip_tenant_check_for_admin=True)
    def get(user_id):
        """Fetch a user by id."""
        args = request.args
        user = StaffUserService.get_user_by_id(
            user_id,
            include_roles=args.get('include_roles', default=False, type=lambda v: v.lower() == 'true'),
            include_inactive=True,
        )
        return user, HTTPStatus.OK


@cors_preflight('PATCH')
@API.route('/<user_id>/status')
class StaffUserStatus(Resource):
    """User controller class."""

    @staticmethod
    @cross_origin(origins=allowedorigins())
    @require_role([Role.TOGGLE_USER_STATUS.value])
    def patch(user_id):
        """Return a set of users(staff only)."""
        try:
            data = request.get_json()
            if data.get('active', None) is None:
                return {'message': 'active field is required'}, HTTPStatus.BAD_REQUEST

            user = StaffUserMembershipService().reactivate_deactivate_user(
                user_id,
                active=data.get('active'),
            )
            return user, HTTPStatus.OK
        except (KeyError, ValueError) as err:
            return str(err), HTTPStatus.BAD_REQUEST


@cors_preflight('POST, PUT')
@API.route('/<user_id>/roles')
class UserRoles(Resource):
    """Add user to composite roles."""

    @staticmethod
    @cross_origin(origins=allowedorigins())
    @require_role([Role.CREATE_ADMIN_USER.value], skip_tenant_check_for_admin=True)
    def post(user_id):
        """Add user to composite roles."""
        try:
            args = request.args
            user_schema = StaffUserService().assign_composite_role_to_user(user_id, args.get('role'))
            return user_schema, HTTPStatus.OK
        except KeyError as err:
            return str(err), HTTPStatus.INTERNAL_SERVER_ERROR
        except ValueError as err:
            return str(err), HTTPStatus.INTERNAL_SERVER_ERROR
        except BusinessException as err:
            return {'message': err.error}, err.status_code

    @staticmethod
    @cross_origin(origins=allowedorigins())
    @require_role([Role.UPDATE_USER_GROUP.value])
    def put(user_id):
        """Update user composite roles."""
        try:
            args = request.args
            user_schema = StaffUserMembershipService().reassign_user(user_id, args.get('role'))
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
    @require_role([Role.VIEW_USERS.value])
    def get(user_id):
        """Get engagement details by user id."""
        try:
            members = MembershipService.get_engagements_by_user(user_id)
            engagement_schema = EngagementSchema(exclude=['surveys', 'rich_content', 'rich_description'], many=True)
            return jsonify(engagement_schema.dump(members, many=True)), HTTPStatus.OK
        except BusinessException as err:
            return {'message': err.error}, err.status_code
