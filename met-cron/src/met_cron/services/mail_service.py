from datetime import datetime
from http import HTTPStatus
from typing import List

from flask import current_app
from met_api.exceptions.business_exception import BusinessException
from met_api.models import Tenant as TenantModel
from met_api.models.engagement import Engagement as EngagementModel
from met_api.models.engagement_metadata import EngagementMetadataModel
from met_api.models.participant import Participant as ParticipantModel
from met_api.models.subscription import Subscription as SubscriptionModel
from met_api.services.email_verification_service import EmailVerificationService
from met_api.utils import notification
from met_cron.utils.subscription_checker import CheckSubscription

from met_cron.models.db import db


class EmailService:  # pylint: disable=too-few-public-methods
    """Mail on updates."""

    @staticmethod
    def _send_email_notification_for_subscription(engagement_id, template_id, subject, template):
        engagement: EngagementModel = EngagementModel.find_by_id(engagement_id)

        # find emails from the subscription table
        subscription_list: List[SubscriptionModel] = db.session.query(SubscriptionModel).distinct().filter(
            SubscriptionModel.is_subscribed == True).all()
        subscriber: SubscriptionModel
        email_list = []
        for subscriber in subscription_list:
            is_subscribed = CheckSubscription.check_subscription(subscriber, engagement_id)
            if is_subscribed:
                try:
                    participant = ParticipantModel.find_by_id(subscriber.participant_id)
                    if participant.email_address is not None:
                        email_address = ParticipantModel.decode_email(participant.email_address)
                        if email_address not in email_list:
                            email_list.append(email_address)
                            body, args = EmailService._render_email_template(engagement, participant, template)
                            EmailService._send_email_notification(subject,
                                                                  email_address,
                                                                  body,
                                                                  args,
                                                                  template_id)
                except Exception as exc:  # noqa: B902
                    current_app.logger.error('<Extracting email address for subscribers failed', exc)
                    raise BusinessException(
                        error='Error extracting email address for subscribers.',
                        status_code=HTTPStatus.INTERNAL_SERVER_ERROR) from exc

    @staticmethod
    def _render_email_template(engagement, participant, template):
        site_url = notification.get_tenant_site_url(engagement.tenant_id)
        tenant_name = EmailService._get_tenant_name(engagement.tenant_id)
        metadata_model: EngagementMetadataModel = EngagementMetadataModel.find_by_id(engagement.id)
        project_name = metadata_model.project_metadata.get('project_name', None)
        is_having_project = True if project_name else False
        is_not_having_project = True if not project_name else False
        view_path = current_app.config.get('ENGAGEMENT_VIEW_PATH'). \
            format(engagement_id=engagement.id)
        unsubscribe_url = current_app.config.get('UNSUBSCRIBE_PATH'). \
            format(engagement_id=engagement.id, participant_id=participant.id)
        email_environment = current_app.config.get('EMAIL_ENVIRONMENT', '')
        args = {
            'project_name': project_name if project_name else tenant_name,
            'survey_url': f'{site_url}{view_path}',
            'end_date': datetime.strftime(engagement.end_date, EmailVerificationService.full_date_format),
            'tenant_name': tenant_name,
            'email_environment': email_environment,
            'unsubscribe_url': f'{site_url}{unsubscribe_url}',
            'is_having_project': is_having_project,
            'is_not_having_project': is_not_having_project,
        }
        body = template.render(
            project_name=args.get('project_name'),
            survey_url=args.get('survey_url'),
            end_date=args.get('end_date'),
            tenant_name=args.get('tenant_name'),
            email_environment=args.get('email_environment'),
            unsubscribe_url=args.get('unsubscribe_url'),
            is_having_project=args.get('is_having_project'),
            is_not_having_project=args.get('is_not_having_project'),
        )
        return body, args

    @staticmethod
    def _get_tenant_name(tenant_id):
        tenant = TenantModel.find_by_id(tenant_id)
        return tenant.name

    @staticmethod
    def _send_email_notification(subject, email, body, args, template_id):
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
