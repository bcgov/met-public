import json
import pytest
from faker import Faker
from http import HTTPStatus

from met_api.utils.enums import ContentType
from met_api.constants.engagement_status import Status
from tests.utilities.factory_scenarios import TestUserInfo, TestEngagementSlugInfo, TestJwtClaims
from tests.utilities.factory_utils import factory_engagement_model, factory_auth_header, factory_engagement_slug_model

fake = Faker()

# Test valid get request for engagement_slug
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

# Test valid get request for engagement_slug
@pytest.mark.parametrize('engagement_slug_info', [TestEngagementSlugInfo.slug1])
def test_get_engagement_slug_by_engagement_id(client, jwt, session, engagement_slug_info):
    """Test get request for engagement_slug endpoint."""
    eng = factory_engagement_model()
    engagement_slug_info = {
        **engagement_slug_info,
        'engagement_id': eng.id
    }
    eng_slug = factory_engagement_slug_model(engagement_slug_info)
    headers = factory_auth_header(jwt=jwt, claims=TestUserInfo.user)
    rv = client.get(f'/api/slugs/engagements/{eng.id}', headers=headers, content_type=ContentType.JSON.value)
    assert rv.status_code == HTTPStatus.OK
    assert rv.json.get('slug') == eng_slug.slug
    assert rv.json.get('engagement_id') == eng_slug.engagement_id

# Test invalid get request for non-existent engagement_slug
def test_get_nonexistent_engagement_slug(client, jwt, session):
    """Test get request for non-existent engagement_slug endpoint."""
    headers = factory_auth_header(jwt=jwt, claims=TestUserInfo.user)
    rv = client.get('/api/slugs/nonexistent-slug', headers=headers, content_type=ContentType.JSON.value)
    assert rv.status_code == HTTPStatus.BAD_REQUEST

# Test valid patch request for engagement_slug
@pytest.mark.parametrize('engagement_slug_info', [TestEngagementSlugInfo.slug1])
def test_patch_engagement_slug(client, jwt, session, engagement_slug_info):
    """Test patch request for engagement_slug endpoint."""
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
    headers = factory_auth_header(jwt=jwt, claims=TestJwtClaims.staff_admin_role)
    rv = client.patch(f'/api/slugs/{updated_slug}', data=json.dumps(patch_data),
                      headers=headers, content_type=ContentType.JSON.value)
    assert rv.status_code == HTTPStatus.OK

# Test invalid patch request for non-existent engagement_slug
def test_patch_create_nonexistent_engagement_slug(client, jwt, session):
    """Test patch request for non-existent engagement_slug endpoint."""
    eng = factory_engagement_model(status=Status.Draft)
    updated_slug = fake.text(max_nb_chars=20)
    patch_data = {
        'slug': updated_slug,
        'engagement_id': eng.id
    }
    headers = factory_auth_header(jwt=jwt, claims=TestJwtClaims.staff_admin_role)
    rv = client.patch(f'/api/slugs/{updated_slug}', data=json.dumps(patch_data),
                      headers=headers, content_type=ContentType.JSON.value)
    assert rv.status_code == HTTPStatus.OK

# Test unauthorized patch request for engagement_slug
@pytest.mark.parametrize('engagement_slug_info', [TestEngagementSlugInfo.slug1])
def test_patch_unauthorized_engagement_slug(client, jwt, session, engagement_slug_info):
    """Test unauthorized patch request for engagement_slug endpoint."""
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
    headers = factory_auth_header(jwt=jwt, claims=TestUserInfo.user_staff_1)
    rv = client.patch(f'/api/slugs/{updated_slug}', data=json.dumps(patch_data),
                      headers=headers, content_type=ContentType.JSON.value)
    assert rv.status_code == HTTPStatus.UNAUTHORIZED
