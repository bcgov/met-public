from datetime import datetime
from http import HTTPStatus
from typing import List

from flask import current_app
from met_api.constants.notification_status import NotificationStatus
from met_api.exceptions.business_exception import BusinessException
from met_api.models.email_queue import EmailQueue as EmailQueueModel
from met_api.models.engagement import Engagement as EngagementModel
from met_api.models.participant import Participant as ParticipantModel
from met_api.models.subscription import Subscription as SubscriptionModel
from met_api.utils import notification
from met_api.utils.enums import SourceType, SourceAction
from met_api.utils.template import Template

from met_cron.models.db import db


class EmailService:  # pylint: disable=too-few-public-methods
    """Mail on updates."""

    @staticmethod
    def do_mail():
        """Send mail by listening to the email_queue.

            1. Get N number of unprocessed recoreds from the email_queue table
            2. Process each mail and send it to subscribed users

        """
        email_batch_size: int = int(current_app.config.get('MAIL_BATCH_SIZE'))
        mails = EmailQueueModel.get_unprocessed_mails(email_batch_size)
        mail: EmailQueueModel
        for mail in mails:
            # Process each mails.First set status as PROCESSING
            mail.notification_status = NotificationStatus.PROCESSING.value
            mail.updated_date = datetime.utcnow()
            mail.commit()
            # Commenting it out for now since we are not sending email for engagement creation
            #if mail.entity_type == SourceType.ENGAGEMENT.value and mail.action == SourceAction.CREATED.value:
            #    EmailService._send_mail_for_new_engagement(mail)
            #    mail.notification_status = NotificationStatus.SENT.value
            #    mail.updated_date = datetime.utcnow()
            #    mail.commit()
            if mail.entity_type == SourceType.ENGAGEMENT.value and mail.action == SourceAction.PUBLISHED.value:
                EmailService._send_mail_for_published_engagement(mail)
                mail.notification_status = NotificationStatus.SENT.value
                mail.updated_date = datetime.utcnow()
                mail.commit()

    @staticmethod
    def _send_mail_for_published_engagement(mail):
        eng: EngagementModel = EngagementModel.find_by_id(mail.entity_id)
        template_id = current_app.config.get('PUBLISH_ENGAGEMENT_EMAIL_TEMPLATE_ID', None)
        subject, body, args = EmailService._render_email_template(eng)
        # find emails from the subscription table
        subscription_list: List[SubscriptionModel] = db.session.query(SubscriptionModel).distinct().filter(
            SubscriptionModel.is_subscribed == True).all()
        subscriber: SubscriptionModel
        email_list = []
        for subscriber in subscription_list:
            try:
                Participant = ParticipantModel.find_by_id(subscriber.participant_id)
                if Participant.email_address is not None:
                    email_address = ParticipantModel.decode_email(Participant.email_address)
                    if email_address not in email_list:
                        email_list.append(email_address)
            except Exception as exc:  # noqa: B902
                current_app.logger.error('<Extracting email address for subscribers failed', exc)
                raise BusinessException(
                    error='Error extracting email address for subscribers.',
                    status_code=HTTPStatus.INTERNAL_SERVER_ERROR) from exc

        for email in email_list:
            try:
                notification.send_email(subject=subject,
                                        email=email,
                                        html_body=body,
                                        args=args,
                                        template_id=template_id)                
            except Exception as exc:  # noqa: B902
                current_app.logger.error('<Notification for publish engagement failed', exc)
                raise BusinessException(
                    error='Error sending publish engagement notification email.',
                    status_code=HTTPStatus.INTERNAL_SERVER_ERROR) from exc

    @staticmethod
    def _render_email_template(eng):
        site_url = notification.get_tenant_site_url(eng.tenant_id)
        view_path = current_app.config.get('ENGAGEMENT_VIEW_PATH'). \
            format(engagement_id=eng.id)
        template = Template.get_template('publish_engagement.html')
        subject_template = current_app.config.get('PUBLISH_ENGAGEMENT_EMAIL_SUBJECT')
        args = {
            'engagement_name': eng.name,
            'link': f'{site_url}{view_path}',
        }
        subject = subject_template.format(engagement_name=eng.name)
        body = template.render(
            engagement_name=args.get('engagement_name'),
            link=args.get('link'),
        )
        return subject, body, args

    @classmethod
    def _send_mail_for_new_engagement(cls, mail):
        # TODO unimplemented
        pass
