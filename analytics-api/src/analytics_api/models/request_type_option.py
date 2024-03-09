"""request_type_option model class.

Manages the option type questions (radio/checkbox) on a survey
"""
from sqlalchemy import and_, func, or_
from sqlalchemy.sql.expression import true
from analytics_api.models.available_response_option import AvailableResponseOption as AvailableResponseOptionModel
from analytics_api.models.survey import Survey as SurveyModel
from analytics_api.models.response_type_option import ResponseTypeOption as ResponseTypeOptionModel
from .base_model import BaseModel
from .db import db
from .request_mixin import RequestMixin


class RequestTypeOption(BaseModel, RequestMixin):  # pylint: disable=too-few-public-methods
    """Definition of the Request Type Option entity."""

    __tablename__ = 'request_type_option'

    @classmethod
    def get_survey_result(
        cls,
        engagement_id,
        can_view_all_survey_results
    ):
        """Get the analytics survey id for an engagement id."""
        analytics_survey_id = (db.session.query(SurveyModel.id)
                               .filter(and_(SurveyModel.engagement_id == engagement_id,
                                            SurveyModel.is_active == true()))
                               .subquery())

        # Get all the survey questions specific to a survey id which are in active status.
        # for users with role to view all surveys fetch all survey questions
        # for all other users exclude questions excluded on report settings
        if can_view_all_survey_results:
            survey_question = (db.session.query(RequestTypeOption.position.label('position'),
                                                RequestTypeOption.label.label('label'),
                                                RequestTypeOption.key)
                               .filter(and_(RequestTypeOption.survey_id.in_(analytics_survey_id),
                                            RequestTypeOption.is_active == true()))
                               .order_by(RequestTypeOption.position)
                               .subquery())
        else:
            survey_question = (db.session.query(RequestTypeOption.position.label('position'),
                                                RequestTypeOption.label.label('label'),
                                                RequestTypeOption.key)
                               .filter(and_(RequestTypeOption.survey_id.in_(analytics_survey_id),
                                            RequestTypeOption.is_active == true(),
                                            or_(RequestTypeOption.display == true(),
                                                RequestTypeOption.display.is_(None))))
                               .order_by(RequestTypeOption.position)
                               .subquery())

        # Get all the available responses for each question within the survey.
        available_response = (db.session.query(AvailableResponseOptionModel.request_key,
                                               AvailableResponseOptionModel.value)
                              .filter(and_(AvailableResponseOptionModel.survey_id.in_(
                                  analytics_survey_id), AvailableResponseOptionModel.is_active == true()))
                              .subquery())
        # Get all the survey responses with the counts for each response specific to a survey id which
        # are in active status.
        survey_response = (db.session.query(ResponseTypeOptionModel.request_key, ResponseTypeOptionModel.value,
                                            func.count(ResponseTypeOptionModel.request_key).label('response'))
                           .filter(and_(ResponseTypeOptionModel.survey_id.in_(analytics_survey_id),
                                        ResponseTypeOptionModel.is_active == true()))
                           .group_by(ResponseTypeOptionModel.request_key, ResponseTypeOptionModel.value)
                           .subquery())

        survey_response_exists = db.session.query(survey_response.c.request_key).first()
        available_response_exists = db.session.query(available_response.c.request_key).first()

        # Combine the data fetched above such that the result has a format as below
        # - position: is a unique value for each question which helps to get the order of question on the survey
        # - label: is the the survey question
        # - value: user selected response for each question
        # - count: number of time the same value is selected as a response to each question

        # Check if there are records in survey_response and available_response before executing the final query
        # which fetches all the available responses along with the corresponding responses.
        if survey_response_exists and available_response_exists:
            survey_result = (db.session.query((survey_question.c.position).label('position'),
                                              (survey_question.c.label).label('question'),
                                              func.json_agg(func.json_build_object(
                                                  'value', available_response.c.value,
                                                  'count', func.coalesce(survey_response.c.response, 0)))
                             .label('result'))
                             .outerjoin(available_response, survey_question.c.key == available_response.c.request_key)
                             .outerjoin(survey_response,
                                        (available_response.c.value == survey_response.c.value) &
                                        (available_response.c.request_key == survey_response.c.request_key))
                             .group_by(survey_question.c.position, survey_question.c.label))

            return survey_result.all()
        # Check if there are records in survey_response before executing the final query which fetches reponses
        # even if the available_response table is not yet populated.
        if survey_response_exists:
            survey_result = (db.session.query((survey_question.c.position).label('position'),
                                              (survey_question.c.label).label('question'),
                                              func.json_agg(func.json_build_object('value',
                                                                                   survey_response.c.value,
                                                                                   'count',
                                                                                   survey_response.c.response))
                             .label('result'))
                             .join(survey_response, survey_response.c.request_key == survey_question.c.key)
                             .group_by(survey_question.c.position, survey_question.c.label))

            return survey_result.all()

        return None  # Return None indicating no records
