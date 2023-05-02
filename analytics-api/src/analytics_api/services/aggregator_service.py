"""Service to get counts for dashboard."""
from analytics_api.models.email_verification import EmailVerification as EmailVerificationModel
from analytics_api.models.user_response_detail import UserResponseDetail as UserResponseDetailModel


class AggregatorService:  # pylint: disable=too-few-public-methods
    """Aggregator service."""

    otherdateformat = '%Y-%m-%d'

    @staticmethod
    def get_count(engagement_id, count_for=''):
        """Get total count for an engagement id."""
        total_count = 0

        if count_for == 'email_verification':
            total_count = EmailVerificationModel.get_email_verification_count(engagement_id)
        if count_for == 'survey_completed':
            total_count = UserResponseDetailModel.get_response_count(engagement_id)

        return total_count
