"""Service for engagement management."""
from analytics_api.models.engagement import Engagement as EngagementModel
from analytics_api.schemas.engagement import EngagementSchema


class EngagementService:
    """Engagement management service."""

    otherdateformat = '%Y-%m-%d'

    @staticmethod
    def get_engagement(engagement_id) -> EngagementSchema:
        """Get Engagement by the id."""
        engagement = EngagementModel.find_by_id(engagement_id)
        engagement_schema = EngagementSchema()
        return engagement_schema.dump(engagement)
