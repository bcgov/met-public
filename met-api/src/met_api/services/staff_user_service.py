"""Service for user management."""
from http import HTTPStatus

from flask import current_app, g

from met_api.exceptions.business_exception import BusinessException
from met_api.models.pagination_options import PaginationOptions
from met_api.models.staff_user import StaffUser as StaffUserModel
from met_api.schemas.staff_user import StaffUserSchema
from met_api.services.keycloak import KeycloakService
from met_api.utils import notification
from met_api.utils.constants import GROUP_NAME_MAPPING, Groups
from met_api.utils.enums import KeycloakGroupName
from met_api.utils.template import Template

KEYCLOAK_SERVICE = KeycloakService()


class StaffUserService:
    """User management service."""

    @classmethod
    def get_user_by_id(cls, _user_id, include_groups=False, include_inactive=False):
        """Get user by id."""
        user_schema = StaffUserSchema()
        db_user = StaffUserModel.get_by_id(_user_id, include_inactive)
        user = user_schema.dump(db_user)
        if include_groups:
            cls.attach_groups([user])
        return user

    @classmethod
    def get_user_by_external_id(cls, _external_id, include_inactive=False):
        """Get user by external id."""
        user_schema = StaffUserSchema()
        db_user = StaffUserModel.get_user_by_external_id(_external_id, include_inactive)
        return user_schema.dump(db_user)

    def create_or_update_user(self, user: dict):
        """Create or update a user."""
        self.validate_fields(user)

        external_id = user.get('external_id')
        db_user = StaffUserModel.get_user_by_external_id(external_id)

        if db_user is None:
            new_user = StaffUserModel.create_user(user)
            if len(user.get('roles', [])) == 0:
                self._send_access_request_email(new_user)
            return new_user

        return StaffUserModel.update_user(db_user.id, user)

    @staticmethod
    def _send_access_request_email(user: StaffUserModel) -> None:
        """Send a new user email.Throws error if fails."""
        templates = current_app.config['EMAIL_TEMPLATES']
        to_email_address = templates['ACCESS_REQUEST']['DEST_EMAIL_ADDRESS']
        if to_email_address is None:
            return
        template_id = templates['ACCESS_REQUEST']['ID']
        subject, body, args = StaffUserService._render_email_template(user)
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
    def _render_email_template(user: StaffUserModel):
        template = Template.get_template('email_access_request.html')
        templates = current_app.config['EMAIL_TEMPLATES']
        paths = current_app.config['PATHS']
        subject = templates['ACCESS_REQUEST']['SUBJECT']
        grant_access_url = notification.get_tenant_site_url(
            user.tenant_id, paths['USER_MANAGEMENT']
        )
        email_environment = templates['ENVIRONMENT']
        args = {
            'first_name': user.first_name,
            'last_name': user.last_name,
            'username': user.username,
            'email_address': user.email_address,
            'grant_access_url': grant_access_url,
            'email_environment': email_environment,
        }
        body = template.render(
            first_name=args.get('first_name'),
            last_name=args.get('last_name'),
            username=args.get('username'),
            email_address=args.get('email_address'),
            grant_access_url=args.get('grant_access_url'),
            email_environment=args.get('email_environment'),
        )
        return subject, body, args

    @staticmethod
    def attach_groups(user_collection):
        """Attach keycloak groups to user object."""
        group_user_details = KEYCLOAK_SERVICE.get_users_groups(
            [user.get('external_id') for user in user_collection])

        for user in user_collection:
            # Transform group name from EAO_ADMINISTRATOR to Administrator
            # TODO etc;Arrive at a better implementation than keeping a static list
            # TODO Probably add a custom attribute in the keycloak as title against a group?
            groups = group_user_details.get(user.get('external_id'))
            user['groups'] = ''
            if groups:
                user['groups'] = [GROUP_NAME_MAPPING.get(group, '') for group in groups]
                if Groups.EAO_IT_ADMIN.value in user['groups']:
                    user['main_group'] = Groups.EAO_IT_ADMIN.value
                elif Groups.EAO_TEAM_MEMBER.value in user['groups']:
                    user['main_group'] = Groups.EAO_TEAM_MEMBER.value
                elif Groups.EAO_REVIEWER.value in user['groups']:
                    user['main_group'] = Groups.EAO_REVIEWER.value
                else:
                    user['main_group'] = user['groups'][0]

    @classmethod
    def find_users(
        cls,
        pagination_options: PaginationOptions = None,
        search_text='',
        include_groups=False,
        include_inactive=False
    ):
        """Return a list of users."""
        users, total = StaffUserModel.get_all_paginated(pagination_options, search_text, include_inactive)
        user_collection = StaffUserSchema(many=True).dump(users)
        if include_groups:
            cls.attach_groups(user_collection)
        return {
            'items': user_collection,
            'total': total
        }

    @staticmethod
    def validate_fields(data: StaffUserSchema):
        """Validate all fields."""
        empty_fields = [not data.get(field, None) for field in [
            'first_name',
            'last_name',
            'email_address',
            'external_id',
        ]]

        if any(empty_fields):
            raise ValueError('Some required fields are empty')

    @classmethod
    def add_user_to_group(cls, external_id: str, group_name: str):
        """Create or update a user."""
        db_user = StaffUserModel.get_user_by_external_id(external_id)

        cls.validate_user(db_user)

        KEYCLOAK_SERVICE.add_user_to_group(user_id=external_id, group_name=group_name)
        KEYCLOAK_SERVICE.add_attribute_to_user(user_id=external_id, attribute_value=g.tenant_id)

        return StaffUserSchema().dump(db_user)

    @classmethod
    def remove_user_from_group(cls, external_id: str, group_name: str):
        """Create or update a user."""
        db_user = StaffUserModel.get_user_by_external_id(external_id)

        if db_user is None:
            raise KeyError('User not found')

        KEYCLOAK_SERVICE.remove_user_from_group(user_id=external_id, group_name=group_name)

        return StaffUserSchema().dump(db_user)

    @staticmethod
    def validate_user(db_user: StaffUserModel):
        """Validate user."""
        if db_user is None:
            raise KeyError('User not found')

        groups = KEYCLOAK_SERVICE.get_user_groups(user_id=db_user.external_id)
        group_names = [group.get('name') for group in groups]
        if KeycloakGroupName.EAO_IT_ADMIN.value in group_names:
            raise BusinessException(
                error='This user is already an Administrator.',
                status_code=HTTPStatus.CONFLICT.value)
