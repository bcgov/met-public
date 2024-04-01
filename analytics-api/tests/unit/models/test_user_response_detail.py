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
"""Tests for the User response detail model.

Test suite to ensure that the User response detail model routines are working as expected.
"""

from analytics_api.models.user_response_detail import UserResponseDetail as UserResponseDetailModel
from tests.utilities.factory_utils import (
    factory_engagement_model, factory_survey_model, factory_user_response_detail_model)


def test_user_response_detail_by_month(session):
    """Assert that an user response detail data related to an engagement can be fetched by month."""
    eng = factory_engagement_model()
    survey = factory_survey_model(eng)
    user_response_detail = factory_user_response_detail_model(survey.id)
    assert user_response_detail.id is not None
    user_response_detail_by_month = UserResponseDetailModel.get_response_count_by_created_month(
        user_response_detail.engagement_id)
    assert user_response_detail_by_month is not None


def test_user_response_detail_by_week(session):
    """Assert that an user response detail data related to an engagement can be fetched by week."""
    eng = factory_engagement_model()
    survey = factory_survey_model(eng)
    user_response_detail = factory_user_response_detail_model(survey.id)
    assert user_response_detail.id is not None
    user_response_detail_by_week = UserResponseDetailModel.get_response_count_by_created_week(
        user_response_detail.engagement_id)
    assert user_response_detail_by_week is not None
