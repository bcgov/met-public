"""Service for user management."""
from http import HTTPStatus

from flask import current_app

from met_api.exceptions.business_exception import BusinessException
from met_api.models.pagination_options import PaginationOptions
from met_api.models.staff_user import StaffUser as StaffUserModel
from met_api.schemas.staff_user import StaffUserSchema
from met_api.services.keycloak import KeycloakService
from met_api.utils import notification
from met_api.utils.constants import COMPOSITE_ROLE_MAPPING, CompositeRoles
from met_api.utils.enums import KeycloakCompositeRoleNames
from met_api.utils.template import Template

KEYCLOAK_SERVICE = KeycloakService()


class StaffUserService:
    """User management service."""

    @classmethod
    def get_user_by_id(cls, _user_id, include_roles=False, include_inactive=False):
        """Get user by id."""
        user_schema = StaffUserSchema()
        db_user = StaffUserModel.get_by_id(_user_id, include_inactive)
        user = user_schema.dump(db_user)
        if include_roles:
            cls.attach_roles([user])
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
    def attach_roles(user_collection):
        """Attach keycloak composite roles to user object."""
        user_roles = KEYCLOAK_SERVICE.get_users_roles(
            [user.get('external_id') for user in user_collection])
        for user in user_collection:
            composite_roles = user_roles.get(user.get('external_id'))
            user['composite_roles'] = ''
            if composite_roles:
                user['composite_roles'] = [COMPOSITE_ROLE_MAPPING.get(role, '') for role in composite_roles]
                if CompositeRoles.IT_ADMIN.value in user['composite_roles']:
                    user['main_role'] = CompositeRoles.IT_ADMIN.value
                elif CompositeRoles.TEAM_MEMBER.value in user['composite_roles']:
                    user['main_role'] = CompositeRoles.TEAM_MEMBER.value
                elif CompositeRoles.REVIEWER.value in user['composite_roles']:
                    user['main_role'] = CompositeRoles.REVIEWER.value
                else:
                    user['main_role'] = user['composite_roles'][0]

    @classmethod
    def find_users(
        cls,
        pagination_options: PaginationOptions = None,
        search_text='',
        include_roles=False,
        include_inactive=False
    ):
        """Return a list of users."""
        users, total = StaffUserModel.get_all_paginated(pagination_options, search_text, include_inactive)
        user_collection = StaffUserSchema(many=True).dump(users)

        if include_roles:
            cls.attach_roles(user_collection)

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
    def assign_composite_role_to_user(cls, external_id: str, composite_role: str):
        """Create or update a user."""
        db_user = StaffUserModel.get_user_by_external_id(external_id)

        cls.validate_user(db_user)

        KEYCLOAK_SERVICE.assign_composite_role_to_user(user_id=external_id, composite_role=composite_role)

        return StaffUserSchema().dump(db_user)

    @classmethod
    def remove_composite_role_from_user(cls, external_id: str, role: str):
        """Create or update a user."""
        db_user = StaffUserModel.get_user_by_external_id(external_id)

        if db_user is None:
            raise KeyError('User not found')

        KEYCLOAK_SERVICE.remove_composite_role_from_user(user_id=external_id, role=role)

        return StaffUserSchema().dump(db_user)

    @staticmethod
    def validate_user(db_user: StaffUserModel):
        """Validate user."""
        if db_user is None:
            raise KeyError('User not found')

        composite_roles = KEYCLOAK_SERVICE.get_user_roles(user_id=db_user.external_id)

        if 'data' in composite_roles and len(composite_roles['data']) > 0:
            role_names = [role.get('name') for role in composite_roles]
            if KeycloakCompositeRoleNames.IT_ADMIN.value in role_names:
                raise BusinessException(
                    error='This user is already an Administrator.',
                    status_code=HTTPStatus.CONFLICT.value)
