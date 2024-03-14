"""Unit tests for TimelineEventTranslationService."""

from met_api.services.timeline_event_translation_service import TimelineEventTranslationService
from tests.utilities.factory_scenarios import TestJwtClaims, TestTimelineEventTranslationInfo
from tests.utilities.factory_utils import (
    factory_staff_user_model, factory_timeline_event_translation_model, patch_token_info,
    timeline_event_model_with_language)


def test_get_timeline_event_translation_by_id(session):
    """Assert that subscribe item translation can be fetched by its ID."""
    timeline_event, _, language = timeline_event_model_with_language()
    translation = factory_timeline_event_translation_model(
        {
            **TestTimelineEventTranslationInfo.timeline_event_info1.value,
            'timeline_event_id': timeline_event.id,
            'language_id': language.id,
        }
    )
    session.commit()

    fetched_translation = TimelineEventTranslationService.get_by_id(
        translation.id
    )
    assert fetched_translation is not None
    assert fetched_translation.id == translation.id


def test_get_timeline_event_translation_by_language(session):
    """Assert that subscribe item translations can be fetched by item and language."""
    timeline_event, _, language = timeline_event_model_with_language()
    factory_timeline_event_translation_model(
        {
            **TestTimelineEventTranslationInfo.timeline_event_info1.value,
            'timeline_event_id': timeline_event.id,
            'language_id': language.id,
        }
    )
    session.commit()

    translations = TimelineEventTranslationService.get_timeline_event_translation(
        timeline_event.id, language.id
    )
    assert len(translations) == 1
    assert translations[0].description == TestTimelineEventTranslationInfo.timeline_event_info1.value['description']


def test_create_timeline_event_translation_with_authorization(
    session, monkeypatch
):
    """Assert that a subscribe item translation can be created with proper authorization."""
    # Mock authorization
    patch_token_info(TestJwtClaims.staff_admin_role, monkeypatch)
    factory_staff_user_model(external_id=TestJwtClaims.staff_admin_role['sub'])
    timeline_event, widget_timeline, language = timeline_event_model_with_language()
    data = {
        **TestTimelineEventTranslationInfo.timeline_event_info1.value,
        'timeline_event_id': timeline_event.id,
        'language_id': language.id,
        'description': 'New Translation',
    }

    created_translation = (
        TimelineEventTranslationService.create_timeline_event_translation(
            widget_timeline.id, data, False
        )
    )
    assert created_translation is not None
    assert created_translation.description == data['description']


def test_create_timeline_event_translation_with_authorization_with_prepopulate(
    session, monkeypatch
):
    """Assert that a subscribe item translation can be created with proper authorization."""
    # Mock authorization
    patch_token_info(TestJwtClaims.staff_admin_role, monkeypatch)
    factory_staff_user_model(external_id=TestJwtClaims.staff_admin_role['sub'])
    timeline_event, widget_timeline, language = timeline_event_model_with_language()
    data = {
        'timeline_event_id': timeline_event.id,
        'language_id': language.id,
    }

    created_translation = (
        TimelineEventTranslationService.create_timeline_event_translation(
            widget_timeline.id, data, True
        )
    )
    assert created_translation is not None
    assert created_translation.description == timeline_event.description


def test_update_timeline_event_translation_with_authorization(
    session, monkeypatch
):
    """Assert that a subscribe item translation can be updated with proper authorization."""
    # Mock authorization
    patch_token_info(TestJwtClaims.staff_admin_role, monkeypatch)
    factory_staff_user_model(external_id=TestJwtClaims.staff_admin_role['sub'])
    timeline_event, widget_timeline, language = timeline_event_model_with_language()
    translation = factory_timeline_event_translation_model(
        {
            **TestTimelineEventTranslationInfo.timeline_event_info1.value,
            'timeline_event_id': timeline_event.id,
            'language_id': language.id,
            'description': 'Old Description',
        }
    )
    session.commit()

    updated_data = {'description': 'Updated Description'}
    updated_translation = (
        TimelineEventTranslationService.update_timeline_event_translation(
            widget_timeline.id, translation.id, updated_data
        )
    )
    assert updated_translation.description == updated_data['description']


def test_delete_timeline_event_translation_with_authorization(
    session, monkeypatch
):
    """Assert that a subscribe item translation can be deleted with proper authorization."""
    # Mock authorization
    patch_token_info(TestJwtClaims.staff_admin_role, monkeypatch)
    factory_staff_user_model(external_id=TestJwtClaims.staff_admin_role['sub'])
    timeline_event, widget_timeline, language = timeline_event_model_with_language()
    translation = factory_timeline_event_translation_model(
        {
            **TestTimelineEventTranslationInfo.timeline_event_info1.value,
            'timeline_event_id': timeline_event.id,
            'language_id': language.id,
        }
    )
    session.commit()

    TimelineEventTranslationService.delete_timeline_event_translation(
        widget_timeline.id, translation.id
    )
    deleted_translation = TimelineEventTranslationService.get_by_id(
        translation.id
    )
    assert deleted_translation is None
