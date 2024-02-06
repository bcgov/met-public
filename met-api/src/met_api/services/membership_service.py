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
from met_api.utils.constants import Groups
from met_api.utils.enums import KeycloakGroups, MembershipStatus
from met_api.utils.roles import Role
from met_api.utils.token_info import TokenInfo


class MembershipService:
    """Membership management service."""

    @staticmethod
    def create_membership(engagement_id, request_json: dict):
        """Create membership."""
        user_id = request_json.get('user_id')
        user: StaffUserModel = StaffUserModel.get_user_by_external_id(user_id)
        if not user:
            raise BusinessException(
                error='Invalid User.',
                status_code=HTTPStatus.BAD_REQUEST)

        one_of_roles = (
            MembershipType.TEAM_MEMBER.name,
            Role.EDIT_MEMBERS.value
        )
        authorization.check_auth(one_of_roles=one_of_roles, engagement_id=engagement_id)

        user_details = StaffUserSchema().dump(user)
        # attach and map groups
        StaffUserService.attach_groups([user_details])
        MembershipService._validate_create_membership(engagement_id, user_details)
        group_name, membership_type = MembershipService._get_membership_details(user_details)
        MembershipService._add_user_group(user_details, group_name)
        membership = MembershipService._create_membership_model(engagement_id, user.id, membership_type)
        return membership

    @staticmethod
    def _validate_create_membership(engagement_id, user_details):
        """Validate create membership."""
        request_user = TokenInfo.get_user_data()
        if request_user.get('external_id') == user_details.get('external_id'):
            raise BusinessException(
                error='You cannot add yourself to an engagement.',
                status_code=HTTPStatus.FORBIDDEN.value)

        user_id = user_details.get('id')

        groups = user_details.get('groups')
        if KeycloakGroups.EAO_IT_ADMIN.value in groups:
            raise BusinessException(
                error='This user is already an Administrator.',
                status_code=HTTPStatus.CONFLICT.value)

        existing_membership = MembershipModel.find_by_engagement_and_user_id(
            engagement_id,
            user_id,
            status=MembershipStatus.ACTIVE.value
        )

        if existing_membership:
            raise BusinessException(
                error=f'This {user_details.get("main_group", "user")} is already assigned to this engagement.',
                status_code=HTTPStatus.CONFLICT.value)

        request_user = TokenInfo.get_user_data()
        if request_user.get('external_id') == user_details.get('external_id'):
            raise BusinessException(
                error='You cannot add yourself to an engagement.',
                status_code=HTTPStatus.FORBIDDEN.value)

    @staticmethod
    def _get_membership_details(user_details):
        """Get the group name and membership type for the user based on their assigned groups."""
        default_group_name = Groups.EAO_TEAM_MEMBER.name
        default_membership_type = MembershipType.TEAM_MEMBER

        is_reviewer = Groups.EAO_REVIEWER.value in user_details.get('groups')
        is_team_member = Groups.EAO_TEAM_MEMBER.value in user_details.get('groups')

        if is_reviewer:
            # If the user is assigned to the EAO_REVIEWER group, set the group name and membership type accordingly
            group_name = Groups.EAO_REVIEWER.name
            membership_type = MembershipType.REVIEWER
        elif is_team_member:
            # If the user is assigned to the EAO_TEAM_MEMBER group, set the group name and membership type accordingly
            group_name = Groups.EAO_TEAM_MEMBER.name
            membership_type = MembershipType.TEAM_MEMBER
        else:
            # If the user is not assigned to either group, return default values for group name and membership type
            group_name = default_group_name
            membership_type = default_membership_type

        return group_name, membership_type

    @staticmethod
    def _add_user_group(user: StaffUserModel, group_name=Groups.EAO_TEAM_MEMBER.name):
        valid_member_teams = [Groups.EAO_TEAM_MEMBER.name, Groups.EAO_REVIEWER.name]
        if group_name not in valid_member_teams:
            raise BusinessException(
                error='Invalid Group name.',
                status_code=HTTPStatus.BAD_REQUEST
            )

        KEYCLOAK_SERVICE.add_user_to_group(
            user_id=user.get('external_id'),
            group_name=group_name
        )

    @staticmethod
    def _create_membership_model(engagement_id, user_id, membership_type=MembershipType.TEAM_MEMBER):
        if membership_type not in MembershipType.__members__.values():
            raise BusinessException(
                error='Invalid Membership type.',
                status_code=HTTPStatus.BAD_REQUEST
            )

        new_membership_details = {
            'status': MembershipStatus.ACTIVE.value,
            'type': membership_type,
        }

        new_membership = MembershipModel.create_new_version(
            engagement_id,
            user_id,
            new_membership_details
        )
        return new_membership

    @staticmethod
    def get_memberships(engagement_id):
        """Get memberships by engagement id."""
        # get user to be added from request json
        one_of_roles = (
            MembershipType.TEAM_MEMBER.name,
            Role.VIEW_MEMBERS.value
        )
        authorization.check_auth(one_of_roles=one_of_roles, engagement_id=engagement_id)

        memberships = MembershipModel.find_by_engagement(engagement_id)
        return memberships

    @staticmethod
    def get_assigned_engagements(
            user_id,
            include_revoked=False,
    ):
        """Get memberships by user id."""
        status = MembershipStatus.ACTIVE.value if not include_revoked else None
        return MembershipModel.find_by_external_user_id(
            user_id,
            status=status,
        )

    @staticmethod
    def get_engagements_by_user(user_id):
        """Get engagements by user id."""
        return EngagementModel.get_assigned_engagements(user_id)

    @staticmethod
    def update_membership_status(engagement_id: int, user_id: int, action: str):
        """Update membership status."""
        membership = MembershipModel.find_by_engagement_and_user_id(engagement_id, user_id)

        if membership.engagement_id != int(engagement_id):
            raise ValueError('Membership does not belong to this engagement.')

        one_of_roles = (
            MembershipType.TEAM_MEMBER.name,
            Role.EDIT_MEMBERS.value
        )
        authorization.check_auth(one_of_roles=one_of_roles, engagement_id=engagement_id)

        if not membership:
            raise ValueError('Invalid Membership.')

        if action == 'revoke':
            return MembershipService.revoke_membership(membership)

        if action == 'reinstate':
            return MembershipService.reinstate_membership(membership)

        raise ValueError('Invalid action.')

    @staticmethod
    def revoke_membership(membership: MembershipModel):
        """Revoke membership."""
        if membership.status == MembershipStatus.REVOKED.value:
            raise ValueError('Membership already revoked.')

        new_membership_details = {
            'status': MembershipStatus.REVOKED.value,
            'type': membership.type,
            'revoked_date': datetime.utcnow(),
        }
        new_membership = MembershipModel.create_new_version(
            membership.engagement_id,
            membership.user_id,
            new_membership_details
        )

        return new_membership

    @staticmethod
    def reinstate_membership(membership: MembershipModel):
        """Reinstate membership."""
        if membership.status == MembershipStatus.ACTIVE.value:
            raise ValueError('Membership already active.')

        new_membership_details = {
            'engagement_id': membership.engagement_id,
            'user_id': membership.user_id,
            'status': MembershipStatus.ACTIVE.value,
            'type': membership.type,
        }
        new_membership = MembershipModel.create_new_version(
            membership.engagement_id,
            membership.user_id,
            new_membership_details
        )
        return new_membership

    @staticmethod
    def revoke_memberships_bulk(user_id: int):
        """Revoke memberships in bulk."""
        revoked_memberships = MembershipModel.revoke_memberships_bulk(user_id)
        return revoked_memberships

    @staticmethod
    def deactivate_memberships_bulk(user_id: int):
        """Revoke memberships in bulk."""
        revoked_memberships = MembershipModel.deactivate_memberships_bulk(user_id)
        return revoked_memberships
