
"""Service for survey management."""
from met_api.constants.engagement_status import Status
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

    @classmethod
    def get_open(cls, survey_id):
        """Get survey by the id."""
        db_data = Survey.get_open(survey_id)
        db_data['engagement'] = cls.supply_banner_url(db_data.get('engagement', None))
        return db_data

    @staticmethod
    def supply_banner_url(engagement):
        """Supply engagement with banner url."""
        if not engagement:
            return None
        engagement['banner_url'] = ObjectStorageService.get_url(engagement.get('banner_filename', None))
        return engagement

    @classmethod
    def get_surveys(cls, unlinked=False):
        """Get surveys."""
        if unlinked:
            return cls.get_unlinked()
        return cls.get_all()

    @classmethod
    def get_all(cls):
        """Get all surveys."""
        db_data = Survey.get_all_surveys()
        return db_data

    @classmethod
    def get_unlinked(cls):
        """Get all surveys."""
        db_data = Survey.get_all_unlinked_surveys()
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
        survey = cls.get(data.get('id', None))
        engagement = survey.get('engagement', None)
        if engagement and engagement.get('status_id', None) != Status.Draft.value:
            raise ValueError('Engagament already published')
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
        empty_fields = [not data[field] for field in ['name', 'form_json']]

        if any(empty_fields):
            raise ValueError('Some required fields are empty')

    @classmethod
    def link(cls, survey_id, engagement_id):
        """Update survey."""
        cls.validate_link_fields(survey_id, engagement_id)
        return Survey.link_survey(survey_id, engagement_id)

    @classmethod
    def validate_link_fields(cls, survey_id, engagement_id):
        """Validate all fields."""
        empty_fields = [not value for value in [survey_id, engagement_id]]
        if any(empty_fields):
            raise ValueError('Necessary fields for linking survey to an engagement were missing')

        survey = cls.get(survey_id)

        if not survey:
            raise ValueError('Could not find survey ' + survey_id)

        if survey.get('engagement', None):
            raise ValueError('Survey is already linked to an engagement')

    @classmethod
    def unlink(cls, survey_id, engagement_id):
        """Unlink survey."""
        cls.validate_unlink_fields(survey_id, engagement_id)
        return Survey.unlink_survey(survey_id)

    @classmethod
    def validate_unlink_fields(cls, survey_id, engagement_id):
        """Validate all fields for unlinking survey."""
        empty_fields = [not value for value in [survey_id, engagement_id]]
        if any(empty_fields):
            raise ValueError('Necessary fields for unlinking survey to an engagement were missing')

        survey = cls.get(survey_id)

        if not survey:
            raise ValueError('Could not find survey ' + survey_id)

        linked_engagement = survey.get('engagement', None)
        if not linked_engagement or linked_engagement.get('id') != int(engagement_id):
            raise ValueError('Survey is not linked to engagement ' + engagement_id)

        engagement_status = linked_engagement.get('engagement_status')
        if engagement_status.get('id') != Status.Draft.value:
            raise ValueError('Cannot unlink survey from engagement with status ' + engagement_status.get('status_name'))
