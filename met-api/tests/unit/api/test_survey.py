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
from flask import current_app

from met_api.models.tenant import Tenant as TenantModel
from met_api.utils.constants import TENANT_ID_HEADER
from met_api.utils.enums import ContentType
from tests.utilities.factory_scenarios import TestJwtClaims, TestSurveyInfo, TestTenantInfo
from tests.utilities.factory_utils import (
    factory_auth_header, factory_engagement_model, factory_hidden_survey_model, factory_survey_model,
    factory_template_survey_model, factory_tenant_model)


@pytest.mark.parametrize('survey_info', [TestSurveyInfo.survey2])
def test_create_survey(client, jwt, session, survey_info):  # pylint:disable=unused-argument
    """Assert that an survey can be POSTed."""
    headers = factory_auth_header(jwt=jwt, claims=TestJwtClaims.staff_admin_role)
    rv = client.post('/api/surveys/', data=json.dumps(survey_info),
                     headers=headers, content_type=ContentType.JSON.value)
    assert rv.status_code == 200
    assert rv.json.get('form_json') == survey_info.get('form_json')


def test_create_survey_with_tenant(client, jwt, session, survey_info):  # pylint:disable=unused-argument
    """Assert that an survey can be POSTed."""
    headers = factory_auth_header(jwt=jwt, claims=TestJwtClaims.staff_admin_role)
    tenant_short_name = current_app.config.get('DEFAULT_TENANT_SHORT_NAME')
    tenant = TenantModel.find_by_short_name(tenant_short_name)
    assert tenant is not None
    headers[TENANT_ID_HEADER] = tenant_short_name
    rv = client.post('/api/surveys/', data=json.dumps(TestSurveyInfo.survey2),
                     headers=headers, content_type=ContentType.JSON.value)
    assert rv.status_code == 200
    assert rv.json.get('form_json') == survey_info.get('form_json')
    survey_tenant_id = rv.json.get('tenant_id')
    assert survey_tenant_id == str(tenant.id)

    # Create a tenant
    tenant_data = TestTenantInfo.tenant1
    factory_tenant_model(tenant_data)
    tenant2_short_name = tenant_data['short_name']
    tenant_2 = TenantModel.find_by_short_name(tenant2_short_name)

    # Verify that the tenant was created successfully
    assert tenant_2 is not None

    # Set the tenant ID header for future requests
    headers[TENANT_ID_HEADER] = tenant2_short_name

    rv = client.post('/api/surveys/', data=json.dumps(TestSurveyInfo.survey3),
                     headers=headers, content_type=ContentType.JSON.value)
    assert rv.status_code == 200
    assert rv.json.get('form_json') == survey_info.get('form_json')
    survey_tenant_id = rv.json.get('tenant_id')
    assert survey_tenant_id == str(tenant_2.id)


@pytest.mark.parametrize('survey_info', [TestSurveyInfo.survey2])
def test_put_survey(client, jwt, session, survey_info):  # pylint:disable=unused-argument
    """Assert that an survey can be POSTed."""
    headers = factory_auth_header(jwt=jwt, claims=TestJwtClaims.staff_admin_role)
    survey = factory_survey_model()
    survey_id = str(survey.id)
    new_survey_name = 'new_survey_name'
    rv = client.put('/api/surveys/', data=json.dumps({'id': survey_id, 'name': new_survey_name}),
                    headers=headers, content_type=ContentType.JSON.value)

    assert rv.status_code == 200

    rv = client.get(f'/api/surveys/{survey_id}',
                    headers=headers, content_type=ContentType.JSON.value)
    assert rv.status_code == 200
    assert rv.json.get('form_json') == survey_info.get('form_json')
    assert rv.json.get('name') == new_survey_name


def test_survey_link(client, jwt, session):  # pylint:disable=unused-argument
    """Assert that an survey can be POSTed."""
    survey = factory_survey_model()
    survey_id = survey.id
    headers = factory_auth_header(jwt=jwt, claims=TestJwtClaims.no_role)

    eng = factory_engagement_model()
    eng_id = eng.id

    # assert eng id is none in GET Survey

    rv = client.get(f'/api/surveys/{survey_id}',
                    headers=headers, content_type=ContentType.JSON.value)

    assert rv.json.get('engagement_id') is None
    # link them togother
    rv = client.put(f'/api/surveys/{survey_id}/link/engagement/{eng_id}',
                    headers=headers, content_type=ContentType.JSON.value)

    rv = client.get(f'/api/surveys/{survey_id}',
                    headers=headers, content_type=ContentType.JSON.value)

    assert rv.json.get('engagement_id') == str(eng_id)


