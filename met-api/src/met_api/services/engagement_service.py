
"""Service for engagement management."""
from met_api.models.engagement import Engagement
from met_api.schemas.Engagement import EngagementSchema
from met_api.services.object_storage_service import ObjectStorageService


class EngagementService:
    """Engagement management service."""

    otherdateformat = '%Y-%m-%d'

    def get_engagement(self, engagement_id):
        """Get Engagement for the id."""
        request_engagement = Engagement.get_engagement(engagement_id)
        extension = self.__create_engagement_object(request_engagement)
        return extension

    def get_all_engagements(self):
        """Get all engagements."""
        engagements_requests = Engagement.get_all_engagements()
        return [self.__create_engagement_object(engagement) for engagement in engagements_requests]

    @staticmethod
    def __create_engagement_object(request_engagement):
        engagement = {
            'id': request_engagement.get('id', None),
            'name': request_engagement.get('name', None),
            'description': request_engagement.get('description', None),
            'rich_description': request_engagement.get('rich_description', None),
            'start_date': request_engagement.get('start_date', None),
            'end_date': request_engagement.get('end_date', None),
            'created_date': request_engagement['created_date'],
            'published_date': request_engagement.get('published_date', None),
            'content': request_engagement.get('content', None),
            'rich_content': request_engagement.get('rich_content', None),
            'banner_filename': request_engagement.get('banner_filename', None),
            'banner_url': ObjectStorageService.get_url(request_engagement.get('banner_filename', None)),
            'status': request_engagement.get('engagement_status', None),
        }
        return engagement

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
