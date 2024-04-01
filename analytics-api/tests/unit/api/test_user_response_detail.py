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

"""Tests to verify the User response detail API end-point.

Test-Suite to ensure that the user response detail endpoint is working as expected.
"""
import pytest
from unittest.mock import patch
from http import HTTPStatus

from analytics_api.services.user_response_detail import UserResponseDetailService
from analytics_api.utils.util import ContentType
from datetime import datetime, timedelta
from tests.utilities.factory_utils import (
    factory_engagement_model, factory_user_response_detail_model, factory_survey_model)


@pytest.mark.parametrize("exception_type", [KeyError, ValueError])
def test_get_user_responses_by_month(client, exception_type, session):  # pylint:disable=unused-argument
    """Assert that user response detail by month can be fetched."""
    eng = factory_engagement_model()
    survey_data = factory_survey_model(eng)
    user_response_detail = factory_user_response_detail_model(survey_data.id)
    from_date = (datetime.today() - timedelta(days=1)).strftime('%Y-%m-%d')
    to_date = (datetime.today() - timedelta(days=1)).strftime('%Y-%m-%d')
    rv = client.get(f'/api/responses/month/{user_response_detail.engagement_id}\
                    ?&from_date={from_date}&to_date={to_date}', content_type=ContentType.JSON.value)
    assert rv.json[0].get('responses') == 1
    assert rv.status_code == HTTPStatus.OK

    with patch.object(UserResponseDetailService, 'get_response_count_by_created_month',
                      side_effect=exception_type('Test error')):
        rv = client.get(f'/api/responses/month/{user_response_detail.engagement_id}\
                        ?&from_date={from_date}&to_date={to_date}', content_type=ContentType.JSON.value)
    assert rv.status_code == HTTPStatus.INTERNAL_SERVER_ERROR


@pytest.mark.parametrize("exception_type", [KeyError, ValueError])
def test_get_user_responses_by_week(client, exception_type, session):  # pylint:disable=unused-argument
    """Assert that user response detail by week can be fetched."""
    eng = factory_engagement_model()
    survey_data = factory_survey_model(eng)
    user_response_detail = factory_user_response_detail_model(survey_data.id)
    from_date = (datetime.today() - timedelta(days=1)).strftime('%Y-%m-%d')
    to_date = (datetime.today() - timedelta(days=1)).strftime('%Y-%m-%d')
    rv = client.get(f'/api/responses/week/{user_response_detail.engagement_id}\
                    ?&from_date={from_date}&to_date={to_date}', content_type=ContentType.JSON.value)
    assert rv.json[0].get('responses') == 1
    assert rv.status_code == HTTPStatus.OK

    with patch.object(UserResponseDetailService, 'get_response_count_by_created_week',
                      side_effect=exception_type('Test error')):
        rv = client.get(f'/api/responses/week/{user_response_detail.engagement_id}\
                        ?&from_date={from_date}&to_date={to_date}', content_type=ContentType.JSON.value)
    assert rv.status_code == HTTPStatus.INTERNAL_SERVER_ERROR
