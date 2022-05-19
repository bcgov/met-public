from app.models.engagement import Engagement

class engagement_service:
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
    
    def __create_engagement_object(self, request_engagement):
        engagement = {
            "id": request_engagement["id"],
            "name": request_engagement["name"],
            "description": request_engagement["description"],
            "start_date": request_engagement["start_date"],
            "end_date": request_engagement["end_date"],
        }
        return engagement

    def create_engagement(self, data):  
        self.validated_fields(data)
        
        return Engagement.create_engagement(data)

    def update_engagement(self, data):  
        self.validated_fields(data)
        
        return Engagement.update_engagement(data)


    def validated_fields(self, data):
        empty_fields = [not data[field] for field in ['name', 'description', 'start_date', 'end_date']]
        
        if any(empty_fields):
            raise ValueError("Some required fields are empty")