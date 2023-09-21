"""Service for user response detail management."""
from analytics_api.models.user_response_detail import UserResponseDetail as UserResponseDetailModel
from analytics_api.utils import engagement_access_validator


class UserResponseDetailService:
    """User response detail management service."""

    otherdateformat = '%Y-%m-%d'

    @staticmethod
    def get_response_count_by_created_month(engagement_id, search_options=None):
        """Get user response count for an engagement id grouped by created month."""
        if engagement_access_validator.check_engagement_access(engagement_id):
            response_count_by_created_month = UserResponseDetailModel.get_response_count_by_created_month(
                engagement_id, search_options)
            return response_count_by_created_month
        return {}

    @staticmethod
    def get_response_count_by_created_week(engagement_id, search_options=None):
        """Get user response count for an engagement id grouped by created week."""
        if engagement_access_validator.check_engagement_access(engagement_id):
            response_count_by_created_week = UserResponseDetailModel.get_response_count_by_created_week(
                engagement_id, search_options)
            return response_count_by_created_week
        return {}
