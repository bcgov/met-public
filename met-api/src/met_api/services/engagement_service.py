"""Service for engagement management."""
from datetime import datetime
from http import HTTPStatus
from typing import List

from flask import current_app

from met_api.constants.engagement_status import Status
from met_api.exceptions.business_exception import BusinessException
from met_api.models import User as UserModel
from met_api.models.engagement import Engagement as EngagementModel
from met_api.models.engagement_status_block import EngagementStatusBlock as EngagementStatusBlockModel
from met_api.models.pagination_options import PaginationOptions
from met_api.models.submission import Submission
from met_api.schemas.engagement import EngagementSchema
from met_api.services.object_storage_service import ObjectStorageService
from met_api.services.membership_service import MembershipService
from met_api.utils.notification import send_email
from met_api.utils.template import Template
from met_api.utils.roles import Role


class EngagementService:
    """Engagement management service."""

    otherdateformat = '%Y-%m-%d'

    @staticmethod
    def get_engagement(engagement_id, user_id) -> EngagementSchema:
        """Get Engagement by the id."""
        engagement_model: EngagementModel = EngagementModel.find_by_id(engagement_id)

        if engagement_model:
            if user_id is None \
                    and engagement_model.status_id not in (Status.Published.value, Status.Closed.value):
                # Non authenticated users only have access to published and closed engagements
                return None
            engagement = EngagementSchema().dump(engagement_model)
            engagement['banner_url'] = ObjectStorageService.get_url(engagement_model.banner_filename)
        return engagement

    @staticmethod
    def get_all_engagements(user_id):
        """Get all engagements."""
        if user_id:
            # authenticated users have access to any engagement status
            engagements = EngagementModel.get_all_engagements()
        else:
            engagements = EngagementModel.get_engagements_by_status([Status.Published.value, Status.Closed.value])

        return engagements

    @classmethod
    def get_engagements_paginated(cls, user_id, user_roles, pagination_options: PaginationOptions, search_options=None):
        """Get engagements paginated."""
        items, total = EngagementModel.get_engagements_paginated(
            pagination_options,
            search_options,
            statuses=cls._get_statuses_filter(user_roles),
            assigned_engagements=cls._get_assigned_engagements(user_id, user_roles)
        )
        engagements_schema = EngagementSchema(many=True)
        engagements = engagements_schema.dump(items)

        return {
            'items': engagements,
            'total': total
        }

    @staticmethod
    def _get_statuses_filter(user_roles):
        """Return the statuses of the engagement which user has access to."""
        public_statuses = [Status.Published.value, Status.Closed.value]
        if Role.VIEW_PRIVATE_ENGAGEMENTS.value in user_roles:
            return None
        return public_statuses

    @staticmethod
    def _get_assigned_engagements(user_id, user_roles):
        if Role.VIEW_PRIVATE_ENGAGEMENTS.value in user_roles:
            return None

        return MembershipService.get_assigned_engagements(user_id)

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
        print('Engagements published: ', engagements)
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
            rich_content=engagement_data.get('rich_content', None)
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

    def update_engagement(self, request_json: dict):
        """Update engagement."""
        self.validate_fields(request_json)
        engagement_id = request_json.get('id', None)
        engagement = EngagementModel.update_engagement(request_json)
        if (status_block := request_json.get('status_block')) is not None:
            EngagementService._save_or_update_eng_block(engagement_id, status_block)

        return engagement

    @staticmethod
    def _save_or_update_eng_block(engagement_id, status_block):
        for survey_block in status_block:
            # see if there is one existing for the status ;if not create one
            survey_status = survey_block.get('survey_status')
            survey_block = survey_block.get('block_text')
            status_block: EngagementStatusBlockModel = EngagementStatusBlockModel.\
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
    def edit_engagement(data: dict):
        """Update engagement partially."""
        survey_block = data.pop('status_block', None)
        engagement_id = data.get('id', None)
        if data:
            updated_engagement = EngagementModel.edit_engagement(data)
            if not updated_engagement:
                raise ValueError('Engagement to update was not found')
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
    def _send_closeout_emails(engagement: EngagementSchema) -> None:
        """Send the engagement closeout emails.Throws error if fails."""
        engagement_id = engagement.get('id')
        subject, body, args = EngagementService._render_email_template(engagement)
        users: List[UserModel] = Submission.get_engaged_users(engagement_id)
        template_id = current_app.config.get('ENGAGEMENT_CLOSEOUT_EMAIL_TEMPLATE_ID', None)
        emails = [user.email_id for user in users]
        # Removes duplicated records
        emails = list(set(emails))
        try:
            [send_email(subject=subject, email=email_address, html_body=body,
                        args=args, template_id=template_id) for email_address in emails]
        except Exception as exc:  # noqa: B902
            current_app.logger.error('<Notification for engagement closeout failed', exc)
            raise BusinessException(
                error='Error sending engagement closeout.',
                status_code=HTTPStatus.INTERNAL_SERVER_ERROR) from exc

    @staticmethod
    def _render_email_template(engagement: EngagementSchema):
        template = Template.get_template('email_engagement_closeout.html')
        dashboard_path = current_app.config.get('ENGAGEMENT_DASHBOARD_PATH'). \
            format(engagement_id=engagement.get('id'))
        # url is origin url excluding context path
        site_url = current_app.config.get('SITE_URL')
        engagement_name = engagement.get('name')
        subject = current_app.config.get('ENGAGEMENT_CLOSEOUT_EMAIL_SUBJECT'). \
            format(engagement_name=engagement_name)
        args = {
            'engagement_name': engagement_name,
            'engagement_url': f'{site_url}{dashboard_path}',
        }
        body = template.render(
            engagement_name=args.get('engagement_name'),
            engagement_url=args.get('engagement_url'),
        )
        return subject, body, args
