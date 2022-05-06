from os import stat
from re import VERBOSE

from App.Api.models.Engagement import Engagement
from datetime import datetime
import json

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
            "engagement_id": request_engagement["engagement_id"],
            "title": request_engagement["title"],
            "description": request_engagement["description"],
            "start_date": request_engagement["start_date"],
            "end_date": request_engagement["end_date"],
        }
        return engagement