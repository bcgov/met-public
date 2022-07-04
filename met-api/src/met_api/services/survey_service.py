
"""Service for survey management."""
# from met_api.models.survey import Survey
from met_api.schemas.survey import SurveySchema

class SurveyService:
    """Survey management service."""

    otherdateformat = '%Y-%m-%d'

    def get(self, id):
        """Get survey by the id."""
        #db_data = Survey.get_engagement(id)
        #extension = self.__create_object(db_data)
        #return extension

    def get_all(self):
        """Get all surveys."""
        #db_data = Survey.get_all_surveys()
        #return [self.__create_object(record) for record in db_data]

    @staticmethod
    def __create_object(db_data):
        engagement = {
            'id': db_data.get('id', None),
            'name': db_data.get('name', None),
            'formJSON': db_data.get('formJSON', None),
            'created_date': db_data['created_date'],
            'engagement': db_data.get('engagement', None),
        }
        return engagement

    def create(self, data: SurveySchema):
        """Create survey."""
        self.validated_fields(data)
        #return Survey.create_survey(data)

    def update(self, data: SurveySchema):
        """Update all engagement."""
        self.validated_fields(data)
        #return Survey.update_survey(data)

    @staticmethod
    def validated_fields(data):
        """Validate all fields."""
        empty_fields = [not data[field] for field in ['name', 'formJSON']]

        if any(empty_fields):
            raise ValueError('Some required fields are empty')
