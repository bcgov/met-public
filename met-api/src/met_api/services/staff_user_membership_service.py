"""Service for membership."""
from http import HTTPStatus

from met_api.exceptions.business_exception import BusinessException
from met_api.models.staff_user import StaffUser as StaffUserModel
from met_api.schemas.staff_user import StaffUserSchema
from met_api.services.membership_service import MembershipService
from met_api.services.staff_user_service import KEYCLOAK_SERVICE, StaffUserService
from met_api.utils.user_context import UserContext, user_context
from met_api.utils.enums import UserStatus


class StaffUserMembershipService:
    """Staff User Membership management service."""

    # TODO: Restore a way to add users to composite roles.
    @classmethod
    @user_context
    def reassign_user(cls, user_id, **kwargs):
        """Add user to a new composite role and reassign memberships."""
        user = StaffUserService.get_user_by_id(user_id, include_roles=True)
        if not user:
            raise BusinessException(
                error='Invalid User.',
                status_code=HTTPStatus.BAD_REQUEST)

        external_id = user.get('external_id', None)

        # TODO: Put check for composite role membership into this conditional.
        if not external_id:
            raise BusinessException(
                error='Invalid User.',
                status_code=HTTPStatus.BAD_REQUEST)

        user_from_context: UserContext = kwargs['user_context']

        if external_id == user_from_context.sub:
            raise BusinessException(
                error='User cannot change their own permission level.',
                status_code=HTTPStatus.CONFLICT.value)

        MembershipService.revoke_memberships_bulk(user_id)
        new_user = StaffUserService.get_user_by_id(user_id, include_roles=True)
        return StaffUserSchema().dump(new_user)

    @staticmethod
    def reactivate_deactivate_user(user_external_id: str, active: bool):
        """Toggle user active status."""
        user = StaffUserModel.get_user_by_external_id(user_external_id, include_inactive=True)
        if user is None:
            raise KeyError('User not found')

        if not active:
            MembershipService.deactivate_memberships_bulk(user.id)

        KEYCLOAK_SERVICE.toggle_user_enabled_status(user_id=user_external_id, enabled=active)
        user.status_id = UserStatus.ACTIVE.value if active else UserStatus.INACTIVE.value
        user.save()
        return StaffUserSchema().dump(user)
