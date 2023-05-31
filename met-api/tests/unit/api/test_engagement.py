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
import copy
import json

import pytest
from faker import Faker
from flask import current_app

from met_api.constants.engagement_status import EngagementDisplayStatus, SubmissionStatus
from met_api.models.tenant import Tenant as TenantModel
from met_api.utils.constants import TENANT_ID_HEADER
from met_api.utils.enums import ContentType
from tests.utilities.factory_scenarios import (
    TestEngagementInfo, TestJwtClaims, TestSubmissionInfo, TestTenantInfo, TestUserInfo)
from tests.utilities.factory_utils import (
    factory_auth_header, factory_engagement_model, factory_membership_model, factory_public_user_model,
    factory_staff_user_model, factory_submission_model, factory_survey_and_eng_model, factory_tenant_model)

fake = Faker()


@pytest.mark.parametrize('engagement_info', [TestEngagementInfo.engagement1])
def test_add_engagements(client, jwt, session, engagement_info):  # pylint:disable=unused-argument
    """Assert that an engagement can be POSTed."""
    headers = factory_auth_header(jwt=jwt, claims=TestJwtClaims.staff_admin_role)
    rv = client.post('/api/engagements/', data=json.dumps(engagement_info),
                     headers=headers, content_type=ContentType.JSON.value)
    assert rv.status_code == 200


def test_tenant_id_in_create_engagements(client, jwt, session):  # pylint:disable=unused-argument
    """Assert that an engagement can be POSTed with tenant id."""
    headers = factory_auth_header(jwt=jwt, claims=TestJwtClaims.staff_admin_role)
    tenant_short_name = current_app.config.get('DEFAULT_TENANT_SHORT_NAME')
    tenant = TenantModel.find_by_short_name(tenant_short_name)
    assert tenant is not None
    headers[TENANT_ID_HEADER] = tenant_short_name
    rv = client.post('/api/engagements/', data=json.dumps(TestEngagementInfo.engagement1),
                     headers=headers, content_type=ContentType.JSON.value)
    assert rv.status_code == 200
    engagament_tenant_id = rv.json.get('tenant_id')
    assert engagament_tenant_id == str(tenant.id)

    # Create a tenant
    tenant_data = TestTenantInfo.tenant1
    factory_tenant_model(tenant_data)
    tenant2_short_name = tenant_data['short_name']
    tenant_2 = TenantModel.find_by_short_name(tenant2_short_name)

    # Verify that the tenant was created successfully
    assert tenant_2 is not None

    # Set the tenant ID header for future requests
    headers[TENANT_ID_HEADER] = tenant2_short_name

    # Create an engagement for the tenant
    engagement_data = TestEngagementInfo.engagement2
    response = client.post('/api/engagements/',
                           data=json.dumps(engagement_data),
                           headers=headers,
                           content_type=ContentType.JSON.value)

    # Verify that the engagement was created successfully
    assert response.status_code == 200
    assert response.json['tenant_id'] == str(tenant_2.id)


@pytest.mark.parametrize('role', [TestJwtClaims.no_role, TestJwtClaims.public_user_role])
def test_add_engagements_invalid(client, jwt, session, role):  # pylint:disable=unused-argument
    """Assert that an engagement can not be POSTed without authorisaiton."""
    headers = factory_auth_header(jwt=jwt, claims=role)
    rv = client.post('/api/engagements/', data=json.dumps(TestEngagementInfo.engagement1),
                     headers=headers, content_type=ContentType.JSON.value)
    assert rv.status_code == 401


@pytest.mark.parametrize('engagement_info', [TestEngagementInfo.engagement1])
def test_get_engagements(client, jwt, session, engagement_info):  # pylint:disable=unused-argument
    """Assert that an engagement can be POSTed."""
    headers = factory_auth_header(jwt=jwt, claims=TestJwtClaims.staff_admin_role)
    rv = client.post('/api/engagements/', data=json.dumps(engagement_info),
                     headers=headers, content_type=ContentType.JSON.value)
    assert rv.status_code == 200
    created_eng = rv.json

    rv = client.get(f'/api/engagements/{created_eng.get("id")}', data=json.dumps(engagement_info),
                    headers=headers, content_type=ContentType.JSON.value)

    assert created_eng.get('name') == rv.json.get('name')
    assert created_eng.get('content') == rv.json.get('content')


