
"""Service for engagement management."""
from met_api.models.engagement import Engagement
from met_api.schemas.engagement import EngagementSchema
from met_api.services.object_storage_service import ObjectStorageService


class EngagementService:
    """Engagement management service."""

    otherdateformat = '%Y-%m-%d'

    @staticmethod
    def get_engagement(engagement_id):
        """Get Engagement for the id."""
        engagement = Engagement.get_engagement(engagement_id)
        engagement['banner_url'] = ObjectStorageService.get_url(engagement.get('banner_filename', None))
        return engagement

    @staticmethod
    def get_all_engagements():
        """Get all engagements."""
        engagements = Engagement.get_all_engagements()
        return engagements

    def create_engagement(self, data: EngagementSchema):
        """Create engagement."""
        self.validated_fields(data)
        return Engagement.create_engagement(data)

    def update_engagement(self, data: EngagementSchema):
        """Update all engagement."""
        self.validated_fields(data)
        return Engagement.update_engagement(data)

    @staticmethod
    def validated_fields(data):
        """Validate all fields."""
        empty_fields = [not data[field] for field in ['name', 'description', 'rich_description',
                                                      'start_date', 'end_date']]

        if any(empty_fields):
            raise ValueError('Some required fields are empty')
