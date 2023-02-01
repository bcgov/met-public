"""Service for user management."""
from http import HTTPStatus
from typing import List

from flask import current_app

from met_api.exceptions.business_exception import BusinessException
from met_api.models.pagination_options import PaginationOptions
from met_api.models.user import User as UserModel
from met_api.schemas.user import UserSchema
from met_api.services.keycloak import KeycloakService
from met_api.utils import notification
from met_api.utils.constants import GROUP_NAME_MAPPING
from met_api.utils.enums import KeycloakGroupName, LoginSource, UserType
from met_api.utils.template import Template


KEYCLOAK_SERVICE = KeycloakService()


class UserService:
    """User management service."""

    @staticmethod
    def get_user_by_external_id(_external_id):
        """Get user by external id."""
        user_schema = UserSchema()
        db_user = UserModel.get_user_by_external_id(_external_id)
        return user_schema.dump(db_user)

    def create_or_update_user(self, user: dict):
        """Create or update a user."""
        self.validate_fields(user)

        external_id = user.get('external_id')
        db_user = UserModel.get_user_by_external_id(external_id)

        if db_user is None:
            is_staff_user = user.get('identity_provider', '').lower() == LoginSource.IDIR.value
            access_type = UserType.STAFF.value if is_staff_user else UserType.PUBLIC_USER.value
            user['access_type'] = access_type
            if len(user.get('roles', [])) == 0:
                self._send_access_request_email(user)
            return UserModel.create_user(user)

        return UserModel.update_user(db_user.id, user)

    @staticmethod
    def _send_access_request_email(user: UserSchema) -> None:
        """Send a new user email.Throws error if fails."""
        to_email_address = current_app.config.get('ACCESS_REQUEST_EMAIL_ADDRESS', None)
        if to_email_address is None:
            return

        template_id = current_app.config.get('ACCESS_REQUEST_EMAIL_TEMPLATE_ID', None)
        subject, body, args = UserService._render_email_template(user)
        try:
            notification.send_email(subject=subject,
                                    email=to_email_address,
                                    html_body=body,
                                    args=args,
                                    template_id=template_id)
        except Exception as exc:  # noqa: B902
            current_app.logger.error('<Notification for new user registration failed', exc)
            raise BusinessException(
                error='Error sending new user registration email.',
                status_code=HTTPStatus.INTERNAL_SERVER_ERROR) from exc

    @staticmethod
    def _render_email_template(user: UserSchema):
        template = Template.get_template('email_access_request.html')
        subject = current_app.config.get('ACCESS_REQUEST_EMAIL_SUBJECT')
        grant_access_url = current_app.config.get('SITE_URL') + \
            current_app.config.get('USER_MANAGEMENT_PATH')
        args = {
            'first_name': user.get('first_name'),
            'last_name': user.get('last_name'),
            'username': user.get('username'),
            'email_address': user.get('email_id'),
            'grant_access_url': grant_access_url
        }
        body = template.render(
            first_name=args.get('first_name'),
            last_name=args.get('last_name'),
            username=args.get('username'),
            email_address=args.get('email_address'),
            grant_access_url=args.get('grant_access_url'),
        )
        return subject, body, args

    @staticmethod
    def attach_groups(user_collection):
        """Attach keycloak groups to user object."""
        group_user_details: List = KEYCLOAK_SERVICE.get_users_groups([user.get('external_id') for user in user_collection])
        for user in user_collection:
            # Transform group name from EAO_ADMINISTRATOR to Administrator
            # TODO etc;Arrive at a better implementation than keeping a static list
            # TODO Probably add a custom attribute in the keycloak as title against a group?
            groups = group_user_details.get(user.get('external_id'))
            user['groups'] = ''
            if groups:
                user['groups'] = [GROUP_NAME_MAPPING.get(group, '') for group in groups]

    @classmethod
    def find_users(cls, user_type=UserType.STAFF.value, pagination_options: PaginationOptions = None, search_text='', include_groups = False):
        """Return a list of users."""
        users, total = UserModel.find_users_by_access_type(user_type, pagination_options, search_text)
        user_collection = UserSchema(many=True).dump(users)
        if include_groups:
            cls.attach_groups(user_collection)
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

    @classmethod
    def add_user_to_group(cls, external_id: str, group_name: str):
        """Create or update a user."""
        db_user = UserModel.get_user_by_external_id(external_id)

        cls.validate_user(db_user)

        KEYCLOAK_SERVICE.add_user_to_group(user_id=external_id, group_name=group_name)

        return UserSchema().dump(db_user)

    @staticmethod
    def validate_user(db_user: UserModel):
        if db_user is None:
            raise KeyError('User not found')

        groups = KEYCLOAK_SERVICE.get_user_groups(user_id=db_user.external_id)
        group_names = [group.get('name') for group in groups]
        if KeycloakGroupName.EAO_IT_ADMIN.value in group_names:
            raise BusinessException(
                error='This user is already an Administrator.',
                status_code=HTTPStatus.CONFLICT.value)