@pytest.mark.parametrize('survey_info', [TestSurveyInfo.survey3])
def test_get_hidden_survey_for_admins(client, jwt, session, survey_info):  # pylint:disable=unused-argument
    """Assert that a hidden survey can be fetched by admins."""
    headers = factory_auth_header(jwt=jwt, claims=TestJwtClaims.staff_admin_role)
    survey = factory_hidden_survey_model()
    survey_id = str(survey.id)
    new_survey_name = 'new_survey_name'
    rv = client.put('/api/surveys/', data=json.dumps({'id': survey_id, 'name': new_survey_name}),
                    headers=headers, content_type=ContentType.JSON.value)

    assert rv.status_code == 200

    page = 1
    page_size = 10
    sort_key = 'survey.created_date'
    sort_order = 'desc'

    rv = client.get(f'/api/surveys/?page={page}&size={page_size}&sort_key={sort_key}\
                    &sort_order={sort_order}&search_text=',
                    data=json.dumps(survey_info),
                    headers=headers, content_type=ContentType.JSON.value)
    assert rv.status_code == 200
    assert rv.json.get('total') == 1


@pytest.mark.parametrize('survey_info', [TestSurveyInfo.survey3])
def test_get_hidden_survey_for_team_member(client, jwt, session, survey_info):  # pylint:disable=unused-argument
    """Assert that a hidden survey cannot be fetched by team members."""
    headers = factory_auth_header(jwt=jwt, claims=TestJwtClaims.team_member_role)
    survey = factory_hidden_survey_model()
    survey_id = str(survey.id)
    new_survey_name = 'new_survey_name'
    rv = client.put('/api/surveys/', data=json.dumps({'id': survey_id, 'name': new_survey_name}),
                    headers=headers, content_type=ContentType.JSON.value)

    assert rv.status_code == 200

    page = 1
    page_size = 10
    sort_key = 'survey.created_date'
    sort_order = 'desc'

    rv = client.get(f'/api/surveys/?page={page}&size={page_size}&sort_key={sort_key}\
                    &sort_order={sort_order}&search_text=',
                    data=json.dumps(survey_info),
                    headers=headers, content_type=ContentType.JSON.value)
    assert rv.status_code == 200
    assert rv.json.get('total') == 0


@pytest.mark.parametrize('survey_info', [TestSurveyInfo.survey4])
def test_get_template_survey(client, jwt, session, survey_info):  # pylint:disable=unused-argument
    """Assert that a hidden survey cannot be fetched by team members."""
    headers = factory_auth_header(jwt=jwt, claims=TestJwtClaims.staff_admin_role)
    survey = factory_template_survey_model()
    survey_id = str(survey.id)
    new_survey_name = 'new_survey_name'
    rv = client.put('/api/surveys/', data=json.dumps({'id': survey_id, 'name': new_survey_name}),
                    headers=headers, content_type=ContentType.JSON.value)

    assert rv.status_code == 200

    page = 1
    page_size = 10
    sort_key = 'survey.created_date'
    sort_order = 'desc'

    rv = client.get(f'/api/surveys/?page={page}&size={page_size}&sort_key={sort_key}\
                    &sort_order={sort_order}&search_text=',
                    data=json.dumps(survey_info),
                    headers=headers, content_type=ContentType.JSON.value)
    assert rv.status_code == 200
    assert rv.json.get('total') == 1


@pytest.mark.parametrize('survey_info', [TestSurveyInfo.survey4])
def test_edit_template_survey_for_admins(client, jwt, session, survey_info):  # pylint:disable=unused-argument
    """Assert that a hidden survey cannot be fetched by team members."""
    headers = factory_auth_header(jwt=jwt, claims=TestJwtClaims.staff_admin_role)
    survey = factory_template_survey_model()
    survey_id = str(survey.id)
    new_survey_name = 'new_survey_name'
    rv = client.put('/api/surveys/', data=json.dumps({'id': survey_id, 'name': new_survey_name}),
                    headers=headers, content_type=ContentType.JSON.value)

    assert rv.status_code == 200, 'Admins are able to edit template surveys'


@pytest.mark.parametrize('survey_info', [TestSurveyInfo.survey4])
def test_edit_template_survey_for_team_member(client, jwt, session, survey_info):  # pylint:disable=unused-argument
    """Assert that a hidden survey cannot be fetched by team members."""
    headers = factory_auth_header(jwt=jwt, claims=TestJwtClaims.team_member_role)
    survey = factory_template_survey_model()
    survey_id = str(survey.id)
    new_survey_name = 'new_survey_name'
    rv = client.put('/api/surveys/', data=json.dumps({'id': survey_id, 'name': new_survey_name}),
                    headers=headers, content_type=ContentType.JSON.value)

    assert rv.status_code == 403, 'Team members are not able to edit template surveys, so throws exception.'
