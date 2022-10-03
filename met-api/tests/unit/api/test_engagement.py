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

from tests.utilities.factory_scenarios import TestEngagementInfo, TestJwtClaims
from tests.utilities.factory_utils import factory_auth_header, factory_engagement_model


@pytest.mark.parametrize('engagement_info', [TestEngagementInfo.engagement1])
def test_add_engagements(client, jwt, session, engagement_info):  # pylint:disable=unused-argument
    """Assert that an engagement can be POSTed."""
    headers = factory_auth_header(jwt=jwt, claims=TestJwtClaims.no_role)
    rv = client.post('/api/engagements/', data=json.dumps(engagement_info),
                     headers=headers, content_type='application/json')
    assert rv.status_code == 200
    assert rv.json.get('status') is True


@pytest.mark.parametrize('engagement_info', [TestEngagementInfo.engagement1])
def test_get_engagements(client, jwt, session, engagement_info):  # pylint:disable=unused-argument
    """Assert that an engagement can be POSTed."""
    headers = factory_auth_header(jwt=jwt, claims=TestJwtClaims.no_role)
    rv = client.post('/api/engagements/', data=json.dumps(engagement_info),
                     headers=headers, content_type='application/json')
    assert rv.status_code == 200
    assert rv.json.get('status') is True
    created_eng = rv.json

    rv = client.get(f'/api/engagements/{created_eng.get("id")}', data=json.dumps(engagement_info),
                    headers=headers, content_type='application/json')

    assert created_eng.get('result').get('name') == rv.json.get('result').get('name')
    assert created_eng.get('result').get('content') == rv.json.get('result').get('content')


@pytest.mark.parametrize('engagement_info', [TestEngagementInfo.engagement1])
def test_patch_engagement(client, jwt, session, engagement_info):  # pylint:disable=unused-argument
    """Assert that an survey can be POSTed."""
    headers = factory_auth_header(jwt=jwt, claims=TestJwtClaims.no_role)
    engagement = factory_engagement_model()
    engagement_id = str(engagement.id)
    new_engagement_name = 'new_engagement_name'
    rv = client.patch('/api/engagements/', data=json.dumps({'id': engagement_id, 'name': new_engagement_name}),
                      headers=headers, content_type='application/json')

    assert rv.status_code == 200

    rv = client.get(f'/api/engagements/{engagement_id}',
                    headers=headers, content_type='application/json')
    assert rv.status_code == 200
    assert rv.json.get('status') is True
    assert rv.json.get('result').get('form_json') == engagement_info.get('form_json')
    assert rv.json.get('result').get('name') == new_engagement_name
