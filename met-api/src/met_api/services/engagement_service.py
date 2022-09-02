
"""Service for engagement management."""
from http import HTTPStatus
from flask import current_app

from met_api.constants.engagement_status import Status
from met_api.exceptions.business_exception import BusinessException
from met_api.models.engagement import Engagement
from met_api.models.submission import Submission
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
        engagement = Engagement.get_engagement(engagement_id)

        if engagement:
            engagement['banner_url'] = ObjectStorageService.get_url(engagement.get('banner_filename', None))
            if user_id is None and engagement.get('status_id', None) == Status.Draft.value:
                # Non authenticated users only have access to published engagements
                return None

        return engagement

    @staticmethod
    def get_all_engagements(user_id):
        """Get all engagements."""
        if user_id:
            # authenticated users have access to any engagement status
            engagements = Engagement.get_all_engagements()
        else:
            engagements = Engagement.get_engagements_by_status([Status.Published.value, Status.Closed.value])

        return engagements

    @staticmethod
    def close_engagements_due():
        """Close published engagements that are due for a closeout."""
        engagements = Engagement.close_engagements_due()
        print('Engagements to close: ', engagements)
        results = [EngagementService._send_closeout_emails(engagement) for engagement in engagements]
        return results

    def create_engagement(self, data: EngagementSchema):
        """Create engagement."""
        self.validate_fields(data)
        return Engagement.create_engagement(data)

    def update_engagement(self, data: EngagementSchema):
        """Update all engagement."""
        self.validate_fields(data)
        return Engagement.update_engagement(data)

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
        users = Submission.get_engaged_users(engagement_id)
        template_id = current_app.config.get('ENGAGEMENT_CLOSEOUT_EMAIL_TEMPLATE_ID', None)
        emails = [user.get('email_id') for user in users]
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
