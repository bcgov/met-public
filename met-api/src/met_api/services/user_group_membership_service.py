"""Service for user group membership management."""
from typing import List, Tuple

from met_api.models.user_group_membership import UserGroupMembership
from met_api.models.user_role import UserRole


class UserGroupMembershipService:
    """User group membership management service."""

    @classmethod
    def get_user_roles_within_tenant(cls, external_id, tenant_id) -> Tuple[List[str], int]:
        """Get all roles for a user based on their external ID."""
        user_roles = []

        # Get the group membership for the user
        user_membership = UserGroupMembership.get_group_by_user_id(external_id, tenant_id)

        # Get all role mappings for the groups
        if user_membership:
            # Get all role IDs for the group
            role_ids = [mapping.role_id for mapping in user_membership.groups.role_mappings]

            # Get role names based on role IDs
            roles = UserRole.query.filter(UserRole.id.in_(role_ids)).all()

            # Extract role names from roles
            user_roles = [role.name for role in roles]

            return user_roles, user_membership.tenant_id

        return user_roles, 0

    @classmethod
    def get_user_group_within_tenant(cls, external_id, tenant_id):
        """Get the group to which a user belongs based on their external ID."""
        # Get the group membership for the user
        user_memberships = UserGroupMembership.get_group_by_user_id(external_id, tenant_id)
        return user_memberships.groups.name if user_memberships else None

    @staticmethod
    def assign_composite_role_to_user(membership_data):
        """Create user_group_membership."""
        return UserGroupMembership.create_user_group_membership(membership_data)

    @staticmethod
    def reassign_composite_role_to_user(membership_data):
        """Update user_group_membership."""
        return UserGroupMembership.update_user_group_membership(membership_data)
