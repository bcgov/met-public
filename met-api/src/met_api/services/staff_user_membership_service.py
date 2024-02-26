"""Service for membership."""
from http import HTTPStatus

from met_api.exceptions.business_exception import BusinessException
from met_api.models.staff_user import StaffUser as StaffUserModel
from met_api.schemas.staff_user import StaffUserSchema
from met_api.services.membership_service import MembershipService
from met_api.services.staff_user_service import KEYCLOAK_SERVICE, StaffUserService
from met_api.utils.constants import CompositeRoles
from met_api.utils.enums import UserStatus
from met_api.utils.user_context import UserContext, user_context


class StaffUserMembershipService:
    """Staff User Membership management service."""

    @classmethod
    @user_context
    def reassign_user(cls, user_id, role, **kwargs):
        """Add user to a new composite role and reassign memberships."""
        user = StaffUserService.get_user_by_id(user_id, include_roles=True)
        if not user:
            raise BusinessException(
                error='Invalid User.',
                status_code=HTTPStatus.BAD_REQUEST)

        external_id = user.get('external_id', None)
        main_role = user.get('main_role', None)

        if any([not external_id, not main_role]):
            raise BusinessException(
                error='Invalid User.',
                status_code=HTTPStatus.BAD_REQUEST)

        if role not in CompositeRoles.__members__:
            raise BusinessException(
                error='Invalid Role.',
                status_code=HTTPStatus.BAD_REQUEST)

        if main_role == role:
            raise BusinessException(
                error='User is already assigned this role.',
                status_code=HTTPStatus.BAD_REQUEST)

        user_from_context: UserContext = kwargs['user_context']
        if external_id == user_from_context.sub:
            raise BusinessException(
                error='User cannot change their own permission level.',
                status_code=HTTPStatus.CONFLICT.value)

        StaffUserService.remove_composite_role_from_user(external_id, CompositeRoles.get_name_by_value(main_role))
        StaffUserService.assign_composite_role_to_user(external_id, role)
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
