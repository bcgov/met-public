"""Service for survey management."""
from http import HTTPStatus

from met_api.constants.engagement_status import Status
from met_api.constants.membership_type import MembershipType
from met_api.models import Engagement as EngagementModel
from met_api.models import Survey as SurveyModel
from met_api.models.pagination_options import PaginationOptions
from met_api.models.survey_search_options import SurveySearchOptions
from met_api.schemas.engagement import EngagementSchema
from met_api.schemas.survey import SurveySchema
from met_api.services import authorization
from met_api.services.membership_service import MembershipService
from met_api.services.object_storage_service import ObjectStorageService
from met_api.utils.roles import Role
from met_api.utils.token_info import TokenInfo

from ..exceptions.business_exception import BusinessException


class SurveyService:
    """Survey management service."""

    otherdateformat = '%Y-%m-%d'
    formio_survey_default_display = 'form'

    @classmethod
    def get(cls, survey_id):
        """Get survey by the id."""
        survey_model: SurveyModel = SurveyModel.find_by_id(survey_id)
        survey = SurveySchema().dump(survey_model)
        return survey

    @classmethod
    def get_open(cls, survey_id):
        """Get survey by the id."""
        survey_model = SurveyModel.get_open(survey_id)
        engagement_model: EngagementModel = EngagementModel.find_by_id(survey_model.engagement_id)
        survey = SurveySchema().dump(survey_model)
        eng = EngagementSchema().dump(engagement_model)
        eng['banner_url'] = ObjectStorageService.get_url(engagement_model.banner_filename)
        survey['engagement'] = eng
        return survey

    @staticmethod
    def get_surveys_paginated(user_id, pagination_options: PaginationOptions, search_options: SurveySearchOptions):
        """Get engagements paginated."""
        # check if user has view all surveys access to view hidden surveys as well
        user_roles = TokenInfo.get_user_roles()
        can_view_all_surveys = SurveyService._can_view_all_surveys(user_roles)

        if not can_view_all_surveys:
            search_options.exclude_hidden = True

        search_options.assigned_engagements = SurveyService._get_assigned_engagements(user_id, user_roles)
        items, total = SurveyModel.get_surveys_paginated(
            pagination_options,
            search_options,
        )
        surveys_schema = SurveySchema(many=True)

        return {
            'items': surveys_schema.dump(items),
            'total': total
        }

    @staticmethod
    def _get_assigned_engagements(user_id, user_roles):
        if Role.VIEW_PRIVATE_ENGAGEMENTS.value in user_roles:
            return None
        memberships = MembershipService.get_assigned_engagements(user_id)
        return [membership.engagement_id for membership in memberships]

    @staticmethod
    def _can_view_all_surveys(user_roles):
        """Return false if user does not have access to view all hidden surveys."""
        if Role.VIEW_ALL_SURVEYS.value in user_roles:
            return True
        return False

    @classmethod
    def create(cls, survey_data: dict):
        """Create survey."""
        cls.validate_create_fields(survey_data)

        return SurveyModel.create_survey({
            'name': survey_data.get('name'),
            'form_json': {
                'display': survey_data.get('display', cls.formio_survey_default_display),
                'components': [],
            },
            'engagement_id': survey_data.get('engagement_id', None),
        })

    @classmethod
    def clone(cls, data, survey_id):
        """Clone survey."""
        survey_to_clone = cls.get(survey_id)

        if not survey_to_clone:
            raise KeyError('Survey to clone was not found')

        return SurveyModel.create_survey({
            'name': data.get('name'),
            'form_json': survey_to_clone.get('form_json'),
            'engagement_id': data.get('engagement_id', None),
        })

    @classmethod
    def update(cls, data: SurveySchema):
        """Update survey."""
        cls.validate_update_fields(data)
        survey = cls.get(data.get('id', None))
        engagement = survey.get('engagement', None)
        engagement_id = survey.get('engagement_id', None)

        authorization.check_auth(one_of_roles=(MembershipType.TEAM_MEMBER.name,
                                               Role.EDIT_ALL_SURVEYS.value), engagement_id=engagement_id)

        # check if user has edit all surveys access to edit template surveys as well
        user_roles = TokenInfo.get_user_roles()
        is_template = survey.get('is_template', None)
        cls.validate_template_surveys_edit_access(is_template, user_roles)

        if engagement and engagement.get('status_id', None) != Status.Draft.value:
            raise ValueError('Engagement already published')
        return SurveyModel.update_survey(data)

    @staticmethod
    def validate_update_fields(data):
        """Validate all fields."""
        empty_fields = [not data[field] for field in ['id']]

        if any(empty_fields):
            raise ValueError('Some required fields are empty')

    @staticmethod
    def validate_template_surveys_edit_access(is_template, user_roles):
        """Validatef user has edit access on a template survey."""
        if is_template and Role.EDIT_ALL_SURVEYS.value not in user_roles:
            raise BusinessException(
                error='Changes could not be saved due to restricted access on a template survey',
                status_code=HTTPStatus.FORBIDDEN)

    @staticmethod
    def validate_create_fields(data):
        """Validate all fields."""
        empty_fields = [not data[field] for field in ['name', 'display']]

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
