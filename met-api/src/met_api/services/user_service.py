
"""Service for user management."""
from met_api.models.user import User
from met_api.schemas.user import UserSchema


class UserService:
    """User management service."""

    otherdateformat = '%Y-%m-%d'

    def get_user(self, _id):
        """Get user by id."""
        db_user = User.get_user(_id)
        user_object = self.__create_user_object(db_user)
        return user_object

    def get_user_by_external_id(self, _external_id):
        """Get user by external id."""
        db_user = User.get_user_by_external_id(_external_id)
        user_object = self.__create_user_object(db_user)
        return user_object

    @staticmethod
    def __create_user_object(db_user: User):
        """Create user object from a db object."""
        user = {
            'id': db_user.id,
            'first_name': db_user.first_name,
            'middle_name': db_user.middle_name,
            'last_name': db_user.last_name,
            'email_id': db_user.email_id,
            'contact_number': db_user.contact_number,
            'external_id': db_user.external_id,
        }
        return user

    def create_or_update_user(self, data: UserSchema):
        """Create or update a user."""
        self.validated_fields(data)

        db_user = User.get_user_by_external_id(data.get('external_id'))
        if (db_user == None):
            return User.create_user(data)
        else:
            return User.update_user(db_user.id, data)

    @staticmethod
    def validated_fields(data: UserSchema):
        """Validate all fields."""
        empty_fields = [not data[field] for field in [
            'first_name', 
            'last_name', 
            'email_id',
            'external_id', 
        ]]

        if any(empty_fields):
            raise ValueError('Some required fields are empty')
