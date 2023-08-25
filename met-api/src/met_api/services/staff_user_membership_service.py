"""Service for membership."""
from datetime import datetime
from http import HTTPStatus

from met_api.constants.membership_type import MembershipType
from met_api.exceptions.business_exception import BusinessException
from met_api.models import StaffUser as StaffUserModel
from met_api.models.engagement import Engagement as EngagementModel
from met_api.models.membership import Membership as MembershipModel
from met_api.schemas.staff_user import StaffUserSchema
from met_api.services import authorization
from met_api.services.staff_user_service import KEYCLOAK_SERVICE, StaffUserService
from met_api.services.membership_service import MembershipService
from met_api.utils.constants import Groups
from met_api.utils.enums import KeycloakGroups, MembershipStatus
from met_api.utils.roles import Role
from met_api.utils.token_info import TokenInfo


class StaffUserMembershipService:
    """Staff User Membership management service."""


    @staticmethod
    def _get_membership_type_from_group_name(group_name):
        """Get membership type from group name."""
        if group_name == KeycloakGroups.EAO_TEAM_MEMBER.value:
            return MembershipType.TEAM_MEMBER
        if group_name == KeycloakGroups.EAO_REVIEWER.value:
            return MembershipType.REVIEWER
        return None

    @classmethod
    def reassign_user(cls, user_id, group_name):
        user = StaffUserService.get_user_by_id(user_id, include_groups=True)
        if not user:
            raise BusinessException(
                error='Invalid User.',
                status_code=HTTPStatus.BAD_REQUEST)

        external_id = user.get('external_id', None)
        main_group = user.get('main_group', None)

        if any([not external_id, not main_group]):
            raise BusinessException(
                error='Invalid User.',
                status_code=HTTPStatus.BAD_REQUEST)

        if group_name not in Groups:
            raise BusinessException(
                error='Invalid group name.',
                status_code=HTTPStatus.BAD_REQUEST)

        if main_group == group_name:
            raise BusinessException(
                error='User is already a member of this group.',
                status_code=HTTPStatus.BAD_REQUEST)

        StaffUserService.remove_user_from_group(external_id, main_group)
        StaffUserService.add_user_to_group(external_id, group_name)
        membership_type = StaffUserMembershipService._get_membership_type_from_group_name(group_name)
        MembershipService.reassign_memberships(user_id, membership_type)
