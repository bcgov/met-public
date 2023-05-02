"""Service for user response detail management."""
from analytics_api.models.user_response_detail import UserResponseDetail as UserResponseDetailModel


class UserResponseDetailService:
    """User response detail management service."""

    otherdateformat = '%Y-%m-%d'

    @staticmethod
    def get_response_count_by_created_month(engagement_id):
        """Get user response count for an engagement id grouped by created month."""
        response_count_by_created_month = UserResponseDetailModel.get_response_count_by_created_month(engagement_id)
        return response_count_by_created_month

    @staticmethod
    def get_response_count_by_created_week(engagement_id):
        """Get user response count for an engagement id grouped by created week."""
        response_count_by_created_week = UserResponseDetailModel.get_response_count_by_created_week(engagement_id)
        return response_count_by_created_week
