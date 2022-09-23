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

"""Tests to verify the Engagement API end-point.

Test-Suite to ensure that the /Engagement endpoint is working as expected.
"""
import json

import pytest

from tests.utilities.factory_scenarios import TestJwtClaims, TestSurveyInfo
from tests.utilities.factory_utils import factory_auth_header


@pytest.mark.parametrize('survey_info', [TestSurveyInfo.survey2])
def test_create_survey(client, jwt, session, survey_info):  # pylint:disable=unused-argument
    """Assert that an survey can be POSTed."""
    headers = factory_auth_header(jwt=jwt, claims=TestJwtClaims.no_role)
    rv = client.post('/api/surveys/', data=json.dumps(survey_info),
                     headers=headers, content_type='application/json')
    assert rv.status_code == 200
    assert rv.json.get('status') is True
    assert rv.json.get('result').get('form_json') == survey_info.get('form_json')


@pytest.mark.parametrize('survey_info', [TestSurveyInfo.survey2])
def test_put_survey(client, jwt, session, survey_info):  # pylint:disable=unused-argument
    """Assert that an survey can be POSTed."""
    headers = factory_auth_header(jwt=jwt, claims=TestJwtClaims.no_role)
    rv = client.post('/api/surveys/', data=json.dumps(survey_info),
                     headers=headers, content_type='application/json')
    assert rv.status_code == 200
    assert rv.json.get('status') is True
    assert rv.json.get('result').get('form_json') == survey_info.get('form_json')
    assert rv.json.get('result').get('name') == survey_info.get('name')
    id = str(rv.json.get('id'))
    new_survey_name = 'new_survey_name'
    rv = client.put('/api/surveys/', data=json.dumps({'id': id, 'name': new_survey_name}),
                    headers=headers, content_type='application/json')

    assert rv.status_code == 200

    rv = client.get(f'/api/surveys/{id}', data=json.dumps(survey_info),
                    headers=headers, content_type='application/json')
    assert rv.status_code == 200
    assert rv.json.get('status') is True
    assert rv.json.get('result').get('form_json') == survey_info.get('form_json')
    assert rv.json.get('result').get('name') == new_survey_name
