
"""Service for engagement management."""
from met_api.models.engagement import Engagement


class EngagementService:
    """ Engagement management service
    """

    otherdateformat = '%Y-%m-%d'

    def get_engagement(self, engagement_id):
        request_engagement = Engagement.get_engagement(engagement_id)
        extension = self.__create_engagement_object(request_engagement)
        return extension

    def get_all_engagements(self):
        engagements_requests = Engagement.get_all_engagements()
        return [self.__create_engagement_object(engagement) for engagement in engagements_requests]

    @staticmethod
    def __create_engagement_object(request_engagement):
        engagement = {
            "id": request_engagement.get("id", None),
            "name": request_engagement.get("name", None),
            "description": request_engagement.get("description", None),
            "rich_description": request_engagement.get("rich_description", None),
            "start_date": request_engagement.get("start_date", None),
            "end_date": request_engagement.get("end_date", None),
            "created_date": request_engagement['created_date'],
            "published_date": request_engagement.get("published_date", None),
        }
        return engagement

    def create_engagement(self, data):
        self.validated_fields(data)

        return Engagement.create_engagement(data)

    def update_engagement(self, data):
        self.validated_fields(data)

        return Engagement.update_engagement(data)

    @staticmethod
    def validated_fields(data):
        empty_fields = [not data[field] for field in ['name', 'description', 'rich_description', 'start_date', 'end_date']]

        if any(empty_fields):
            raise ValueError("Some required fields are empty")