@pytest.mark.parametrize('engagement_info', [TestEngagementInfo.engagement1])
def test_search_engagements_by_status(client, jwt,
                                      session, engagement_info):  # pylint:disable=unused-argument
    """Assert that an engagement can be fetched by filtering using the engagement status."""
    headers = factory_auth_header(jwt=jwt, claims=TestJwtClaims.staff_admin_role)
    rv = client.post('/api/engagements/', data=json.dumps(engagement_info),
                     headers=headers, content_type=ContentType.JSON.value)
    assert rv.status_code == 200

    page = 1
    page_size = 10
    sort_key = 'engagement.created_date'
    sort_order = 'desc'
    engagement_status = EngagementDisplayStatus.Open.value

    rv = client.get(f'/api/engagements/?page={page}&size={page_size}&sort_key={sort_key}\
                    &sort_order={sort_order}&engagement_status={[engagement_status]}',
                    data=json.dumps(engagement_info),
                    headers=headers, content_type=ContentType.JSON.value)

    assert rv.json.get('total') == 1


def test_search_engagements_not_logged_in(client, session):  # pylint:disable=unused-argument
    """Assert that an engagement can be fetched without JWT Token."""
    factory_engagement_model()

    rv = client.get('/api/engagements/', content_type=ContentType.JSON.value)
    assert rv.json.get('total') == 1, 'its visible for public user wit no tenant information'
    assert rv.status_code == 200

    tenant_header = {TENANT_ID_HEADER: current_app.config.get('DEFAULT_TENANT_SHORT_NAME')}
    rv = client.get('/api/engagements/', headers=tenant_header, content_type=ContentType.JSON.value)
    assert rv.json.get('total') == 0, 'Tenant based fetching.So dont return the non-tenant info.'
    assert rv.status_code == 200

    factory_engagement_model(TestEngagementInfo.engagement3)
    rv = client.get('/api/engagements/', content_type=ContentType.JSON.value)
    assert rv.json.get('total') == 2, 'Both of the engagaments should visible for public user wit no tenant information'
    assert rv.status_code == 200

    tenant_header = {TENANT_ID_HEADER: current_app.config.get('DEFAULT_TENANT_SHORT_NAME')}
    rv = client.get('/api/engagements/', headers=tenant_header, content_type=ContentType.JSON.value)
    assert rv.json.get('total') == 1, 'Tenant based fetching.So dont return the non-tenant info.'
    assert rv.status_code == 200


@pytest.mark.parametrize('engagement_info', [TestEngagementInfo.engagement1])
def test_patch_engagement(client, jwt, session, engagement_info):  # pylint:disable=unused-argument
    """Assert that an engagement can be updated."""
    headers = factory_auth_header(jwt=jwt, claims=TestJwtClaims.staff_admin_role)
    engagement = factory_engagement_model()
    engagement_id = str(engagement.id)

    engagement_edits = {
        'id': engagement_id,
        'name': fake.name(),
        'start_date': fake.date(),
        'end_date': fake.date(),
        'description': fake.text(),
        'content': fake.text(),
        'created_date': fake.date(),
    }

    rv = client.patch('/api/engagements/', data=json.dumps(engagement_edits),
                      headers=headers, content_type=ContentType.JSON.value)

    assert rv.status_code == 200

    rv = client.get(f'/api/engagements/{engagement_id}',
                    headers=headers, content_type=ContentType.JSON.value)
    assert rv.status_code == 200
    assert rv.json.get('name') == engagement_edits.get('name')
    assert engagement_edits.get('start_date') in rv.json.get('start_date')
    assert engagement_edits.get('end_date') in rv.json.get('end_date')
    assert rv.json.get('description') == engagement_edits.get('description')
    assert rv.json.get('content') == engagement_edits.get('content')
    assert engagement_edits.get('created_date') in rv.json.get('created_date')


def test_patch_engagement_by_member(client, jwt, session):  # pylint:disable=unused-argument
    """Assert that an engagement can be updated."""
    engagement = factory_engagement_model()
    engagement_id = str(engagement.id)

    engagement_edits = {
        'id': engagement_id,
        'name': fake.name(),
        'start_date': fake.date(),
        'end_date': fake.date(),
        'description': fake.text(),
        'content': fake.text(),
        'created_date': fake.date(),
    }

    staff_1 = dict(TestUserInfo.user_staff_1)
    user = factory_staff_user_model(user_info=staff_1)
    claims = copy.deepcopy(TestJwtClaims.public_user_role.value)
    claims['sub'] = str(user.external_id)
    headers = factory_auth_header(jwt=jwt, claims=claims)

    rv = client.patch('/api/engagements/', data=json.dumps(engagement_edits),
                      headers=headers, content_type=ContentType.JSON.value)

    assert rv.status_code == 403, 'Not a team member.So throws exception.'

    factory_membership_model(user_id=user.id, engagement_id=engagement_id)

    rv = client.patch('/api/engagements/', data=json.dumps(engagement_edits),
                      headers=headers, content_type=ContentType.JSON.value)

    assert rv.status_code == 200, 'Added as team member.So throws exception.'

    rv = client.get(f'/api/engagements/{engagement_id}',
                    headers=headers, content_type=ContentType.JSON.value)
    assert rv.status_code == 200
    assert rv.json.get('name') == engagement_edits.get('name')


