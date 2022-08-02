
"""Service for Email Verification management."""
from datetime import datetime, timedelta
import uuid
from met_api.models.default_method_result import DefaultMethodResult
from met_api.models.email_verification import EmailVerification
from met_api.schemas.email_verification import EmailVerificationSchema
from met_api.services.user_service import UserService


class EmailVerificationService:
    """Email Verification management service."""

    verification_expiry_hours = 24
    datetime_format = '%Y-%m-%d %H:%M:%S.%f'

    def get_active(self, verification_token):
        """Get an active email verification matching the provided token."""
        db_email_verification = EmailVerification.get(verification_token)
        self.validate_object(db_email_verification)
        return db_email_verification

    def create(self, email_verification: EmailVerificationSchema) -> DefaultMethodResult:
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

        send_verification_result = self.send_verification_email(email_verification)
        return send_verification_result

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
    def send_verification_email(email_verification: EmailVerificationSchema) -> DefaultMethodResult:
        """Send an verification email."""
        print(email_verification)
        # TODO: send email.
        return DefaultMethodResult(True, '', 0)

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

    @staticmethod
    def validate_fields(data: EmailVerificationSchema):
        """Validate all required fields."""
        empty_fields = [not data[field] for field in [
            'email_address', 'survey_id'
        ]]

        if any(empty_fields):
            raise ValueError('Some required fields are empty')
