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

"""Tests to verify the survey result API end-point.

Test-Suite to ensure that the survey result endpoint is working as expected.
"""
import json
from http import HTTPStatus
from faker import Faker
from unittest.mock import patch

from analytics_api.services.survey_result import SurveyResultService
from analytics_api.utils.util import ContentType
from tests.utilities.factory_scenarios import TestJwtClaims, TestRequestTypeOptionInfo
from tests.utilities.factory_utils import (
    factory_available_response_option_model, factory_engagement_model, factory_request_type_option_model,
    factory_response_type_option_model, factory_survey_model)

fake = Faker()


def test_get_survey_result_internal(client, mocker, session):  # pylint:disable=unused-argument
    """Assert that survey result can be fetched."""
    engagement = factory_engagement_model()
    survey = factory_survey_model(engagement)
    available_response_option = factory_available_response_option_model(survey)
    factory_request_type_option_model(survey, available_response_option.request_key,
                                      TestRequestTypeOptionInfo.request_type_option3)
    factory_response_type_option_model(survey, available_response_option.request_key,
                                       available_response_option.value)

    # Mock the return value of get_survey_result method
    mocked_survey_result = {"data": "mocked_survey_result"}
    mocker.patch.object(SurveyResultService, 'get_survey_result', return_value=mocked_survey_result)

    token_str = json.dumps(TestJwtClaims.staff_admin_role.value)

    with patch("analytics_api.resources.survey_result._jwt.has_one_of_roles", return_value=True), \
         patch("analytics_api.resources.survey_result.SurveyResultInternal.get") as mock_get:

        # Mock the get method of SurveyResultInternal to directly return the mocked data
        def mock_get(engagement_id):
            return mocked_survey_result

        mocker.patch("analytics_api.resources.survey_result.SurveyResultInternal.get", side_effect=mock_get)

        # Call the endpoint directly without involving authentication decorators
        rv = client.get(f'/api/surveyresult/{engagement.source_engagement_id}/internal',
                        headers={'Authorization': 'Bearer ' + token_str})

        # Check if the response status code is HTTPStatus.OK
        assert rv.status_code == HTTPStatus.OK


def test_get_survey_result_public(client, session):  # pylint:disable=unused-argument
    """Assert that survey result can be fetched."""
    engagement = factory_engagement_model()
    survey = factory_survey_model(engagement)
    available_response_option = factory_available_response_option_model(survey)
    factory_request_type_option_model(survey, available_response_option.request_key,
                                      TestRequestTypeOptionInfo.request_type_option2)
    factory_response_type_option_model(survey, available_response_option.request_key,
                                       available_response_option.value)

    rv = client.get(f'/api/surveyresult/{engagement.source_engagement_id}/public',
                    content_type=ContentType.JSON.value)
    assert rv.status_code == HTTPStatus.OK

    rv = client.get(f'/api/surveyresult/{fake.random_int(min=11, max=99)}/public',
                    content_type=ContentType.JSON.value)
    assert rv.status_code == HTTPStatus.NOT_FOUND

    with patch.object(SurveyResultService, 'get_survey_result',
                      side_effect=KeyError('Test error')):
        rv = client.get(f'/api/surveyresult/{engagement.source_engagement_id}/public',
                        content_type=ContentType.JSON.value)
    assert rv.status_code == HTTPStatus.INTERNAL_SERVER_ERROR

    with patch.object(SurveyResultService, 'get_survey_result',
                      side_effect=ValueError('Test error')):
        rv = client.get(f'/api/surveyresult/{engagement.source_engagement_id}/public',
                        content_type=ContentType.JSON.value)
    assert rv.status_code == HTTPStatus.INTERNAL_SERVER_ERROR
