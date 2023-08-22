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
from http import HTTPStatus

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
    factory_auth_header, factory_engagement_model, factory_membership_model, factory_participant_model,
    factory_staff_user_model, factory_submission_model, factory_survey_and_eng_model, factory_tenant_model,
    set_global_tenant)

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


@pytest.mark.parametrize('engagement_info', [TestEngagementInfo.engagement_draft])
def test_get_engagements_reviewer(client, jwt, session, engagement_info):  # pylint:disable=unused-argument
    """Assert reviewers access on an engagement."""
    headers = factory_auth_header(jwt=jwt, claims=TestJwtClaims.staff_admin_role)
    rv = client.post('/api/engagements/', data=json.dumps(engagement_info),
                     headers=headers, content_type=ContentType.JSON.value)
    assert rv.status_code == HTTPStatus.OK.value
    created_eng = rv.json
    eng_id = created_eng.get('id')
    staff_1 = dict(TestUserInfo.user_staff_1)
    user = factory_staff_user_model(user_info=staff_1)
    claims = copy.deepcopy(TestJwtClaims.reviewer_role.value)
    claims['sub'] = str(user.external_id)
    headers = factory_auth_header(jwt=jwt, claims=claims)
    rv = client.get(f'/api/engagements/{eng_id}',
                    headers=headers, content_type=ContentType.JSON.value)
    assert rv.status_code == HTTPStatus.FORBIDDEN.value

    factory_membership_model(user_id=user.id, engagement_id=eng_id, member_type='REVIEWER')

    # Reveiwer has access to draft engagement if he is assigned
    rv = client.get(f'/api/engagements/{eng_id}',
                    headers=headers, content_type=ContentType.JSON.value)
    assert rv.status_code == HTTPStatus.OK.value


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


def test_search_engagements(client, jwt, session):  # pylint:disable=unused-argument
    """Verify the functionality of searching engagements with different access levels."""
    similar_engagement_base_name = fake.name()  # Generate a base name for similar engagements
    set_global_tenant()

    similar_engagements = []
    total_similar_engagements = 4

    # Create multiple engagements with similar names for testing search
    for i in range(total_similar_engagements):
        name = f'{similar_engagement_base_name}{i}'  # Append a number to distinguish names
        similar_engagements.append(factory_engagement_model(name=name))

    # Create a dissimilar engagement
    name2 = fake.name()
    eng2 = factory_engagement_model(name=name2)

    total_no_engagements = total_similar_engagements + 1

    # Perform a public search with no parameters to return all engagements
    rv = client.get('/api/engagements/', content_type=ContentType.JSON.value)
    assert rv.json.get('total') == total_no_engagements
    assert rv.status_code == 200

    # Perform a public search for similar engagements
    rv = client.get(f'/api/engagements/?search_text={similar_engagement_base_name}',
                    content_type=ContentType.JSON.value)
    assert rv.json.get('total') == total_similar_engagements

    # Attempt a public user search for team-level access (should not return anything)
    rv = client.get(f'/api/engagements/?search_text={similar_engagement_base_name}&has_team_access=true',
                    content_type=ContentType.JSON.value)
    assert rv.json.get('total') == 0, 'No role, so no results expected'

    # Admin-level searches
    headers = factory_auth_header(jwt=jwt, claims=TestJwtClaims.staff_admin_role)
    rv = client.get(f'/api/engagements/?search_text={similar_engagement_base_name}', headers=headers,
                    content_type=ContentType.JSON.value)
    assert rv.json.get('total') == total_similar_engagements, 'Matching similar names count for admin'

    # Admin searches with team-level access
    rv = client.get(f'/api/engagements/?search_text={similar_engagement_base_name}&has_team_access=true',
                    headers=headers, content_type=ContentType.JSON.value)
    assert rv.json.get(
        'total') == total_similar_engagements, 'Matching similar names count for admin even with team access'

    # Team member level checks
    staff_1 = dict(TestUserInfo.user_staff_1)
    user = factory_staff_user_model(user_info=staff_1)
    claims = copy.deepcopy(TestJwtClaims.team_member_role.value)
    claims['sub'] = str(user.external_id)
    headers = factory_auth_header(jwt=jwt, claims=claims)

    # Team member searches for similar engagements
    rv = client.get(f'/api/engagements/?search_text={similar_engagement_base_name}', headers=headers,
                    content_type=ContentType.JSON.value)
    assert rv.json.get('total') == total_similar_engagements, 'Name search fetches all engagements for team member'

    # Team member with no membership, access should be denied
    rv = client.get(f'/api/engagements/?search_text={similar_engagement_base_name}&has_team_access=true',
                    headers=headers, content_type=ContentType.JSON.value)
    assert rv.json.get('total') == 0, 'Team member with no membership should not fetch any results'

    # Create membership for a specific engagement for the team member
    factory_membership_model(user_id=user.id, engagement_id=similar_engagements[0].id, member_type='TEAM_MEMBER')

    # Team member search with membership, should return the specific engagement
    rv = client.get(f'/api/engagements/?search_text={similar_engagement_base_name}&has_team_access=true',
                    headers=headers, content_type=ContentType.JSON.value)
    assert rv.json.get('total') == 1, 'Name search works for team member with membership'

    # Create membership for a different engagement and search with the base name
    factory_membership_model(user_id=user.id, engagement_id=eng2.id, member_type='TEAM_MEMBER')
    rv = client.get(f'/api/engagements/?search_text={similar_engagement_base_name}&has_team_access=true',
                    headers=headers, content_type=ContentType.JSON.value)
    assert rv.json.get('total') == 1, 'Different name, so returns only base name results.'

    # Create membership for another similar engagement and perform the search
    factory_membership_model(user_id=user.id, engagement_id=similar_engagements[1].id, member_type='TEAM_MEMBER')
    rv = client.get(f'/api/engagements/?search_text={similar_engagement_base_name}&has_team_access=true',
                    headers=headers, content_type=ContentType.JSON.value)
    assert rv.json.get('total') == 2, 'Similar name, team member search fetches multiple results'


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
    participant = factory_participant_model()
    survey, eng = factory_survey_and_eng_model()
    factory_submission_model(
        survey.id, eng.id, participant.id, TestSubmissionInfo.approved_submission)
    factory_submission_model(
        survey.id, eng.id, participant.id, TestSubmissionInfo.rejected_submission)
    factory_submission_model(
        survey.id, eng.id, participant.id, TestSubmissionInfo.needs_further_review_submission)
    factory_submission_model(
        survey.id, eng.id, participant.id, TestSubmissionInfo.pending_submission)

    rv = client.get(f'/api/engagements/{eng.id}', data=json.dumps(engagement_info),
                    headers=headers, content_type=ContentType.JSON.value)

    submission_meta_data = rv.json.get('submissions_meta_data', {})
    assert submission_meta_data.get('total', 0) == 4
    assert submission_meta_data.get('approved', 0) == 1
    assert submission_meta_data.get('pending', 0) == 1
    assert submission_meta_data.get('needs_further_review', 0) == 1
