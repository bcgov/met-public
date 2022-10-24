"""Service for engagement management."""
from http import HTTPStatus
from typing import List

from flask import current_app

from met_api.constants.engagement_status import Status
from met_api.exceptions.business_exception import BusinessException
from met_api.models.pagination_options import PaginationOptions
from met_api.models.engagement import Engagement as EngagementModel
from met_api.models.submission import Submission
from met_api.models import User as UserModel
from met_api.schemas.engagement import EngagementSchema
from met_api.services.object_storage_service import ObjectStorageService
from met_api.utils.notification import send_email
from met_api.utils.template import Template


class EngagementService:
    """Engagement management service."""

    otherdateformat = '%Y-%m-%d'

    @staticmethod
    def get_engagement(engagement_id, user_id) -> EngagementSchema:
        """Get Engagement by the id."""
        engagement_model: EngagementModel = EngagementModel.get_engagement(engagement_id)

        if engagement_model:
            if user_id is None and engagement_model.status_id == Status.Draft.value:
                # Non authenticated users only have access to published engagements
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

    @staticmethod
    def get_engagements_paginated(user_id, pagination_options: PaginationOptions, search_text=''):
        """Get engagements paginated."""
        items, total = EngagementModel.get_engagements_paginated(
            pagination_options,
            search_text,
            statuses=None if user_id else [Status.Published.value],
        )
        engagements_schema = EngagementSchema(many=True)
        engagements = engagements_schema.dump(items)

        return {
            'items': engagements,
            'total': total
        }

    @staticmethod
    def close_engagements_due():
        """Close published engagements that are due for a closeout."""
        engagements = EngagementModel.close_engagements_due()
        print('Engagements to close: ', engagements)
        results = [EngagementService._send_closeout_emails(engagement) for engagement in engagements]
        return results

    @staticmethod
    def publish_scheduled_engagements():
        """Publish scheduled engagement due."""
        engagements = EngagementModel.publish_scheduled_engagements_due()
        print('Engagements published: ', engagements)
        return engagements

    def create_engagement(self, data: EngagementSchema):
        """Create engagement."""
        self.validate_fields(data)
        return EngagementModel.create_engagement(data)

    def update_engagement(self, data: EngagementSchema):
        """Update engagement."""
        self.validate_fields(data)
        return EngagementModel.update_engagement(data)

    @staticmethod
    def edit_engagement(data: dict):
        """Update engagement partially."""
        updated_engagement = EngagementModel.edit_engagement(data)
        if not updated_engagement:
            raise ValueError('Engagement to update was not found')
        return EngagementModel.edit_engagement(data)

    @staticmethod
    def validate_fields(data):
        """Validate all fields."""
        empty_fields = [not data[field] for field in ['name', 'description', 'rich_description',
                                                      'start_date', 'end_date']]

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
