
"""Service for engagement management."""
from met_api.constants.status import Status
from met_api.models.engagement import Engagement
from met_api.schemas.engagement import EngagementSchema
from met_api.services.object_storage_service import ObjectStorageService


class EngagementService:
    """Engagement management service."""

    otherdateformat = '%Y-%m-%d'

    @staticmethod
    def get_engagement(engagement_id, user_id) -> EngagementSchema:
        """Get Engagement by the id."""
        engagement = Engagement.get_engagement(engagement_id)

        if engagement:
            engagement['banner_url'] = ObjectStorageService.get_url(engagement.get('banner_filename', None))
            if user_id is None and engagement.get('status_id', None) == Status.Draft:
                # Non authenticated users only have access to published engagements
                return None

        return engagement

    @staticmethod
    def get_all_engagements(user_id):
        """Get all engagements."""
        if user_id:
            # authenticated users have access to any engagement status
            engagements = Engagement.get_all_engagements()
        else:
            engagements = Engagement.get_engagements_by_status([Status.Published])

        return engagements

    def create_engagement(self, data: EngagementSchema):
        """Create engagement."""
        self.validate_fields(data)
        return Engagement.create_engagement(data)

    def update_engagement(self, data: EngagementSchema):
        """Update all engagement."""
        self.validate_fields(data)
        return Engagement.update_engagement(data)

    @staticmethod
    def validate_fields(data):
        """Validate all fields."""
        empty_fields = [not data[field] for field in ['name', 'description', 'rich_description',
                                                      'start_date', 'end_date']]

        if any(empty_fields):
            raise ValueError('Some required fields are empty')
