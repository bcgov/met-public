"""Service for membership."""
from http import HTTPStatus

from met_api.constants.membership_type import MembershipType
from met_api.models import User as UserModel
from met_api.models.membership import Membership as MembershipModel
from met_api.services.user_service import KEYCLOAK_SERVICE
from met_api.utils.enums import KeycloakGroups, MembershipStatus
from .authorization import check_auth
from ..exceptions.business_exception import BusinessException


class MembershipService:
    """Membership management service."""

    @staticmethod
    def create_membership(engagement_id, request_json: dict):
        """Create membership."""
        user_id = request_json.get('user_id')
        user: UserModel = UserModel.get_user_by_external_id(user_id)
        if not user:
            raise BusinessException(
                error='Invalid User.',
                status_code=HTTPStatus.BAD_REQUEST)

        # this makes sure duplicate membership doesnt happen.
        # Can remove when user can have multiple roles with in same engagement.
        MembershipService._validate_duplicate_membership(engagement_id, user)

        check_auth(one_of_roles=(MembershipType.TEAM_MEMBER,), engagement_id=engagement_id)
        membership = MembershipService._create_membership_model(engagement_id, user)

        KEYCLOAK_SERVICE.add_user_to_group(user_id=user_id, group_name=KeycloakGroups.EAO_TEAM_MEMBER.name)
        membership.commit()
        return membership

    @staticmethod
    def _validate_duplicate_membership(engagement_id, user):
        existing_membership = MembershipModel.find_by_engagement_and_user_id(engagement_id, user.id)
        if existing_membership:
            raise BusinessException(
                error='Membership Already Exists.',
                status_code=HTTPStatus.CONFLICT.value)

    @staticmethod
    def _create_membership_model(engagement_id, user):
        membership: MembershipModel = MembershipModel(engagement_id=engagement_id,
                                                      user_id=user.id,
                                                      status=MembershipStatus.ACTIVE.value,
                                                      type=MembershipType.TEAM_MEMBER)
        membership.add_to_session()
        return membership

    @staticmethod
    def get_memberships(engagement_id):
        """Create membership."""
        # get user to be added from request json

        memberships = MembershipModel.find_by_engagement(engagement_id)
        check_auth(one_of_roles=(MembershipType.TEAM_MEMBER,), engagement_id=engagement_id)
        return memberships
