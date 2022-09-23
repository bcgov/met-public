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

from met_api import db
from met_api.config import get_named_config
from met_api.constants.engagement_status import Status
from met_api.models.engagement import Engagement as EngagementModel
from met_api.models.survey import Survey as SurveyModel
from met_api.models.user import User as UserModel
from tests.utilities.factory_scenarios import TestEngagementInfo, TestSurveyInfo, TestUserInfo

CONFIG = get_named_config('testing')
fake = Faker()

JWT_HEADER = {
    'alg': CONFIG.JWT_OIDC_TEST_ALGORITHMS,
    'typ': 'JWT',
    'kid': CONFIG.JWT_OIDC_TEST_AUDIENCE
}


def factory_survey_model(survey_info: dict = TestSurveyInfo.survey1):
    """Produce a survey model."""
    survey = SurveyModel(
        name=fake.name(),
        form_json=survey_info.get('form_json'),
        created_by=survey_info.get('created_by'),
        updated_by=survey_info.get('updated_by'),
        created_date=survey_info.get('created_date'),
        updated_date=survey_info.get('updated_date'),
    )
    db.session.add(survey)
    db.session.commit()
    return survey


def factory_survey_and_eng_model(survey_info: dict = TestSurveyInfo.survey1):
    """Produce a survey model."""
    eng = factory_engagement_model(status=Status.Published.value)
    survey = SurveyModel(
        name=fake.name(),
        form_json=survey_info.get('form_json'),
        created_by=survey_info.get('created_by'),
        updated_by=survey_info.get('updated_by'),
        created_date=survey_info.get('created_date'),
        updated_date=survey_info.get('updated_date'),
        engagement_id=eng.id
    )
    db.session.add(survey)
    db.session.commit()
    return survey


def factory_engagement_model(eng_info: dict = TestEngagementInfo.engagement1, status=None):
    """Produce a engagement model."""
    engagement = EngagementModel(
        name=fake.name(),
        description=eng_info.get('description'),
        rich_description=eng_info.get('rich_description'),
        content=eng_info.get('content'),
        rich_content=eng_info.get('rich_content'),
        created_by=eng_info.get('created_by'),
        updated_by=eng_info.get('updated_by'),
        status_id=status if status else eng_info.get('status'),
        start_date=eng_info.get('start_date'),
        end_date=eng_info.get('end_date'),
    )
    db.session.add(engagement)
    db.session.commit()
    return engagement


def factory_user_model(user_info: dict = TestUserInfo.user_public_1):
    """Produce a user model."""
    user = UserModel(
        first_name=user_info['first_name'],
        last_name=user_info['last_name'],
        middle_name=user_info['middle_name'],
        email_id=user_info['email_id'],
        external_id=str(fake.random_number(digits=5))
    )
    db.session.add(user)
    db.session.commit()
    return user


def factory_auth_header(jwt, claims):
    """Produce JWT tokens for use in tests."""
    return {'Authorization': 'Bearer ' + jwt.create_jwt(claims=claims, header=JWT_HEADER)}
