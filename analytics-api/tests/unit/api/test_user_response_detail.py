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
from analytics_api.utils.util import ContentType
from tests.utilities.factory_utils import factory_user_response_detail_model, factory_survey_model


def test_get_user_responses_by_month(client, session):  # pylint:disable=unused-argument
    """Assert that user response detail by month can be fetched."""
    survey_data = factory_survey_model()
    user_response_detail = factory_user_response_detail_model(survey_data.id)
    from_date = '2023-02-04'
    to_date = '2023-02-04'
    rv = client.get(f'/api/responses/month/{user_response_detail.engagement_id}\
                    ?&from_date={from_date}&to_date={to_date}', content_type=ContentType.JSON.value)
    assert rv.json[0].get('responses') == 1
    assert rv.status_code == 200


def test_get_user_responses_by_week(client, session):  # pylint:disable=unused-argument
    """Assert that user response detail by week can be fetched."""
    survey_data = factory_survey_model()
    user_response_detail = factory_user_response_detail_model(survey_data.id)
    from_date = '2023-02-04'
    to_date = '2023-02-04'
    rv = client.get(f'/api/responses/week/{user_response_detail.engagement_id}\
                    ?&from_date={from_date}&to_date={to_date}', content_type=ContentType.JSON.value)
    assert rv.json[0].get('responses') == 1
    assert rv.status_code == 200
