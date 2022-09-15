"""Service for survey management."""

from met_api.constants.engagement_status import Status
from met_api.models.pagination_options import PaginationOptions
from met_api.models import Engagement as EngagementModel
from met_api.models import Survey as SurveyModel
from met_api.schemas.engagement import EngagementSchema
from met_api.schemas.survey import SurveySchema
from met_api.services.object_storage_service import ObjectStorageService


class SurveyService:
    """Survey management service."""

    otherdateformat = '%Y-%m-%d'

    @classmethod
    def get(cls, survey_id):
        """Get survey by the id."""
        survey_model: SurveyModel = SurveyModel.get_survey(survey_id)
        engagement_model: EngagementModel = EngagementModel.get_engagement(survey_model.engagement_id)
        survey = SurveySchema().dump(survey_model)
        eng = EngagementSchema().dump(engagement_model)
        eng['banner_url'] = ObjectStorageService.get_url(engagement_model.banner_filename)
        survey['engagement'] = eng
        return survey

    @classmethod
    def get_open(cls, survey_id):
        """Get survey by the id."""
        survey_model = SurveyModel.get_open(survey_id)
        engagement_model: EngagementModel = EngagementModel.get_engagement(survey_model.engagement_id)
        survey = SurveySchema().dump(survey_model)
        eng = EngagementSchema().dump(engagement_model)
        eng['banner_url'] = ObjectStorageService.get_url(engagement_model.banner_filename)
        survey['engagement'] = eng
        return survey

    @staticmethod
    def get_surveys_paginated(pagination_options: PaginationOptions, search_text='', unlinked=False):
        """Get engagements paginated."""
        surveys_page = SurveyModel.get_surveys_paginated(
            pagination_options,
            search_text,
            unlinked,
        )
        surveys_schema = SurveySchema(many=True)

        return {
            'items': surveys_schema.dump(surveys_page.items),
            'total': surveys_page.total
        }

    @classmethod
    def create(cls, data: SurveySchema):
        """Create survey."""
        cls.validate_create_fields(data)
        return SurveyModel.create_survey(data)

    @classmethod
    def update(cls, data: SurveySchema):
        """Update survey."""
        cls.validate_update_fields(data)
        survey = cls.get(data.get('id', None))
        engagement = survey.get('engagement', None)
        if engagement and engagement.get('status_id', None) != Status.Draft.value:
            raise ValueError('Engagament already published')
        return SurveyModel.update_survey(data)

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
        return SurveyModel.link_survey(survey_id, engagement_id)

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
        return SurveyModel.unlink_survey(survey_id)

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