def test_patch_new_survey_block_engagement(client, jwt, session):  # pylint:disable=unused-argument
    """Assert that an engagement's survey status blocks can be updated."""
    headers = factory_auth_header(jwt=jwt, claims=TestJwtClaims.staff_admin_role)
    engagement = factory_engagement_model()
    engagement_id = str(engagement.id)

    engagement_edits = {
        'id': engagement_id,
        'status_block': [{
            'block_text': '{"foo":"bar"}',
            'survey_status': SubmissionStatus.Upcoming.name,
        }]}
    rv = client.patch('/api/engagements/', data=json.dumps(engagement_edits),
                      headers=headers, content_type=ContentType.JSON.value)

    assert rv.status_code == 200

    rv = client.get(f'/api/engagements/{engagement_id}',
                    headers=headers, content_type=ContentType.JSON.value)
    assert rv.status_code == 200
    actual_status_blocks = rv.json.get('status_block')
    assert len(actual_status_blocks) == 1
    assert actual_status_blocks[0].get('block_text') == engagement_edits.get('status_block')[0].get('block_text')
    assert actual_status_blocks[0].get('survey_status') == engagement_edits.get('status_block')[0].get('survey_status')


def test_update_survey_block_engagement(client, jwt, session):  # pylint:disable=unused-argument
    """Assert that an engagement's survey status blocks can be updated."""
    headers = factory_auth_header(jwt=jwt, claims=TestJwtClaims.staff_admin_role)
    engagement = factory_engagement_model(TestEngagementInfo.engagement2)
    engagement_id = str(engagement.id)

    block_text_for_upcoming = '{"foo1":"bar1"}'
    engagement_edits = {
        'id': engagement_id,
        'status_block': [{
            'block_text': block_text_for_upcoming,
            'survey_status': SubmissionStatus.Closed.name,
        }, {
            'block_text': '{"foo2":"bar2"}',
            'survey_status': SubmissionStatus.Open.name,
        }]}
    rv = client.patch('/api/engagements/', data=json.dumps(engagement_edits),
                      headers=headers, content_type=ContentType.JSON.value)

    assert rv.status_code == 200

    rv = client.get(f'/api/engagements/{engagement_id}',
                    headers=headers, content_type=ContentType.JSON.value)
    assert rv.status_code == 200
    actual_status_blocks = rv.json.get('status_block')
    assert len(actual_status_blocks) == 2
    upcoming_block = next(x for x in actual_status_blocks if x.get('survey_status') == SubmissionStatus.Closed.name)
    assert upcoming_block.get('block_text') == block_text_for_upcoming


@pytest.mark.parametrize('engagement_info', [TestEngagementInfo.engagement1])
def test_count_submissions(client, jwt, session, engagement_info):  # pylint:disable=unused-argument
    """Assert that an engagement can be POSTed."""
    headers = factory_auth_header(jwt=jwt, claims=TestJwtClaims.staff_admin_role)
    factory_staff_user_model(TestJwtClaims.public_user_role.get('sub'))
    user_details = factory_public_user_model()
    survey, eng = factory_survey_and_eng_model()
    factory_submission_model(
        survey.id, eng.id, user_details.id, TestSubmissionInfo.approved_submission)
    factory_submission_model(
        survey.id, eng.id, user_details.id, TestSubmissionInfo.rejected_submission)
    factory_submission_model(
        survey.id, eng.id, user_details.id, TestSubmissionInfo.needs_further_review_submission)
    factory_submission_model(
        survey.id, eng.id, user_details.id, TestSubmissionInfo.pending_submission)

    rv = client.get(f'/api/engagements/{eng.id}', data=json.dumps(engagement_info),
                    headers=headers, content_type=ContentType.JSON.value)

    submission_meta_data = rv.json.get('submissions_meta_data', {})
    assert submission_meta_data.get('total', 0) == 4
    assert submission_meta_data.get('approved', 0) == 1
    assert submission_meta_data.get('pending', 0) == 1
    assert submission_meta_data.get('needs_further_review', 0) == 1
