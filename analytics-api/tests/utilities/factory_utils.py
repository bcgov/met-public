# Copyright © 2019 Province of British Columbia
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
"""Test Utils.

Test Utility for creating model factory.
"""
from faker import Faker

from analytics_api import db
from analytics_api.config import get_named_config
from analytics_api.models.available_response_option import AvailableResponseOption as AvailableResponseOptionModel
from analytics_api.models.email_verification import EmailVerification as EmailVerificationModel
from analytics_api.models.engagement import Engagement as EngagementModel
from analytics_api.models.request_type_option import RequestTypeOption as RequestTypeOptionModel
from analytics_api.models.response_type_option import ResponseTypeOption as ResponseTypeOptionModel
from analytics_api.models.survey import Survey as SurveyModel
from analytics_api.models.user_details import UserDetails as UserDetailsModel
from analytics_api.models.user_feedback import UserFeedback as UserFeedbackModel
from analytics_api.models.user_response_detail import UserResponseDetail as UserResponseDetailModel
from tests.utilities.factory_scenarios import (TestAvailableResponseOptionInfo, TestEmailVerificationInfo,
                                               TestEngagementInfo, TestRequestTypeOptionInfo,
                                               TestResponseTypeOptionInfo, TestSurveyInfo, TestUserDetailsInfo,
                                               TestUserFeedbackInfo, TestUserResponseDetailInfo)


CONFIG = get_named_config('testing')
fake = Faker()


def factory_available_response_option_model(survey,
                                            info: dict = TestAvailableResponseOptionInfo.available_response_option1):
    """Produce an available response option model."""
    available_response_option = AvailableResponseOptionModel(
        created_date=info.get('created_date'),
        updated_date=info.get('updated_date'),
        is_active=info.get('is_active'),
        runcycle_id=info.get('runcycle_id'),
        survey_id=survey.id,
        participant_id=info.get('participant_id'),
        request_key=info.get('request_key'),
        value=info.get('value'),
        request_id=info.get('request_id'),
    )
    db.session.add(available_response_option)
    db.session.commit()
    return available_response_option


def factory_email_verification_model(emailinfo: dict = TestEmailVerificationInfo.emailverification1):
    """Produce a email verification model."""
    emailverification = EmailVerificationModel(
        created_date=emailinfo.get('created_date'),
        updated_date=emailinfo.get('updated_date'),
        is_active=emailinfo.get('is_active'),
        runcycle_id=emailinfo.get('runcycle_id'),
        source_email_ver_id=emailinfo.get('source_email_ver_id'),
        participant_id=emailinfo.get('participant_id'),
        engagement_id=emailinfo.get('engagement_id'),
        survey_id=emailinfo.get('survey_id'),
    )
    db.session.add(emailverification)
    db.session.commit()
    return emailverification


def factory_engagement_model(eng_info: dict = TestEngagementInfo.engagement1):
    """Produce a engagement model."""
    engagement = EngagementModel(
        created_date=eng_info.get('created_date'),
        updated_date=eng_info.get('updated_date'),
        is_active=eng_info.get('is_active'),
        runcycle_id=eng_info.get('runcycle_id'),
        source_engagement_id=eng_info.get('source_engagement_id'),
        name=eng_info.get('name'),
        start_date=eng_info.get('start_date'),
        end_date=eng_info.get('end_date'),
        published_date=eng_info.get('published_date'),
        latitude=eng_info.get('latitude'),
        longitude=eng_info.get('longitude'),
        geojson=eng_info.get('geojson'),
        marker_label=eng_info.get('marker_label')
    )
    db.session.add(engagement)
    db.session.commit()
    return engagement


def factory_request_type_option_model(survey, request_key,
                                      info: dict = TestRequestTypeOptionInfo.request_type_option1):
    """Produce a request type option model."""
    request_type_option = RequestTypeOptionModel(
        created_date=info.get('created_date'),
        updated_date=info.get('updated_date'),
        is_active=info.get('is_active'),
        runcycle_id=info.get('runcycle_id'),
        survey_id=survey.id,
        key=request_key,
        type=info.get('type'),
        label=info.get('label'),
        request_id=info.get('request_id'),
        position=info.get('position'),
        display=info.get('display'),
    )
    db.session.add(request_type_option)
    db.session.commit()
    return request_type_option


def factory_response_type_option_model(survey, request_key, value,
                                       info: dict = TestResponseTypeOptionInfo.response_type_option1):
    """Produce a response type option model."""
    response_type_option = ResponseTypeOptionModel(
        created_date=info.get('created_date'),
        updated_date=info.get('updated_date'),
        is_active=info.get('is_active'),
        runcycle_id=info.get('runcycle_id'),
        survey_id=survey.id,
        participant_id=info.get('participant_id'),
        request_key=request_key,
        value=value,
        request_id=info.get('request_id'),
    )
    db.session.add(response_type_option)
    db.session.commit()
    return response_type_option


def factory_survey_model(engagement, surveyinfo: dict = TestSurveyInfo.survey1):
    """Produce a survey verification model."""
    survey = SurveyModel(
        created_date=surveyinfo.get('created_date'),
        updated_date=surveyinfo.get('updated_date'),
        is_active=surveyinfo.get('is_active'),
        runcycle_id=surveyinfo.get('runcycle_id'),
        source_survey_id=surveyinfo.get('source_survey_id'),
        engagement_id=engagement.source_engagement_id,
        name=fake.name(),
    )
    db.session.add(survey)
    db.session.commit()
    return survey


def factory_user_details_model(info: dict = TestUserDetailsInfo.user1):
    """Produce a user details model."""
    user_details = UserDetailsModel(
        created_date=info.get('created_date'),
        updated_date=info.get('updated_date'),
        is_active=info.get('is_active'),
        runcycle_id=info.get('runcycle_id'),
        name=info.get('name'),
    )
    db.session.add(user_details)
    db.session.commit()
    return user_details

def factory_user_feedback_model(info: dict = TestUserFeedbackInfo.feedback1):
    """Produce a user feedback model."""
    user_feedback = UserFeedbackModel(
        created_date=info.get('created_date'),
        updated_date=info.get('updated_date'),
        is_active=info.get('is_active'),
        runcycle_id=info.get('runcycle_id'),
        survey_id=info.get('survey_id'),
        user_id=info.get('user_id'),
        comment=info.get('comment'),
        sentiment_analysis=info.get('sentiment_analysis'),
        label=info.get('label'),
        source_comment_id=info.get('source_comment_id'),
    )
    db.session.add(user_feedback)
    db.session.commit()
    return user_feedback


def factory_user_response_detail_model(survey_id, 
                                       userresponseinfo: dict = TestUserResponseDetailInfo.response1):
    """Produce a user response detail verification model."""
    user_response_detail = UserResponseDetailModel(
        created_date=userresponseinfo.get('created_date'),
        updated_date=userresponseinfo.get('updated_date'),
        is_active=userresponseinfo.get('is_active'),
        runcycle_id=userresponseinfo.get('runcycle_id'),
        participant_id=userresponseinfo.get('participant_id'),
        engagement_id=userresponseinfo.get('engagement_id'),
        survey_id=survey_id,
    )
    db.session.add(user_response_detail)
    db.session.commit()
    return user_response_detail
