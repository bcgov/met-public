from datetime import timedelta

from flask import current_app
from sqlalchemy import and_, func
from typing import List
from met_api.constants.engagement_status import Status
from met_api.models.engagement import Engagement as EngagementModel
from met_api.utils.datetime import local_datetime
from met_api.utils.template import Template
from met_api.models.db import db
from met_cron.services.mail_service import EmailService


class ClosingSoonEmailService:  # pylint: disable=too-few-public-methods
    """Mail for newly published engagements"""

    @staticmethod
    def do_mail():
        """Send mail by listening to the email_queue.

            1. Get N number of unprocessed recoreds from the email_queue table
            2. Process each mail and send it to subscribed users

        """
        offset_days: int = int(current_app.config.get('OFFSET_DAYS'))
        engagements_closing_soon = ClosingSoonEmailService.get_engagements_closing_soon(offset_days)
        templates = current_app.config['EMAIL_TEMPLATES']
        template_id = templates['CLOSING_SOON']['ID']
        subject = templates['CLOSING_SOON']['SUBJECT']
        template = Template.get_template('engagement_closing_soon.html')
        for engagement in engagements_closing_soon:
            # Process each mails.First set status as PROCESSING

            EmailService._send_email_notification_for_subscription(engagement.id, template_id,
                                                                       subject, template)

    @staticmethod
    def get_engagements_closing_soon(offset_days: int) -> List[EngagementModel]:
        """Get engagements that are closing within two days."""
        now = local_datetime()
        days_from_now = now + timedelta(days=offset_days)
        engagements = db.session.query(EngagementModel) \
            .filter(
                and_(
                    EngagementModel.status_id == Status.Published.value,
                    func.date(EngagementModel.end_date) == func.date(days_from_now)
                )) \
            .all()
        return engagements
