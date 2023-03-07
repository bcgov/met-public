"""The Authorization service.

This module is to handle authorization related queries.
"""
from flask_restx import abort

from met_api.constants.membership_type import MembershipType
from met_api.models.membership import Membership as MembershipModel
from met_api.models.user import User as UserModel
from met_api.utils.user_context import UserContext, user_context


# pylint: disable=unused-argument
@user_context
def check_auth(**kwargs):
    """Check if user is authorized to perform action on the service."""
    user_from_context: UserContext = kwargs['user_context']
    token_roles = user_from_context.roles
    permitted_roles = kwargs.get('one_of_roles', [])
    has_valid_roles = bool(set(token_roles) & set(permitted_roles))
    if has_valid_roles:
        return
    if MembershipType.TEAM_MEMBER.name in permitted_roles:
        # check if he is a member of particular engagement.
        is_a_member = _has_team_membership(kwargs, user_from_context)
        if is_a_member:
            return

    abort(403)


def _has_team_membership(kwargs, user_from_context) -> bool:
    eng_id = kwargs.get('engagement_id', None)
    external_id = user_from_context.sub
    user = UserModel.get_user_by_external_id(external_id)
    if not eng_id or not user:
        return False
    memberships = MembershipModel.find_by_engagement_and_user_id(eng_id, user.id)
    # TODO when multiple memberships are supported , iterate list and check role.
    if memberships and memberships[0].type == MembershipType.TEAM_MEMBER:
        return True
    return False
