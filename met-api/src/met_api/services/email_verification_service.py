"""Service for Email Verification management."""
import uuid
from datetime import datetime, timedelta
from http import HTTPStatus

from flask import current_app, g
from jinja2 import Environment, FileSystemLoader

from met_api.exceptions.business_exception import BusinessException
from met_api.models.email_verification import EmailVerification
from met_api.models.survey import Survey as SurveyModel
from met_api.schemas.email_verification import EmailVerificationSchema
from met_api.services.rest_service import RestService
from met_api.services.user_service import UserService
from met_api.utils.notification import send_email

ENV = Environment(loader=FileSystemLoader('./templates'), autoescape=True)


class EmailVerificationService:
    """Email Verification management service."""

    verification_expiry_hours = 24
    datetime_format = '%Y-%m-%d %H:%M:%S.%f'
    full_date_format = ' %B %d, %Y'
    date_format = '%Y-%m-%d'

    def get_active(self, verification_token):
        """Get an active email verification matching the provided token."""
        db_email_verification = EmailVerification.get(verification_token)
        self.validate_object(db_email_verification)
        return db_email_verification

    def create(self, email_verification: EmailVerificationSchema) -> None:
        """Create an email verification."""
        self.validate_fields(email_verification)
        email_address = email_verification.get('email_address')

        user = UserService.get_or_create_user(email_address)
        email_verification['user_id'] = user.id
        email_verification['created_by'] = user.id
        email_verification['verification_token'] = uuid.uuid4()
        create_verification_result = EmailVerification.create(email_verification)

        if not create_verification_result.success:
            raise ValueError('Error creating email verification')

        self._send_verification_email(email_verification)
        return email_verification

    def verify(self, verification_token, survey_id):
        """Validate and update an email verification."""
        db_email_verification = EmailVerification.get(verification_token)
        self.validate_object(db_email_verification)

        if db_email_verification.get('survey_id', None) != survey_id:
            raise ValueError('Email verification invalid for survey')

        db_email_verification['updated_by'] = db_email_verification['user_id']
        db_email_verification['is_active'] = False
        result = EmailVerification.update(db_email_verification)
        if not result.success:
            raise ValueError('Error updating email verification')
        return db_email_verification

    @staticmethod
    def _send_verification_email(email_verification: dict) -> None:
        """Send an verification email.Throws error if fails."""
        sender = current_app.config.get('MAIL_FROM_ID')
        survey_id = email_verification.get('survey_id')
        email_to = email_verification.get('email_address')
        survey: SurveyModel = SurveyModel.get_open_survey(survey_id)

        if not survey:
            raise ValueError('Survey not found')
        if not survey.get('engagement'):
            raise ValueError('Engagement not found')

        subject, body, args = EmailVerificationService._render_email_template(
            survey, email_verification.get('verification_token'))
        try:
            # user hasn't been created yet.so create token using SA.
            service_account_token = RestService.get_service_account_token()
            send_email(subject=subject, email=email_to, sender=sender, html_body=body, args=args,
                       token=service_account_token)
        except Exception as exc:  # noqa: B902
            current_app.logger.error('<Notification for registration failed', exc)
            raise BusinessException(error='Deletion not allowed.', status_code=HTTPStatus.FORBIDDEN) from exc

    @staticmethod
    def _render_email_template(survey: SurveyModel, token):
        template = ENV.get_template('email_verification.html')
        survey_id = survey.get('id')
        survey_path = current_app.config.get('SURVEY_PATH'). \
            format(survey_id=survey_id, token=token)
        engagement_path = current_app.config.get('ENGAGEMENT_PATH'). \
            format(engagement_id=survey.get('engagement_id'))
        # url is origin url excluding context path
        survey_url = f"{g.get('origin_url', '')}{survey_path}"
        engagement_url = f"{g.get('origin_url', '')}{engagement_path}"
        engagement = survey.get('engagement')
        engagement_name = engagement.get('name')
        subject = current_app.config.get('VERIFICATION_EMAIL_SUBJECT'). \
            format(engagement_name=engagement_name)
        end_date = datetime.strptime(engagement.get('end_date'), EmailVerificationService.date_format)
        formatted_end_date = datetime.strftime(end_date, EmailVerificationService.full_date_format)
        args = {
            'engagement_name': engagement_name,
            'survey_url': survey_url,
            'engagement_url': engagement_url,
            'end_date': formatted_end_date,
        }
        body = template.render(
            engagement_name=engagement_name,
            survey_url=survey_url,
            engagement_url=engagement_url,
            end_date=formatted_end_date)
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
        survey = SurveyModel.get_open(survey_id)
        if not survey:
            raise ValueError('Engagement period is over')

    @staticmethod
    def validate_fields(data: EmailVerificationSchema):
        """Validate all required fields."""
        empty_fields = [not data[field] for field in [
            'email_address', 'survey_id'
        ]]

        if any(empty_fields):
            raise ValueError('Some required fields are empty')
