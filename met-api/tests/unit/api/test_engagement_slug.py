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

"""Tests to verify the Engagement slug API end-point.

Test-Suite to ensure that the /Engagement slug endpoint is working as expected.
"""
import json
from http import HTTPStatus

import pytest
from faker import Faker

from met_api.constants.engagement_status import Status
from met_api.utils.enums import ContentType
from tests.utilities.factory_scenarios import TestEngagementSlugInfo, TestJwtClaims, TestUserInfo
from tests.utilities.factory_utils import factory_auth_header, factory_engagement_model, factory_engagement_slug_model


fake = Faker()


@pytest.mark.parametrize('engagement_slug_info', [TestEngagementSlugInfo.slug1])
def test_get_engagement_slug(client, jwt, session, engagement_slug_info):
    """Test get request for engagement_slug endpoint."""
    eng = factory_engagement_model()
    engagement_slug_info = {
        **engagement_slug_info,
        'engagement_id': eng.id
    }
    eng_slug = factory_engagement_slug_model(engagement_slug_info)
    headers = factory_auth_header(jwt=jwt, claims=TestUserInfo.user)
    rv = client.get(f'/api/slugs/{eng_slug.slug}', headers=headers, content_type=ContentType.JSON.value)
    assert rv.status_code == HTTPStatus.OK
    assert rv.json.get('slug') == eng_slug.slug
    assert rv.json.get('engagement_id') == eng_slug.engagement_id


@pytest.mark.parametrize('engagement_slug_info', [TestEngagementSlugInfo.slug1])
def test_get_engagement_slug_by_engagement_id(client, jwt, session, engagement_slug_info):
    """Test get request for engagement_slug endpoint."""
    eng = factory_engagement_model()
    engagement_slug_info = {
        **engagement_slug_info,
        'engagement_id': eng.id
    }
    eng_slug = factory_engagement_slug_model(engagement_slug_info)
    headers = factory_auth_header(jwt=jwt, claims=TestJwtClaims.team_member_role)
    rv = client.get(f'/api/slugs/engagements/{eng.id}', headers=headers, content_type=ContentType.JSON.value)
    assert rv.status_code == HTTPStatus.OK
    assert rv.json.get('slug') == eng_slug.slug
    assert rv.json.get('engagement_id') == eng_slug.engagement_id


def test_get_nonexistent_engagement_slug(client, jwt, session):
    """Test get request for non-existent engagement_slug endpoint."""
    headers = factory_auth_header(jwt=jwt, claims=TestUserInfo.user)
    rv = client.get('/api/slugs/nonexistent-slug', headers=headers, content_type=ContentType.JSON.value)
    assert rv.status_code == HTTPStatus.BAD_REQUEST


@pytest.mark.parametrize('engagement_slug_info', [TestEngagementSlugInfo.slug1])
def test_patch_engagement_slug(client, jwt, session, engagement_slug_info,
                               setup_admin_user_and_claims):
    """Test patch request for engagement_slug endpoint."""
    user, claims = setup_admin_user_and_claims
    eng = factory_engagement_model(status=Status.Draft)
    engagement_slug_info = {
        **engagement_slug_info,
        'engagement_id': eng.id
    }
    factory_engagement_slug_model(engagement_slug_info)
    updated_slug = fake.text(max_nb_chars=20)
    patch_data = {
        'slug': updated_slug,
        'engagement_id': eng.id
    }
    headers = factory_auth_header(jwt=jwt, claims=claims)
    rv = client.patch(f'/api/slugs/{updated_slug}', data=json.dumps(patch_data),
                      headers=headers, content_type=ContentType.JSON.value)
    assert rv.status_code == HTTPStatus.OK


def test_patch_create_nonexistent_engagement_slug(client, jwt, session,
                                                  setup_admin_user_and_claims):
    """Test patch request for non-existent engagement_slug endpoint."""
    user, claims = setup_admin_user_and_claims
    eng = factory_engagement_model(status=Status.Draft)
    updated_slug = fake.text(max_nb_chars=20)
    patch_data = {
        'slug': updated_slug,
        'engagement_id': eng.id
    }
    headers = factory_auth_header(jwt=jwt, claims=claims)
    rv = client.patch(f'/api/slugs/{updated_slug}', data=json.dumps(patch_data),
                      headers=headers, content_type=ContentType.JSON.value)
    assert rv.status_code == HTTPStatus.OK


@pytest.mark.parametrize('engagement_slug_info', [TestEngagementSlugInfo.slug1])
def test_patch_unauthorized_engagement_slug(client, jwt, session, engagement_slug_info,
                                            setup_unprivileged_user_and_claims):
    """Test unauthorized patch request for engagement_slug endpoint."""
    user, claims = setup_unprivileged_user_and_claims
    eng = factory_engagement_model(status=Status.Draft)
    engagement_slug_info = {
        **engagement_slug_info,
        'engagement_id': eng.id
    }
    factory_engagement_slug_model(engagement_slug_info)
    updated_slug = fake.text(max_nb_chars=20)
    patch_data = {
        'slug': updated_slug,
        'engagement_id': eng.id
    }
    headers = factory_auth_header(jwt=jwt, claims=claims)
    rv = client.patch(f'/api/slugs/{updated_slug}', data=json.dumps(patch_data),
                      headers=headers, content_type=ContentType.JSON.value)
    assert rv.status_code == HTTPStatus.UNAUTHORIZED
