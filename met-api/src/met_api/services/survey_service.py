
"""Service for survey management."""
from met_api.models.survey import Survey
from met_api.schemas.survey import SurveySchema


class SurveyService:
    """Survey management service."""

    otherdateformat = '%Y-%m-%d'

    def get(self, survey_id):
        """Get survey by the id."""
        db_data = Survey.get_survey(survey_id)
        return db_data

    def get_all(self):
        """Get all surveys."""
        db_data = Survey.get_all_surveys()
        return db_data

    def create(self, data: SurveySchema):
        """Create survey."""
        self.validated_fields(data)
        return Survey.create_survey(data)

    def update(self, data: SurveySchema):
        """Update survey."""
        self.validated_fields(data)
        return Survey.update_survey(data)

    @staticmethod
    def validated_fields(data):
        """Validate all fields."""
        empty_fields = [not data[field] for field in ['name', 'formJSON']]

        if any(empty_fields):
            raise ValueError('Some required fields are empty')
