"""The Authorization service.

This module is to handle authorization related queries.
"""
from flask_restx import abort

from met_api.constants.membership_type import MembershipType
from met_api.models.membership import Membership as MembershipModel
from met_api.models.staff_user import StaffUser as StaffUserModel
from met_api.utils.user_context import UserContext, user_context


# pylint: disable=unused-argument
@user_context
def check_auth(**kwargs):
    """Check if user is authorized to perform action on the service."""
    user_from_context: UserContext = kwargs['user_context']
    token_roles = set(user_from_context.roles)
    permitted_roles = set(kwargs.get('one_of_roles', []))
    has_valid_roles = token_roles & permitted_roles
    if has_valid_roles:
        return

    team_permitted_roles = {MembershipType.TEAM_MEMBER.name, MembershipType.REVIEWER.name} & permitted_roles

    if team_permitted_roles:
        # check if he is a member of particular engagement.
        has_valid_team_access = _has_team_membership(kwargs, user_from_context, team_permitted_roles)
        if has_valid_team_access:
            return

    abort(403)


def _has_team_membership(kwargs, user_from_context, team_permitted_roles) -> bool:
    eng_id = kwargs.get('engagement_id')

    if not eng_id:
        return False

    user = StaffUserModel.get_user_by_external_id(user_from_context.sub)

    if not user:
        return False

    membership = MembershipModel.find_by_engagement_and_user_id(eng_id, user.id)

    if not membership:
        return False

    return membership.type.name in team_permitted_roles
