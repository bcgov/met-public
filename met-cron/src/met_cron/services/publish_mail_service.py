from datetime import datetime

from flask import current_app
from met_api.constants.notification_status import NotificationStatus
from met_api.models.email_queue import EmailQueue as EmailQueueModel
from met_api.utils.template import Template
from met_cron.services.mail_service import EmailService


class PublishEmailService:  # pylint: disable=too-few-public-methods
    """Mail for newly published engagements"""

    @staticmethod
    def do_mail():
        """Send mail by listening to the email_queue.

            1. Get N number of unprocessed recoreds from the email_queue table
            2. Process each mail and send it to subscribed users

        """
        email_batch_size: int = int(current_app.config.get('MAIL_BATCH_SIZE'))
        mails = EmailQueueModel.get_unprocessed_mails_for_open_engagements(email_batch_size)
        mail: EmailQueueModel
        templates = current_app.config['EMAIL_TEMPLATES']
        template_id = templates['PUBLISH']['ID']
        subject = templates['PUBLISH']['SUBJECT']
        template = Template.get_template('publish_engagement.html')
        for mail in mails:
            # Process each mails.First set status as PROCESSING
            mail.notification_status = NotificationStatus.PROCESSING.value
            mail.updated_date = datetime.utcnow()
            mail.commit()

            EmailService._send_email_notification_for_subscription(mail.entity_id, template_id,
                                                                    subject, template)
            mail.notification_status = NotificationStatus.SENT.value
            mail.updated_date = datetime.utcnow()
            mail.commit()
