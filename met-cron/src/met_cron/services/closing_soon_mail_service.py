from flask import current_app
from met_api.models.engagement import Engagement as EngagementModel
from met_api.utils.template import Template
from met_cron.services.mail_service import EmailService


class ClosingSoonEmailService:  # pylint: disable=too-few-public-methods
    """Mail for newly published engagements"""

    @staticmethod
    def do_mail():
        """Send mail by listening to the email_queue.

            1. Get N number of unprocessed recoreds from the email_queue table
            2. Process each mail and send it to subscribed users

        """
        engagements_closing_soon = EngagementModel.get_engagements_closing_soon()
        template_id = current_app.config.get('ENGAGEMENT_CLOSING_SOON_EMAIL_TEMPLATE_ID', None)
        subject = current_app.config.get('ENGAGEMENT_CLOSING_SOON_EMAIL_SUBJECT')
        template = Template.get_template('engagement_closing_soon.html')
        for engagement in engagements_closing_soon:
            # Process each mails.First set status as PROCESSING

            EmailService._send_email_notification_for_subscription(engagement.id, template_id,
                                                                       subject, template)
