
"""Service for survey management."""
from met_api.models.survey import Survey
from met_api.schemas.survey import SurveySchema
from met_api.services.object_storage_service import ObjectStorageService


class SurveyService:
    """Survey management service."""

    otherdateformat = '%Y-%m-%d'

    @classmethod
    def get(cls, survey_id):
        """Get survey by the id."""
        db_data = Survey.get_survey(survey_id)
        db_data['engagement'] = cls.supply_banner_url(db_data.get('engagement', None))
        return db_data

    @staticmethod
    def supply_banner_url(engagement):
        if not engagement:
            return None
        engagement['banner_url'] = ObjectStorageService.get_url(engagement.get('banner_filename', None))
        return engagement

    @classmethod
    def get_all(cls):
        """Get all surveys."""
        db_data = Survey.get_all_surveys()
        return db_data

    @classmethod
    def create(cls, data: SurveySchema):
        """Create survey."""
        cls.validate_create_fields(data)
        return Survey.create_survey(data)

    @classmethod
    def update(cls, data: SurveySchema):
        """Update survey."""
        cls.validate_update_fields(data)
        return Survey.update_survey(data)

    @staticmethod
    def validate_update_fields(data):
        """Validate all fields."""
        empty_fields = [not data[field] for field in ['id', 'form_json']]

        if any(empty_fields):
            raise ValueError('Some required fields are empty')

    @staticmethod
    def validate_create_fields(data):
        """Validate all fields."""
        empty_fields = [not data[field] for field in ['name']]

        if any(empty_fields):
            raise ValueError('Some required fields are empty')
