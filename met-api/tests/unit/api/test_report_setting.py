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

"""Tests to verify the Report setting API end-point.

Test-Suite to ensure that the Report setting endpoint is working as expected.
"""
import json

from met_api.utils.enums import ContentType
from tests.utilities.factory_scenarios import TestJwtClaims, TestSurveyInfo
from tests.utilities.factory_utils import factory_auth_header, factory_survey_and_eng_model


def test_create_report_setting(client, jwt, session):  # pylint:disable=unused-argument
    """Assert that an report setting can be POSTed."""
    headers = factory_auth_header(jwt=jwt, claims=TestJwtClaims.staff_admin_role)
    survey, eng = factory_survey_and_eng_model(TestSurveyInfo.survey3)
    data = {
        'id': survey.id,
        'form_json': survey.form_json,
    }
    rv = client.post('/api/reportsetting/', data=json.dumps(data),
                     headers=headers, content_type=ContentType.JSON.value)
    assert rv.status_code == 200


def test_get_report_setting(client, jwt, session):  # pylint:disable=unused-argument
    """Assert that report setting can be fetched."""
    headers = factory_auth_header(jwt=jwt, claims=TestJwtClaims.staff_admin_role)
    survey, eng = factory_survey_and_eng_model(TestSurveyInfo.survey3)

    data = {
        'id': survey.id,
        'form_json': survey.form_json,
    }
    rv = client.post('/api/reportsetting/', data=json.dumps(data),
                     headers=headers, content_type=ContentType.JSON.value)
    assert rv.status_code == 200

    rv = client.get(
        f'/api/reportsetting/{survey.id}',
        headers=headers,
        content_type=ContentType.JSON.value
    )

    assert rv.status_code == 200
