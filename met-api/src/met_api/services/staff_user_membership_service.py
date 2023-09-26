"""Service for membership."""
from http import HTTPStatus

from met_api.exceptions.business_exception import BusinessException
from met_api.models.staff_user import StaffUser as StaffUserModel
from met_api.schemas.staff_user import StaffUserSchema
from met_api.services.membership_service import MembershipService
from met_api.services.staff_user_service import KEYCLOAK_SERVICE, StaffUserService
from met_api.utils.user_context import UserContext, user_context
from met_api.utils.constants import Groups
from met_api.utils.enums import UserStatus


class StaffUserMembershipService:
    """Staff User Membership management service."""

    @classmethod
    @user_context
    def reassign_user(cls, user_id, group_name, **kwargs):
        """Add user to a new group and reassign memberships."""
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

        if group_name not in Groups.__members__:
            raise BusinessException(
                error='Invalid Group.',
                status_code=HTTPStatus.BAD_REQUEST)

        if main_group == group_name:
            raise BusinessException(
                error='User is already a member of this group.',
                status_code=HTTPStatus.BAD_REQUEST)

        user_from_context: UserContext = kwargs['user_context']
        if external_id == user_from_context.sub:
            raise BusinessException(
                error='User cannot change their own group.',
                status_code=HTTPStatus.CONFLICT.value)

        StaffUserService.remove_user_from_group(external_id, Groups.get_name_by_value(main_group))
        StaffUserService.add_user_to_group(external_id, group_name)
        MembershipService.revoke_memberships_bulk(user_id)
        new_user = StaffUserService.get_user_by_id(user_id, include_groups=True)
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
