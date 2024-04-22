"""Tests for the EngagementContentTranslationService."""

from met_api.services.engagement_content_translation_service import EngagementContentTranslationService
from tests.utilities.factory_scenarios import TestEngagementContentTranslationInfo, TestJwtClaims
from tests.utilities.factory_utils import (
    engagement_content_model_with_language, factory_engagement_content_translation_model, factory_staff_user_model,
    factory_user_group_membership_model, patch_token_info, set_global_tenant)


def test_get_engagement_content_translation_by_id(session):
    """Assert that engagement content translation can be fetched by its ID."""
    engagement_content, language = engagement_content_model_with_language()
    translation = factory_engagement_content_translation_model(
        {
            **TestEngagementContentTranslationInfo.translation_info1.value,
            'engagement_content_id': engagement_content.id,
            'language_id': language.id,
        }
    )
    session.commit()

    fetched_translation = EngagementContentTranslationService.get_engagement_content_translation_by_id(translation.id)
    assert fetched_translation is not None
    assert fetched_translation['id'] == translation.id


def test_get_translations_by_content_and_language(session):
    """Assert that engagement content translations can be fetched by content and language."""
    engagement_content, language = engagement_content_model_with_language()
    factory_engagement_content_translation_model(
        {
            **TestEngagementContentTranslationInfo.translation_info1.value,
            'engagement_content_id': engagement_content.id,
            'language_id': language.id,
        }
    )
    session.commit()

    translations = EngagementContentTranslationService.get_translations_by_content_and_language(
        engagement_content.id, language.id
    )
    assert len(translations) == 1
    title = translations[0]['content_title']
    assert title == TestEngagementContentTranslationInfo.translation_info1.value['content_title']


def test_create_engagement_content_translation_without_prepopulate(session, monkeypatch):
    """Assert that an engagement content translation can be created with proper authorization."""
    # Mock authorization
    patch_token_info(TestJwtClaims.staff_admin_role, monkeypatch)
    set_global_tenant()
    user = factory_staff_user_model(external_id=TestJwtClaims.staff_admin_role['sub'])
    factory_user_group_membership_model(str(user.external_id), user.tenant_id)
    engagement_content, language = engagement_content_model_with_language()
    data = {
        **TestEngagementContentTranslationInfo.translation_info1.value,
        'engagement_content_id': engagement_content.id,
        'language_id': language.id,
    }

    created_translation = EngagementContentTranslationService.create_engagement_content_translation(data, False)
    assert created_translation is not None
    assert created_translation['content_title'] == data['content_title']


def test_create_engagement_content_translation_with_prepopulate(session, monkeypatch):
    """Assert that an engagement content translation can be created with proper authorization."""
    # Mock authorization
    patch_token_info(TestJwtClaims.staff_admin_role, monkeypatch)
    set_global_tenant()
    user = factory_staff_user_model(external_id=TestJwtClaims.staff_admin_role['sub'])
    factory_user_group_membership_model(str(user.external_id), user.tenant_id)
    engagement_content, language = engagement_content_model_with_language()
    data = {
        **TestEngagementContentTranslationInfo.translation_info1.value,
        'engagement_content_id': engagement_content.id,
        'language_id': language.id,
    }

    created_translation = EngagementContentTranslationService.create_engagement_content_translation(data, True)
    assert created_translation is not None
    assert created_translation['content_title'] == data['content_title']


def test_update_engagement_content_translation_with_authorization(session, monkeypatch):
    """Assert that an engagement content translation can be updated with proper authorization."""
    # Mock authorization
    patch_token_info(TestJwtClaims.staff_admin_role, monkeypatch)
    set_global_tenant()
    user = factory_staff_user_model(external_id=TestJwtClaims.staff_admin_role['sub'])
    factory_user_group_membership_model(str(user.external_id), user.tenant_id)
    engagement_content, language = engagement_content_model_with_language()
    translation = factory_engagement_content_translation_model(
        {
            **TestEngagementContentTranslationInfo.translation_info1.value,
            'engagement_content_id': engagement_content.id,
            'language_id': language.id,
        }
    )
    session.commit()

    updated_data = {'content_title': 'Updated Title'}
    updated_translation = EngagementContentTranslationService.update_engagement_content_translation(
        translation.id, updated_data
    )
    assert updated_translation['content_title'] == updated_data['content_title']


def test_delete_engagement_content_translation_with_authorization(session, monkeypatch):
    """Assert that an engagement content translation can be deleted with proper authorization."""
    # Mock authorization
    patch_token_info(TestJwtClaims.staff_admin_role, monkeypatch)
    set_global_tenant()
    user = factory_staff_user_model(external_id=TestJwtClaims.staff_admin_role['sub'])
    factory_user_group_membership_model(str(user.external_id), user.tenant_id)
    engagement_content, language = engagement_content_model_with_language()
    translation = factory_engagement_content_translation_model(
        {
            **TestEngagementContentTranslationInfo.translation_info1.value,
            'engagement_content_id': engagement_content.id,
            'language_id': language.id,
        }
    )
    session.commit()

    deleted_translation = EngagementContentTranslationService.delete_engagement_content_translation(translation.id)
    assert deleted_translation is True
