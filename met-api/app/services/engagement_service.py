from App.models.engagement import Engagement

class engagement_service:
    """ Engagement management service
    """
    otherdateformat = '%Y-%m-%d'

    def get_engagement(self, engagement_id):
        request_engagement = Engagement().get_engagement(engagement_id)
        extension = self.__create_engagement_object(request_engagement)
        return extension    
    
    def __create_engagement_object(self, request_engagement):
        engagement = {
            "id": request_engagement["id"],
            "title": request_engagement["title"],
            "description": request_engagement["description"],
            "start_date": request_engagement["start_date"],
            "end_date": request_engagement["end_date"],
        }
        return engagement