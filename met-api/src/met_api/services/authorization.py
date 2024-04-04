"""The Authorization service.

This module is to handle authorization related queries.
"""
from http import HTTPStatus

from flask import current_app
from flask_restx import abort

from met_api.constants.membership_type import MembershipType
from met_api.models.engagement import Engagement as EngagementModel
from met_api.models.membership import Membership as MembershipModel
from met_api.models.staff_user import StaffUser as StaffUserModel
from met_api.utils.enums import MembershipStatus
from met_api.utils.user_context import UserContext, user_context

UNAUTHORIZED_MSG = 'You are not authorized to perform this action!'


# pylint: disable=unused-argument
@user_context
def check_auth(**kwargs):
    """Check if user is authorized to perform action on the service."""
    skip_tenant_check = current_app.config.get('IS_SINGLE_TENANT_ENVIRONMENT')
    user_from_context: UserContext = kwargs['user_context']
    user_from_db = StaffUserModel.get_user_by_external_id(user_from_context.sub)
    if not user_from_db:
        abort(HTTPStatus.FORBIDDEN, 'User not found')
    token_roles = set(user_from_context.roles)
    permitted_roles = set(kwargs.get('one_of_roles', []))
    has_valid_roles = token_roles & permitted_roles
    if has_valid_roles:
        if not skip_tenant_check:

            user_tenant_id = user_from_db.tenant_id
            _validate_tenant(kwargs.get('engagement_id'), user_tenant_id)
        return
    team_permitted_roles = {MembershipType.TEAM_MEMBER.name, MembershipType.REVIEWER.name} & permitted_roles

    if team_permitted_roles:
        # check if he is a member of particular engagement.

        has_valid_team_access = _has_team_membership(kwargs, user_from_context, team_permitted_roles)
        if has_valid_team_access:
            return

    abort(HTTPStatus.FORBIDDEN, UNAUTHORIZED_MSG)


def _validate_tenant(eng_id, tenant_id):
    """Validate users tenant id with engagements tenant id."""
    if not eng_id:
        return
    engagement_tenant_id = EngagementModel.find_tenant_id_by_id(eng_id)
    if engagement_tenant_id and str(tenant_id) != str(engagement_tenant_id):
        current_app.logger.debug('Aborting . Tenant Id on Engagement and user context Mismatch\n'
                                 f'engagement_tenant_id:{engagement_tenant_id}\n'
                                 f'tenant_id: {tenant_id}')

        abort(HTTPStatus.FORBIDDEN, UNAUTHORIZED_MSG)


def _has_team_membership(kwargs, user_from_context, team_permitted_roles) -> bool:
    eng_id = kwargs.get('engagement_id')

    if not eng_id:

        return False

    user = StaffUserModel.get_user_by_external_id(user_from_context.sub)

    if not user:

        return False

    membership = MembershipModel.find_by_engagement_and_user_id(eng_id, user.id, status=MembershipStatus.ACTIVE.value)

    if not membership:

        return False

    skip_tenant_check = current_app.config.get('IS_SINGLE_TENANT_ENVIRONMENT')
    if not skip_tenant_check:
        # check tenant matching
        if membership.tenant_id and str(membership.tenant_id) != str(user_from_context.tenant_id):
            current_app.logger.debug(f'Aborting . Tenant Id on membership and user context Mismatch'
                                     f'membership.tenant_id:{membership.tenant_id} '
                                     f'user_from_context.tenant_id: {user_from_context.tenant_id}')
            abort(HTTPStatus.FORBIDDEN, UNAUTHORIZED_MSG)

    return membership.type.name in team_permitted_roles
