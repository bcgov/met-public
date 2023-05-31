"""Service for user management."""
from met_api.models.met_user import MetUser as MetUserModel
from met_api.services.keycloak import KeycloakService


KEYCLOAK_SERVICE = KeycloakService()


class MetUserService:
    """Met User management service."""

    @staticmethod
    def get_or_create_user_by_email(email_address):
        """Get or create a user matching the email address."""
        db_user = MetUserModel.get_user_by_email(email_address)
        if db_user is not None:
            return db_user

        new_user = {
            'email_address': email_address,
        }
        user = MetUserModel.create_user(new_user)
        if not user:
            raise ValueError('Error creating user')
        return user
