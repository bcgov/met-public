"""Service for membership."""
from http import HTTPStatus

from met_api.constants.membership_type import MembershipType
from met_api.models import StaffUser as StaffUserModel
from met_api.schemas.staff_user import StaffUserSchema
from met_api.models.engagement import Engagement as EngagementModel
from met_api.models.membership import Membership as MembershipModel
from met_api.services.staff_user_service import KEYCLOAK_SERVICE, StaffUserService
from met_api.utils.enums import KeycloakGroups, MembershipStatus
from met_api.utils.constants import Groups
from ..exceptions.business_exception import BusinessException


class MembershipService:
    """Membership management service."""

    @staticmethod
    def create_membership(engagement_id, request_json: dict):
        """Create membership."""
        user_id = request_json.get('user_id')
        user_db: StaffUserModel = StaffUserModel.get_user_by_external_id(user_id)
        if not user_db:
            raise BusinessException(
                error='Invalid User.',
                status_code=HTTPStatus.BAD_REQUEST)

        user = StaffUserSchema().dump(user_db)
        # attach and map groups
        StaffUserService.attach_groups([user])
        # this makes sure duplicate membership doesnt happen.
        # Can remove when user can have multiple roles with in same engagement.
        MembershipService._validate_member(engagement_id, user)
        group_name, membership_type = MembershipService._get_membership_details(user)
        MembershipService._add_user_group(user, group_name)
        membership = MembershipService._create_membership_model(engagement_id, user, membership_type)
        membership.commit()
        return membership

    @staticmethod
    def _get_membership_details(user: StaffUserModel):
        group_name = Groups.EAO_TEAM_MEMBER.name
        membership_type = MembershipType.TEAM_MEMBER

        if Groups.EAO_REVIEWER.value in user.get('groups'):
            group_name = Groups.EAO_REVIEWER.name
            membership_type = MembershipType.REVIEWER
        return group_name, membership_type

    @staticmethod
    def _add_user_group(user: StaffUserModel, group_name: str):
        valid_member_teams = [Groups.EAO_TEAM_MEMBER.name, Groups.EAO_REVIEWER.name]
        if group_name not in valid_member_teams:
            raise BusinessException(
                error='Invalid Group name.',
                status_code=HTTPStatus.BAD_REQUEST)

        KEYCLOAK_SERVICE.add_user_to_group(
            user_id=user.get('external_id'),
            group_name=group_name
        )

    @staticmethod
    def _validate_member(engagement_id, user):
        groups = user.get('groups')
        if KeycloakGroups.EAO_IT_ADMIN.value in groups:
            raise BusinessException(
                error='This user is already a Superuser.',
                status_code=HTTPStatus.CONFLICT.value)

        existing_membership = MembershipModel.find_by_engagement_and_user_id(engagement_id, user.get('id'))
        if existing_membership:
            raise BusinessException(
                error=f'This {user.get("main_group", "user")} is already assigned to this engagement.',
                status_code=HTTPStatus.CONFLICT.value)

    @staticmethod
    def _create_membership_model(engagement_id, user, membership_type):
        if membership_type not in MembershipType.__members__.values():
            raise BusinessException(
                error='Invalid Membership type.',
                status_code=HTTPStatus.BAD_REQUEST
            )

        membership: MembershipModel = MembershipModel(
            engagement_id=engagement_id,
            user_id=user.get('id'),
            status=MembershipStatus.ACTIVE.value,
            type=membership_type
        )
        membership.add_to_session()

        return membership

    @staticmethod
    def get_memberships(engagement_id):
        """Get memberships by engagement id."""
        # get user to be added from request json

        memberships = MembershipModel.find_by_engagement(engagement_id)
        return memberships

    @staticmethod
    def get_assigned_engagements(user_id):
        """Get memberships by user id."""
        return MembershipModel.find_by_user_id(user_id)

    @staticmethod
    def get_engagements_by_user(user_id):
        """Get engagements by user id."""
        return EngagementModel.get_assigned_engagements(user_id)
