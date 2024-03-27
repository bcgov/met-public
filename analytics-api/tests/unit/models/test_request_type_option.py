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
"""Tests for the Request Type Option model.

Test suite to ensure that the Request Type Option model routines are working as expected.
"""

from analytics_api.models.request_type_option import RequestTypeOption as RequestTypeOptionModel
from faker import Faker
from tests.utilities.factory_scenarios import TestRequestTypeOptionInfo
from tests.utilities.factory_utils import (
    factory_available_response_option_model, factory_engagement_model, factory_request_type_option_model,
    factory_response_type_option_model, factory_survey_model)

fake = Faker()


def test_request_type_option_data(session):
    """Assert that an request type option data can be created and fetched."""
    eng = factory_engagement_model()
    survey = factory_survey_model(eng)
    available_response_option = factory_available_response_option_model(survey)
    request_type_option = factory_request_type_option_model(survey, available_response_option.request_key)
    assert request_type_option.id is not None
    retrieved_options = RequestTypeOptionModel.find_by_id(request_type_option.id)
    assert retrieved_options.request_id == request_type_option.request_id


def test_request_type_option_data_by_engagement_id_admin(session):
    """Assert that an request type option with display true/false data can be fetched by users with access."""
    eng = factory_engagement_model()
    survey = factory_survey_model(eng)
    available_response_option = factory_available_response_option_model(survey)
    request_type_option = factory_request_type_option_model(survey, available_response_option.request_key)
    assert request_type_option.id is not None

    request_type_option = factory_request_type_option_model(survey, available_response_option.request_key,
                                                            TestRequestTypeOptionInfo.request_type_option3)
    assert request_type_option.id is not None

    response_type_option = factory_response_type_option_model(survey, available_response_option.request_key,
                                                              available_response_option.value)
    assert response_type_option.id is not None

    retrieved_options = RequestTypeOptionModel.get_survey_result(eng.source_engagement_id, True)
    assert len(retrieved_options) == 2


def test_request_type_option_data_by_engagement_id_non_admin(session):
    """Assert that an request type option with display true/false data cannot be fetched by users with access."""
    eng = factory_engagement_model()
    survey = factory_survey_model(eng)
    available_response_option = factory_available_response_option_model(survey)
    request_type_option = factory_request_type_option_model(survey, available_response_option.request_key,
                                                            TestRequestTypeOptionInfo.request_type_option2)
    assert request_type_option.id is not None

    request_type_option = factory_request_type_option_model(survey, available_response_option.request_key,
                                                            TestRequestTypeOptionInfo.request_type_option3)
    assert request_type_option.id is not None

    response_type_option = factory_response_type_option_model(survey, available_response_option.request_key,
                                                              available_response_option.value)
    assert response_type_option.id is not None

    retrieved_options = RequestTypeOptionModel.get_survey_result(eng.source_engagement_id, False)
    assert len(retrieved_options) == 1


def test_request_type_option_data_by_engagement_id(session):
    """Assert that an request type option data can be fetched by even without having available responses."""
    eng = factory_engagement_model()
    survey = factory_survey_model(eng)
    request_key = fake.word()
    request_type_option = factory_request_type_option_model(survey, request_key,
                                                            TestRequestTypeOptionInfo.request_type_option2)
    assert request_type_option.id is not None

    response_type_option = factory_response_type_option_model(survey, request_key, fake.word())
    assert response_type_option.id is not None

    retrieved_options = RequestTypeOptionModel.get_survey_result(eng.source_engagement_id, False)
    assert len(retrieved_options) == 1
