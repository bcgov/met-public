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
from faker import Faker

from met_api.constants.engagement_status import EngagementDisplayStatus, SubmissionStatus
from met_api.utils.enums import ContentType
from tests.utilities.factory_scenarios import TestEngagementInfo, TestJwtClaims
from tests.utilities.factory_utils import factory_auth_header, factory_engagement_model

fake = Faker()


@pytest.mark.parametrize('engagement_info', [TestEngagementInfo.engagement1])
def test_add_engagements(client, jwt, session, engagement_info):  # pylint:disable=unused-argument
    """Assert that an engagement can be POSTed."""
    headers = factory_auth_header(jwt=jwt, claims=TestJwtClaims.staff_admin_role)
    rv = client.post('/api/engagements/', data=json.dumps(engagement_info),
                     headers=headers, content_type=ContentType.JSON.value)
    assert rv.status_code == 200


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
