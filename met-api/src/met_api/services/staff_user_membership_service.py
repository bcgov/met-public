"""Service for membership."""
from http import HTTPStatus

from met_api.exceptions.business_exception import BusinessException
from met_api.schemas.staff_user import StaffUserSchema
from met_api.services.membership_service import MembershipService
from met_api.services.staff_user_service import StaffUserService
from met_api.utils.constants import Groups


class StaffUserMembershipService:
    """Staff User Membership management service."""

    @classmethod
    def reassign_user(cls, user_id, group_name):
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

        StaffUserService.remove_user_from_group(external_id, Groups.get_name_by_value(main_group))
        StaffUserService.add_user_to_group(external_id, group_name)
        MembershipService.revoke_memberships_bulk(user_id)
        new_user = StaffUserService.get_user_by_id(user_id, include_groups=True)
        return StaffUserSchema().dump(new_user)
