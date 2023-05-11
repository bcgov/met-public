"""Service for survey result management."""
from analytics_api.models.request_type_option import RequestTypeOption as RequestTypeOptionModel
from analytics_api.schemas.survey_result import SurveyResultSchema


class SurveyResultService:  # pylint: disable=too-few-public-methods
    """Survey result management service."""

    otherdateformat = '%Y-%m-%d'

    @staticmethod
    def get_survey_result(engagement_id) -> SurveyResultSchema:
        """Get Survey result by the engagement id."""
        survey_result = RequestTypeOptionModel.get_survey_result(engagement_id)
        survey_result_schema = SurveyResultSchema(many=True)
        return survey_result_schema.dump(survey_result)
