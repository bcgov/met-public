"""Service for Email Verification management."""
import uuid
from datetime import datetime, timedelta
from http import HTTPStatus

from flask import current_app

from met_api.exceptions.business_exception import BusinessException
from met_api.models import Engagement as EngagementModel
from met_api.models import Survey as SurveyModel
from met_api.models.email_verification import EmailVerification
from met_api.schemas.email_verification import EmailVerificationSchema
from met_api.services.user_service import UserService
from met_api.utils import notification
from met_api.utils.template import Template


class EmailVerificationService:
    """Email Verification management service."""

    verification_expiry_hours = 24
    datetime_format = '%Y-%m-%d %H:%M:%S.%f'
    full_date_format = ' %B %d, %Y'
    date_format = '%Y-%m-%d'

    @classmethod
    def get(cls, verification_token):
        """Get an active email verification matching the provided token."""
        db_email_verification = EmailVerification.get(verification_token)
        return EmailVerificationSchema().dump(db_email_verification)

    @classmethod
    def get_active(cls, verification_token):
        """Get an active email verification matching the provided token."""
        db_email_verification = EmailVerification.get(verification_token)
        email_verification = EmailVerificationSchema().dump(db_email_verification)
        cls.validate_object(email_verification)
        return email_verification

    @classmethod
    def create(cls, email_verification: EmailVerificationSchema, session=None) -> None:
        """Create an email verification."""
        cls.validate_fields(email_verification)
        email_address = email_verification.get('email_address')
        if email_address is not None:
            user = UserService.get_or_create_user(email_address)
            email_verification['user_id'] = user.id
        email_verification['created_by'] = email_verification.get('user_id')
        email_verification['verification_token'] = uuid.uuid4()
        EmailVerification.create(email_verification, session)
        cls._send_verification_email(email_verification)
        return email_verification

    @classmethod
    def verify(cls, verification_token, survey_id, submission_id, session):
        """Validate and update an email verification."""
        db_email_verification = EmailVerification.get(verification_token)
        email_verification = EmailVerificationSchema().dump(db_email_verification)
        cls.validate_object(email_verification)

        if email_verification.get('survey_id', None) != survey_id:
            raise ValueError('Email verification invalid for survey')

        if email_verification.get('submission_id', None) != submission_id:
            raise ValueError('Email verification invalid for submission')

        email_verification['updated_by'] = email_verification['user_id']
        email_verification['is_active'] = False
        EmailVerification.update(email_verification, session)
        return email_verification

    @staticmethod
    def _send_verification_email(email_verification: dict) -> None:
        """Send an verification email.Throws error if fails."""
        survey_id = email_verification.get('survey_id')
        email_to = email_verification.get('email_address')
        survey: SurveyModel = SurveyModel.get_open(survey_id)

        if not survey:
            raise ValueError('Survey not found')
        if not survey.engagement_id:
            raise ValueError('Engagement not found')

        template_id = current_app.config.get('VERIFICATION_EMAIL_TEMPLATE_ID', None)
        subject, body, args = EmailVerificationService._render_email_template(
            survey, email_verification.get('verification_token'))
        try:
            # user hasn't been created yet.so create token using SA.
            notification.send_email(subject=subject, email=email_to, html_body=body, args=args, template_id=template_id)
        except Exception as exc:  # noqa: B902
            current_app.logger.error('<Notification for registration failed', exc)
            raise BusinessException(
                error='Error sending verification email.',
                status_code=HTTPStatus.INTERNAL_SERVER_ERROR) from exc

    @staticmethod
    def _render_email_template(survey: SurveyModel, token):
        template = Template.get_template('email_verification.html')
        survey_id = survey.id
        survey_path = current_app.config.get('SURVEY_PATH'). \
            format(survey_id=survey_id, token=token)
        dashboard_path = current_app.config.get('ENGAGEMENT_DASHBOARD_PATH'). \
            format(engagement_id=survey.engagement_id)
        # url is origin url excluding context path
        site_url = current_app.config.get('SITE_URL')
        engagement: EngagementModel = EngagementModel.get_engagement(survey.engagement_id)
        engagement_name = engagement.name
        subject = current_app.config.get('VERIFICATION_EMAIL_SUBJECT'). \
            format(engagement_name=engagement_name)
        args = {
            'engagement_name': engagement_name,
            'survey_url': f'{site_url}{survey_path}',
            'engagement_url': f'{site_url}{dashboard_path}',
            'end_date': datetime.strftime(engagement.end_date, EmailVerificationService.full_date_format),
        }
        body = template.render(
            engagement_name=args.get('engagement_name'),
            survey_url=args.get('survey_url'),
            engagement_url=args.get('engagement_url'),
            end_date=args.get('end_date'),
        )
        return subject, body, args

    @staticmethod
    def validate_object(email_verification: EmailVerificationSchema):
        """Validate an email verification."""
        if email_verification.get('id', None) is None:
            raise ValueError('Email verification not found')

        is_active = email_verification.get('is_active')
        if not is_active:
            raise ValueError('Email verification already verified')

        verification_created_datetime = datetime.strptime(
            email_verification.get('created_date'), EmailVerificationService.datetime_format)
        verification_expiry_datetime = verification_created_datetime + \
            timedelta(hours=EmailVerificationService.verification_expiry_hours)
        if datetime.now() >= verification_expiry_datetime:
            raise ValueError('Email verification is expired')

        survey_id = email_verification.get('survey_id')
        survey: SurveyModel = SurveyModel.get_open(survey_id)
        if not survey:
            raise ValueError('Engagement period is over')

    @staticmethod
    def validate_fields(data: EmailVerificationSchema):
        """Validate all required fields."""
        empty_fields = [not data[field] for field in [
            'survey_id'
        ]]

        if any(empty_fields):
            raise ValueError('Some required fields are empty')
