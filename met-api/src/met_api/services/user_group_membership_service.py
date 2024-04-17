"""Service for user group membership management."""
from typing import List

from met_api.models.group_role_mapping import GroupRoleMapping
from met_api.models.user_group import UserGroup
from met_api.models.user_group_membership import UserGroupMembership
from met_api.models.user_role import UserRole


class UserGroupMembershipService:
    """User group membership management service."""

    @classmethod
    def get_user_roles_within_a_tenant(cls, external_id, tenant_id) -> List[str]:
        """Get all roles for a user based on their external ID."""
        user_roles = []

        # Get the group membership for the user
        user_memberships = UserGroupMembership.get_group_by_user_id(external_id, tenant_id)
        # Get all role mappings for the groups
        if user_memberships:
            group_role_mappings = GroupRoleMapping.query.filter(
                GroupRoleMapping.group_id == user_memberships.group_id).all()
            # Extract role IDs from role mappings
            if group_role_mappings:
                role_ids = [mapping.role_id for mapping in group_role_mappings]

                # Get role names based on role IDs
                roles = UserRole.query.filter(UserRole.id.in_(role_ids)).all()

                # Extract role names from roles
                if roles:
                    user_roles = [role.name for role in roles]

                    return user_roles, user_memberships.tenant_id

        return user_roles, 0

    @classmethod
    def get_user_group_within_a_tenant(cls, external_id, tenant_id):
        """Get the group to which a user belongs based on their external ID."""
        # Get the group membership for the user
        user_memberships = UserGroupMembership.get_group_by_user_id(external_id, tenant_id)

        # Get all role mappings for the groups
        if user_memberships:
            user_group = UserGroup.find_by_id(user_memberships.group_id)

            if user_group:
                return user_group.name

        return None

    @staticmethod
    def assign_composite_role_to_user(membership_data):
        """Create user_group_membership."""
        return UserGroupMembership.create_user_group_membership(membership_data)

    @staticmethod
    def reassign_composite_role_to_user(membership_data):
        """Update user_group_membership."""
        return UserGroupMembership.update_user_group_membership(membership_data)
