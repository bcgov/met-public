"""Unit tests for SubscribeItemTranslationService."""

from met_api.services.subscribe_item_translation_service import SubscribeItemTranslationService
from tests.utilities.factory_scenarios import TestJwtClaims, TestSubscribeItemTranslationInfo
from tests.utilities.factory_utils import (
    factory_staff_user_model, factory_subscribe_item_translation_model, factory_user_group_membership_model,
    patch_token_info, set_global_tenant, subscribe_item_model_with_language)


def test_get_subscribe_item_translation_by_id(session):
    """Assert that subscribe item translation can be fetched by its ID."""
    subscribe_item, _, language = subscribe_item_model_with_language()
    translation = factory_subscribe_item_translation_model(
        {
            **TestSubscribeItemTranslationInfo.translate_info1.value,
            'subscribe_item_id': subscribe_item.id,
            'language_id': language.id,
        }
    )
    session.commit()

    fetched_translation = SubscribeItemTranslationService.get_by_id(
        translation.id
    )
    assert fetched_translation is not None
    assert fetched_translation.id == translation.id


def test_get_subscribe_item_translation(session):
    """Assert that subscribe item translations can be fetched by item and language."""
    subscribe_item, _, language = subscribe_item_model_with_language()
    factory_subscribe_item_translation_model(
        {
            **TestSubscribeItemTranslationInfo.translate_info1.value,
            'subscribe_item_id': subscribe_item.id,
            'language_id': language.id,
        }
    )
    session.commit()

    translations = SubscribeItemTranslationService.get_subscribe_item_translation(
        subscribe_item.id, language.id
    )
    assert len(translations) == 1
    assert translations[0].description == TestSubscribeItemTranslationInfo.translate_info1.value['description']


def test_create_subscribe_item_translation_with_authorization(
    session, monkeypatch
):
    """Assert that a subscribe item translation can be created with proper authorization."""
    # Mock authorization
    patch_token_info(TestJwtClaims.staff_admin_role, monkeypatch)
    set_global_tenant()
    user = factory_staff_user_model(external_id=TestJwtClaims.staff_admin_role['sub'])
    factory_user_group_membership_model(str(user.external_id), user.tenant_id)
    subscribe_item, widget_subscribe, language = subscribe_item_model_with_language()
    data = {
        **TestSubscribeItemTranslationInfo.translate_info1.value,
        'subscribe_item_id': subscribe_item.id,
        'language_id': language.id,
        'description': 'New Translation',
    }

    created_translation = (
        SubscribeItemTranslationService.create_subscribe_item_translation(
            widget_subscribe.id, data, False
        )
    )
    assert created_translation is not None
    assert created_translation.description == data['description']


def test_create_subscribe_item_translation_with_authorization_with_prepopulate(
    session, monkeypatch
):
    """Assert that a subscribe item translation can be created with proper authorization."""
    # Mock authorization
    patch_token_info(TestJwtClaims.staff_admin_role, monkeypatch)
    set_global_tenant()
    user = factory_staff_user_model(external_id=TestJwtClaims.staff_admin_role['sub'])
    factory_user_group_membership_model(str(user.external_id), user.tenant_id)
    subscribe_item, widget_subscribe, language = subscribe_item_model_with_language()
    data = {
        'subscribe_item_id': subscribe_item.id,
        'language_id': language.id,
    }

    created_translation = (
        SubscribeItemTranslationService.create_subscribe_item_translation(
            widget_subscribe.id, data, True
        )
    )
    assert created_translation is not None
    assert created_translation.description == subscribe_item.description


def test_update_subscribe_item_translation_with_authorization(
    session, monkeypatch
):
    """Assert that a subscribe item translation can be updated with proper authorization."""
    # Mock authorization
    patch_token_info(TestJwtClaims.staff_admin_role, monkeypatch)
    set_global_tenant()
    user = factory_staff_user_model(external_id=TestJwtClaims.staff_admin_role['sub'])
    factory_user_group_membership_model(str(user.external_id), user.tenant_id)
    subscribe_item, widget_subscribe, language = subscribe_item_model_with_language()
    translation = factory_subscribe_item_translation_model(
        {
            **TestSubscribeItemTranslationInfo.translate_info1.value,
            'subscribe_item_id': subscribe_item.id,
            'language_id': language.id,
            'description': 'Old Description',
        }
    )
    session.commit()

    updated_data = {'description': 'Updated Description'}
    updated_translation = (
        SubscribeItemTranslationService.update_subscribe_item_translation(
            widget_subscribe.id, translation.id, updated_data
        )
    )
    assert updated_translation.description == updated_data['description']


def test_delete_subscribe_item_translation_with_authorization(
    session, monkeypatch
):
    """Assert that a subscribe item translation can be deleted with proper authorization."""
    # Mock authorization
    patch_token_info(TestJwtClaims.staff_admin_role, monkeypatch)
    set_global_tenant()
    user = factory_staff_user_model(external_id=TestJwtClaims.staff_admin_role['sub'])
    factory_user_group_membership_model(str(user.external_id), user.tenant_id)
    subscribe_item, widget_subscribe, language = subscribe_item_model_with_language()
    translation = factory_subscribe_item_translation_model(
        {
            **TestSubscribeItemTranslationInfo.translate_info1.value,
            'subscribe_item_id': subscribe_item.id,
            'language_id': language.id,
        }
    )
    session.commit()

    SubscribeItemTranslationService.delete_subscribe_item_translation(
        widget_subscribe.id, translation.id
    )
    deleted_translation = SubscribeItemTranslationService.get_by_id(
        translation.id
    )
    assert deleted_translation is None
