
"""Service for survey management."""
from met_api.models.survey import Survey
from met_api.schemas.survey import SurveySchema


class SurveyService:
    """Survey management service."""

    otherdateformat = '%Y-%m-%d'

    @classmethod
    def get(cls, survey_id):
        """Get survey by the id."""
        db_data = Survey.get_survey(survey_id)
        return db_data

    @classmethod
    def get_all(cls):
        """Get all surveys."""
        db_data = Survey.get_all_surveys()
        return db_data

    @classmethod
    def create(cls, data: SurveySchema):
        """Create survey."""
        cls.validated_create_fields(data)
        return Survey.create_survey(data)

    @classmethod
    def update(cls, data: SurveySchema):
        """Update survey."""
        cls.validated_update_fields(data)
        return Survey.update_survey(data)

    @staticmethod
    def validated_update_fields(data):
        """Validate all fields."""
        empty_fields = [not data[field] for field in ['id', 'form_json']]

        if any(empty_fields):
            raise ValueError('Some required fields are empty')

    @staticmethod
    def validated_create_fields(data):
        """Validate all fields."""
        empty_fields = [not data[field] for field in ['name']]

        if any(empty_fields):
            raise ValueError('Some required fields are empty')
