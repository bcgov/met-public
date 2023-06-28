import pytest
from faker import Faker

from met_api.constants.engagement_status import Status
from met_api.services.engagement_slug_service import EngagementSlugService
from tests.utilities.factory_utils import factory_engagement_model, factory_engagement_slug_model
from tests.utilities.factory_scenarios import TestEngagementInfo, TestEngagementSlugInfo

fake = Faker()


def test_get_engagement_slug(session):
    """Test get request for engagement slug."""
    eng = factory_engagement_model(status=Status.Draft)
    eng_slug_info = {
        **TestEngagementSlugInfo.slug1,
        'engagement_id': eng.id,
    }
    eng_slug = factory_engagement_slug_model(eng_slug_info)
    result = EngagementSlugService.get_engagement_slug(eng_slug.slug)
    assert result == {
        'slug': eng_slug.slug,
        'engagement_id': eng.id
    }


def test_get_engagement_slug_by_engagement_id(session):
    """Test get request for engagement slug by engagement id."""
    eng = factory_engagement_model(status=Status.Draft)
    eng_slug_info = {
        **TestEngagementSlugInfo.slug1,
        'engagement_id': eng.id,
    }
    factory_engagement_slug_model(eng_slug_info)

    result = EngagementSlugService.get_engagement_slug_by_engagement_id(eng.id)

    assert result == {
        'slug': eng_slug_info['slug'],
        'engagement_id': eng.id
    }


def test_create_engagement_slug(session):
    """Test create engagement slug."""
    engagement = factory_engagement_model(status=Status.Draft)
    result = EngagementSlugService.create_engagement_slug(engagement.id)
    assert result.get('engagement_id') == engagement.id
    assert result.get('slug') not in [None, '']


def test_create_engagement_slug_existing_slug(session):
    """Test create engagement slug with existing slug."""
    engagement_1 = factory_engagement_model(TestEngagementInfo.engagement1, status=Status.Draft, name='Test Engagement')

    eng_slug = EngagementSlugService.create_engagement_slug(engagement_1.id)
    slug_1 = eng_slug.get('slug')

    engagement_2 = factory_engagement_model(TestEngagementInfo.engagement1, status=Status.Draft, name='Test Engagement')

    result = EngagementSlugService.create_engagement_slug(engagement_2.id)

    assert engagement_1.name == engagement_2.name
    assert result == {
        'slug': f'{slug_1}-1',
        'engagement_id': engagement_2.id
    }


def test_generate_unique_slug_no_similar_slugs(session):
    """Test generate unique slug with no similar slugs."""
    text = 'Test Slug'
    slug = 'test-slug'

    result = EngagementSlugService.generate_unique_slug(text)

    assert result == slug


def test_generate_unique_slug_with_similar_slugs(session):
    """Test generate unique slug with similar slugs."""
    engagement_1 = factory_engagement_model(status=Status.Draft)
    engagement_2 = factory_engagement_model(status=Status.Draft)

    text = 'Test Slug'
    factory_engagement_slug_model({
        'slug': 'test-slug-1',
        'engagement_id': engagement_1.id
    })

    factory_engagement_slug_model({
        'slug': 'test-slug-2',
        'engagement_id': engagement_2.id
    })

    unique_slug = 'test-slug-3'

    result = EngagementSlugService.generate_unique_slug(text)

    assert result == unique_slug


def test_update_engagement_slug(session):
    """Test update engagement slug with no existing slug."""
    engagement_1 = factory_engagement_model(status=Status.Draft)

    slug = 'test-slug'
    result = EngagementSlugService.update_engagement_slug(slug, engagement_1.id)

    assert result == {
        'slug': slug,
        'engagement_id': engagement_1.id
    }


def test_update_engagement_slug_existing_slug(session):
    """Test update engagement slug with existing slug."""
    engagement_1 = factory_engagement_model(status=Status.Draft)

    slug = 'existing-slug'
    existing_slug_info = {
        'slug': slug,
        'engagement_id': engagement_1.id,
    }
    factory_engagement_slug_model(existing_slug_info)

    new_slug = 'new-slug'
    result = EngagementSlugService.update_engagement_slug(new_slug, engagement_1.id)

    assert result == {
        'slug': new_slug,
        'engagement_id': engagement_1.id
    }


def test_verify_engagement_existing_engagement(session):
    """Test verify engagement with existing engagement."""
    engagement = factory_engagement_model(status=Status.Draft)

    result = EngagementSlugService._verify_engagement(engagement.id)

    assert result == engagement


def test_verify_engagement_non_existent_engagement(session):
    """Test verify engagement with non-existent engagement."""
    engagement_id = 1

    with pytest.raises(ValueError):
        EngagementSlugService._verify_engagement(engagement_id)


def test_verify_engagement_non_draft_status(session):
    """Test verify engagement with non-draft status."""
    engagement = factory_engagement_model(status=Status.Published)

    with pytest.raises(ValueError):
        EngagementSlugService._verify_engagement(engagement.id)
