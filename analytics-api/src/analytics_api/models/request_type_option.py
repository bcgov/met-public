"""request_type_option model class.

Manages the option type questions on a survey
"""
from .base_model import BaseModel
from .db import db
from .request_mixin import RequestMixin
from analytics_api.models.survey import Survey as SurveyModel
from analytics_api.models.response_type_option import ResponseTypeOption as ResponseTypeOptionModel
from sqlalchemy import func
from sqlalchemy.sql.expression import true


class RequestTypeOption(BaseModel, RequestMixin):  # pylint: disable=too-few-public-methods
    """Definition of the Request Type Option entity."""

    __tablename__ = 'request_type_option'

    @classmethod
    def get_survey_result(
        cls,
        engagement_id
    ):
        """Get survey result for an engagement id."""
        analytics_survey_id = (db.session.query(SurveyModel.id)
                    .filter(SurveyModel.engagement_id == engagement_id)
                    .filter(SurveyModel.is_active == true())
                    .subquery())

        survey_question = (db.session.query(RequestTypeOption.postion.label('postion'),
                                            RequestTypeOption.label.label('label'),
                                            RequestTypeOption.request_id)
                                            .filter(RequestTypeOption.survey_id.in_(analytics_survey_id))
                                            .filter(RequestTypeOption.is_active == true())
                                            .order_by(RequestTypeOption.postion)
                                            .subquery())

        survey_response = (db.session.query(ResponseTypeOptionModel.request_id, ResponseTypeOptionModel.value,
                                            func.count(ResponseTypeOptionModel.request_id).label('response'))
                                            .filter(ResponseTypeOptionModel.survey_id.in_(analytics_survey_id))
                                            .filter(ResponseTypeOptionModel.is_active == true())
                                            .group_by(ResponseTypeOptionModel.request_id,
                                                      ResponseTypeOptionModel.value)
                                            .subquery())

        survey_result = (db.session.query((survey_question.c.postion).label('postion'),
                                          (survey_question.c.label).label('question'),
                                         func.json_agg(func.json_build_object('value', survey_response.c.value,
                                                                             'count', survey_response.c.response))
                                                                             .label('result'))
                                         .join(survey_response,
                                               survey_response.c.request_id == survey_question.c.request_id)
                                         .group_by(survey_question.c.postion, survey_question.c.label))

        return survey_result.all()
