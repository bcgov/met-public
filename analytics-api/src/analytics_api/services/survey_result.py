"""Service for survey result management."""
from analytics_api.models.request_type_option import RequestTypeOption as RequestTypeOptionModel
from analytics_api.schemas.survey_result import SurveyResultSchema
from analytics_api.utils.roles import Role
from analytics_api.utils.user_context import UserContext, user_context


class SurveyResultService:  # pylint: disable=too-few-public-methods
    """Survey result management service."""

    otherdateformat = '%Y-%m-%d'

    @staticmethod
    @user_context
    def get_survey_result_internal(engagement_id, **kwargs) -> SurveyResultSchema:
        """Get Survey result by the engagement id."""
        user_from_context: UserContext = kwargs['user_context']
        token_roles = set(user_from_context.roles)
        can_view_all_survey_results = Role.VIEW_ALL_SURVEY_RESULTS.value in token_roles
        survey_result = RequestTypeOptionModel.get_survey_result(engagement_id, can_view_all_survey_results)
        survey_result_schema = SurveyResultSchema(many=True)
        return survey_result_schema.dump(survey_result)

    @staticmethod
    def get_survey_result_public(engagement_id) -> SurveyResultSchema:
        """Get Survey result by the engagement id."""
        survey_result = RequestTypeOptionModel.get_survey_result(engagement_id, False)
        survey_result_schema = SurveyResultSchema(many=True)
        return survey_result_schema.dump(survey_result)
