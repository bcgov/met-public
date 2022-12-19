"""Service for user management."""
from typing import List

from met_api.models.pagination_options import PaginationOptions
from met_api.models.user import User as UserModel
from met_api.services.keycloak import KeycloakService
from met_api.schemas.user import UserSchema
from met_api.utils.constants import GROUP_NAME_MAPPING
from met_api.utils.enums import UserType

KEYCLOAK_SERVICE = KeycloakService()


class UserService:
    """User management service."""

    @staticmethod
    def get_user_by_external_id(_external_id):
        """Get user by external id."""
        user_schema = UserSchema()
        db_user = UserModel.get_user_by_external_id(_external_id)
        return user_schema.dump(db_user)

    def create_or_update_user(self, user: UserSchema):
        """Create or update a user."""
        self.validate_fields(user)

        external_id = user.get('external_id')
        db_user = UserModel.get_user_by_external_id(external_id)
        if db_user is None:
            is_staff_user = user.get('username', '').endswith('@idir')
            access_type = UserType.STAFF.value if is_staff_user else UserType.PUBLIC_USER.value
            user['access_type'] = access_type
            return UserModel.create_user(user)
        return UserModel.update_user(db_user.id, user)

    @staticmethod
    def find_users(user_type=UserType.STAFF.value, pagination_options: PaginationOptions = None):
        """Return a list of users."""
        users, total = UserModel.find_users_by_access_type(user_type, pagination_options)
        user: UserModel
        user_schema = UserSchema()
        user_collection = []
        user_ids = [user.external_id for user in users]
        group_user_details: List = KEYCLOAK_SERVICE.get_users_groups(user_ids)
        for user in users:
            user_detail = user_schema.dump(user)
            # Transform group name from EAO_ADMINISTRATOR to Administrator
            # TODO etc;Arrive at a better implementation than keeping a static list
            # TODO Probably add a custom attribute in the keycloak as title against a group?
            groups = group_user_details.get(user.external_id)
            user_detail['groups'] = ''
            if groups:
                user_detail['groups'] = [GROUP_NAME_MAPPING.get(group, '') for group in groups]
            user_collection.append(user_detail)

        return {
            'items': user_collection,
            'total': total
        }

    @staticmethod
    def get_or_create_user(email_address):
        """Get or create a user matching the email address."""
        db_user = UserModel.get_user_by_external_id(email_address)
        if db_user is not None:
            return db_user

        new_user = {
            'first_name': '',
            'middle_name': '',
            'last_name': '',
            'email_id': email_address,
            'contact_number': '',
            'external_id': email_address,
        }
        user = UserModel.create_user(new_user)
        if not user:
            raise ValueError('Error creating user')

        db_user = UserModel.get_user_by_external_id(email_address)
        return db_user

    @staticmethod
    def validate_fields(data: UserSchema):
        """Validate all fields."""
        empty_fields = [not data.get(field, None) for field in [
            'first_name',
            'last_name',
            'email_id',
            'external_id',
        ]]

        if any(empty_fields):
            raise ValueError('Some required fields are empty')
