"""Service for engagement management."""
from analytics_api.models.engagement import Engagement as EngagementModel
from analytics_api.schemas.engagement import EngagementSchema
from analytics_api.schemas.map_data import MapDataSchema


class EngagementService:  # pylint: disable=too-few-public-methods
    """Engagement management service."""

    otherdateformat = '%Y-%m-%d'

    @staticmethod
    def get_engagement(engagement_id) -> EngagementSchema:
        """Get Engagement by the id."""
        engagement = EngagementModel.find_by_id(engagement_id)
        engagement_schema = EngagementSchema()
        return engagement_schema.dump(engagement)
    @staticmethod
    def get_engagement_map_data(engagement_id) -> MapDataSchema:
        """Get Map data by the engagement id."""
        map_data = EngagementModel.get_engagement_map_data(engagement_id)
        map_data_schema = MapDataSchema()
        return map_data_schema.dump(map_data)
