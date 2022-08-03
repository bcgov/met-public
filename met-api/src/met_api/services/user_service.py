
"""Service for user management."""
from met_api.models.user import User
from met_api.schemas.user import UserSchema


class UserService:
    """User management service."""

    otherdateformat = '%Y-%m-%d'

    @staticmethod
    def get_user(_id):
        """Get user by id."""
        user = UserSchema()
        db_user = User.get_user(_id)
        return user.dump(db_user)

    @staticmethod
    def get_user_by_external_id(_external_id):
        """Get user by external id."""
        user = UserSchema()
        db_user = User.get_user_by_external_id(_external_id)
        return user.dump(db_user)

    def create_or_update_user(self, user: UserSchema):
        """Create or update a user."""
        self.validate_fields(user)

        external_id = user.get('external_id')
        db_user = User.get_user_by_external_id(external_id)
        if db_user is None:
            return User.create_user(user)
        return User.update_user(db_user.id, user)

    @staticmethod
    def get_or_create_user(email_address):
        """Get or create a user matching the email address."""
        db_user = User.get_user_by_external_id(email_address)
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
        create_user_result = User.create_user(new_user)
        if not create_user_result.success:
            raise ValueError('Error creating user')

        db_user = User.get_user_by_external_id(email_address)
        return db_user

    @staticmethod
    def validate_fields(data: UserSchema):
        """Validate all fields."""
        empty_fields = [not data[field] for field in [
            'first_name',
            'last_name',
            'email_id',
            'external_id',
        ]]

        if any(empty_fields):
            raise ValueError('Some required fields are empty')
