"""Service for engagement management."""
from datetime import datetime
from http import HTTPStatus

from flask import current_app

from met_api.constants.engagement_status import Status
from met_api.constants.membership_type import MembershipType
from met_api.exceptions.business_exception import BusinessException
from met_api.models.engagement import Engagement as EngagementModel
from met_api.models.engagement_scope_options import EngagementScopeOptions
from met_api.models.engagement_slug import EngagementSlug as EngagementSlugModel
from met_api.models.engagement_status_block import EngagementStatusBlock as EngagementStatusBlockModel
from met_api.models.pagination_options import PaginationOptions
from met_api.models.submission import Submission as SubmissionModel
from met_api.schemas.engagement import EngagementSchema
from met_api.services import authorization
from met_api.services.engagement_settings_service import EngagementSettingsService
from met_api.services.engagement_slug_service import EngagementSlugService
from met_api.services.object_storage_service import ObjectStorageService

from met_api.services.project_service import ProjectService
from met_api.utils import email_util, notification
from met_api.utils.enums import SourceAction, SourceType
from met_api.utils.roles import Role
from met_api.utils.template import Template
from met_api.utils.token_info import TokenInfo
from met_api.models import Tenant as TenantModel


class EngagementService:
    """Engagement management service."""

    otherdateformat = '%Y-%m-%d'

    def __init__(self):
        """Initialize."""
        self.object_storage = ObjectStorageService()

    def get_engagement(self, engagement_id) -> EngagementSchema:
        """Get Engagement by the id."""
        engagement_model: EngagementModel = EngagementModel.find_by_id(engagement_id)

        if engagement_model:
            if TokenInfo.get_id() is None \
                    and engagement_model.status_id not in (Status.Published.value, Status.Closed.value):
                # Non authenticated users only have access to published and closed engagements
                return None
            if engagement_model.status_id in (Status.Draft.value, Status.Scheduled.value):
                one_of_roles = (
                    MembershipType.TEAM_MEMBER.name,
                    MembershipType.REVIEWER.name,
                    Role.VIEW_ALL_ENGAGEMENTS.value
                )
                authorization.check_auth(one_of_roles=one_of_roles, engagement_id=engagement_id)

            engagement = EngagementSchema().dump(engagement_model)
            engagement['banner_url'] = self.object_storage.get_url(engagement['banner_filename'])
        return engagement

    def get_engagements_paginated(
            self,
            external_user_id,
            pagination_options: PaginationOptions,
            search_options=None,
            include_banner_url=False,
    ):
        """Get engagements paginated."""
        user_roles = TokenInfo.get_user_roles()
        has_team_access = search_options.get('has_team_access')
        scope_options = self._get_scope_options(user_roles, has_team_access)

        items, total = EngagementModel.get_engagements_paginated(
            external_user_id,
            pagination_options,
            scope_options,
            search_options,
        )
        engagements_schema = EngagementSchema(many=True)
        engagements = engagements_schema.dump(items)

        if include_banner_url:
            engagements = self._attach_banner_url(engagements)
        return {
            'items': engagements,
            'total': total
        }

    def _attach_banner_url(self, engagements: list):
        for engagement in engagements:
            engagement['banner_url'] = self.object_storage.get_url(engagement['banner_filename'])
        return engagements

    @staticmethod
    def _get_scope_options(user_roles, has_team_access):
        if Role.VIEW_PRIVATE_ENGAGEMENTS.value in user_roles:
            # If user has VIEW_PRIVATE_ENGAGEMENTS, e.g. Superuser role, return unrestricted scope options
            return EngagementScopeOptions(restricted=False)
        if has_team_access:
            # return those engagements where user has access for edit members..
            # either they have edit_member role or check if they are a team member
            has_edit_role = Role.EDIT_MEMBERS.value in user_roles
            if has_edit_role:
                return EngagementScopeOptions(restricted=False)

            # check if user
            return EngagementScopeOptions(
                include_assigned=True
            )
        if Role.VIEW_ENGAGEMENT.value in user_roles:
            # If user has VIEW_ENGAGEMENT role, e.g. TEAM MEMBER, return scope options to include assigned
            # engagements and public engagements
            return EngagementScopeOptions(
                engagement_status_ids=[Status.Published.value, Status.Closed.value],
                include_assigned=True
            )
        if Role.VIEW_ASSIGNED_ENGAGEMENTS.value in user_roles:
            # If user has VIEW_ASSIGNED_ENGAGEMENTS role, e.g. REVIEWER, return scope options to include only
            # assigned engagements
            return EngagementScopeOptions(
                include_assigned=True
            )

        # Default scope options for users without specific roles e.g. public users
        return EngagementScopeOptions(
            engagement_status_ids=[Status.Published.value, Status.Closed.value]
        )

    @staticmethod
    def close_engagements_due():
        """Close published engagements that are due for a closeout."""
        engagements = EngagementModel.close_engagements_due()
        results = [EngagementService._send_closeout_emails(engagement) for engagement in engagements]
        return results

    @staticmethod
    def publish_scheduled_engagements():
        """Publish scheduled engagement due."""
        engagements = EngagementModel.publish_scheduled_engagements_due()

        if not engagements:
            print('There are no engagements scheduled for publication')
            return None

        print('Engagements published: ', engagements)
        for engagement in engagements:
            email_util.publish_to_email_queue(SourceType.ENGAGEMENT.value, engagement.id,
                                              SourceAction.PUBLISHED.value, True)
            print('Engagements published added to email queue: ', engagement.id)
        return engagements

    @staticmethod
    def create_engagement(request_json: dict):
        """Create engagement."""
        # TODO add schema and remove this validation
        EngagementService.validate_fields(request_json)
        eng_model = EngagementService._create_engagement_model(request_json)

        if request_json.get('status_block'):
            EngagementService._create_eng_status_block(eng_model.id, request_json)
        eng_model.commit()
        email_util.publish_to_email_queue(SourceType.ENGAGEMENT.value, eng_model.id, SourceAction.CREATED.value, True)
        EngagementSlugService.create_engagement_slug(eng_model.id)
        EngagementSettingsService.create_default_settings(eng_model.id)
        return eng_model.find_by_id(eng_model.id)

    @staticmethod
    def _create_engagement_model(engagement_data: dict) -> EngagementModel:
        """Save engagement."""
        new_engagement = EngagementModel(
            name=engagement_data.get('name', None),
            description=engagement_data.get('description', None),
            rich_description=engagement_data.get('rich_description', None),
            start_date=engagement_data.get('start_date', None),
            end_date=engagement_data.get('end_date', None),
            status_id=Status.Draft.value,
            created_by=engagement_data.get('created_by', None),
            created_date=datetime.utcnow(),
            updated_by=engagement_data.get('updated_by', None),
            updated_date=None,
            published_date=None,
            scheduled_date=None,
            banner_filename=engagement_data.get('banner_filename', None),
            content=engagement_data.get('content', None),
            rich_content=engagement_data.get('rich_content', None),
            is_internal=engagement_data.get('is_internal', False),
            consent_message=engagement_data.get('consent_message', None)
        )
        new_engagement.save()
        return new_engagement

    @staticmethod
    def _create_eng_status_block(eng_id, engagement_data: dict):
        """Save engagement."""
        status_blocks = []
        for status in engagement_data.get('status_block'):
            new_status_block: EngagementStatusBlockModel = EngagementStatusBlockModel(
                engagement_id=eng_id,
                survey_status=status.get('survey_status'),
                block_text=status.get('block_text')
            )
            status_blocks.append(new_status_block)

        new_status_block.save_status_blocks(status_blocks)

    @staticmethod
    def _save_or_update_eng_block(engagement_id, status_block):
        for survey_block in status_block:
            # see if there is one existing for the status ;if not create one
            survey_status = survey_block.get('survey_status')
            survey_block = survey_block.get('block_text')
            status_block: EngagementStatusBlockModel = EngagementStatusBlockModel. \
                get_by_status(engagement_id, survey_status)
            if status_block:
                status_block.block_text = survey_block
                status_block.commit()
            else:
                new_status_block: EngagementStatusBlockModel = EngagementStatusBlockModel(
                    engagement_id=engagement_id,
                    survey_status=survey_status,
                    block_text=survey_block
                )

                new_status_block.save()

    @staticmethod
    def _validate_engagement_edit_data(engagement_id: int, data: dict):
        engagement = EngagementModel.find_by_id(engagement_id)
        draft_status_restricted_changes = (EngagementModel.is_internal.key,)
        engagement_has_been_opened = engagement.status_id != Status.Draft.value
        if engagement_has_been_opened and any(field in data for field in draft_status_restricted_changes):
            raise ValueError('Some fields cannot be updated after the engagement has been published')

    @staticmethod
    def edit_engagement(data: dict):
        """Update engagement partially."""
        survey_block = data.pop('status_block', None)
        engagement_id = data.get('id', None)
        authorization.check_auth(
            one_of_roles=(
                MembershipType.TEAM_MEMBER.name,
                Role.EDIT_ENGAGEMENT.value
            ),
            engagement_id=engagement_id
        )

        EngagementService._validate_engagement_edit_data(engagement_id, data)
        if data:
            updated_engagement = EngagementModel.edit_engagement(data)
            if not updated_engagement:
                raise ValueError('Engagement to update was not found')

            has_epic_fields_getting_updated = 'end_date' in data or 'start_date' in data
            if has_epic_fields_getting_updated:
                ProjectService.update_project_info(updated_engagement.id)

        if survey_block:
            EngagementService._save_or_update_eng_block(engagement_id, survey_block)
        return EngagementModel.find_by_id(engagement_id)

    @staticmethod
    def validate_fields(data):
        """Validate all fields."""
        empty_fields = [not data[field] for field in ['name', 'start_date', 'end_date']]

        if data['start_date'] > data['end_date']:
            raise ValueError('Start date cannot be after End date')

        if any(empty_fields):
            raise ValueError('Some required fields are empty')

    @staticmethod
    def _send_closeout_emails(engagement: EngagementModel) -> None:
        """Send the engagement closeout emails.Throws error if fails."""
        subject, body, args = EngagementService._render_email_template(engagement)
        participants = SubmissionModel.get_engaged_participants(engagement.id)
        template_id = current_app.config['EMAIL_TEMPLATES']['CLOSEOUT']['ID']
        emails = [participant.decode_email(participant.email_address) for participant in participants]
        # Removes duplicated records
        emails = list(set(emails))
        try:
            [notification.send_email(subject=subject, email=email_address, html_body=body,
                                     args=args, template_id=template_id) for email_address in emails]
        except Exception as exc:  # noqa: B902
            current_app.logger.error('<Notification for engagement closeout failed', exc)
            raise BusinessException(
                error='Error sending engagement closeout.',
                status_code=HTTPStatus.INTERNAL_SERVER_ERROR) from exc

    @staticmethod
    def _render_email_template(engagement: EngagementModel):
        template = Template.get_template('email_engagement_closeout.html')
        dashboard_path = EngagementService._get_dashboard_path(engagement)
        engagement_url = notification.get_tenant_site_url(engagement.tenant_id, dashboard_path)
        templates = current_app.config['EMAIL_TEMPLATES']
        subject = templates['CLOSEOUT']['SUBJECT'].format(engagement_name=engagement.name)
        email_environment = templates['ENVIROMENT']
        tenant_name = EngagementService._get_tenant_name(
            engagement.tenant_id)
        args = {
            'engagement_name': engagement.name,
            'engagement_url': engagement_url,
            'tenant_name': tenant_name,
            'email_environment': email_environment,
        }
        body = template.render(
            engagement_name=args.get('engagement_name'),
            engagement_url=args.get('engagement_url'),
            tenant_name=args.get('tenant_name'),
            email_environment=args.get('email_environment'),
        )
        return subject, body, args

    @staticmethod
    def _get_tenant_name(tenant_id):
        tenant = TenantModel.find_by_id(tenant_id)
        return tenant.name

    @staticmethod
    def _get_dashboard_path(engagement: EngagementModel):
        engagement_slug = EngagementSlugModel.find_by_engagement_id(engagement.id)
        paths = current_app.config['PATH_CONFIG']
        if engagement_slug:
            return paths['ENGAGEMENT']['DASHBOARD_SLUG'].format(slug=engagement_slug.slug)
        return paths['ENGAGEMENT']['DASHBOARD'].format(engagement_id=engagement.id)
