"""Tests for the EventItemTranslation model.

Test suite to ensure that the EventItemTranslation model
routines are working as expected.
"""

from met_api.models.event_item_translation import EventItemTranslation
from tests.utilities.factory_scenarios import TestEventItemTranslationInfo
from tests.utilities.factory_utils import event_item_model_with_language, factory_event_item_translation_model


def test_get_event_item_translation_by_item_and_language(session):
    """Translations for an event item can be fetched by item and language."""
    event_item, _, language = event_item_model_with_language()
    event_item_translation = {
        **TestEventItemTranslationInfo.event_item_info1.value,
        'event_item_id': event_item.id,
        'language_id': language.id,
    }

    factory_event_item_translation_model(event_item_translation)
    session.commit()

    translations = (
        EventItemTranslation.get_by_item_and_language(
            event_item.id, language.id
        )
    )
    assert len(translations) == 1
    assert (
        translations[0].description ==
        TestEventItemTranslationInfo.event_item_info1.value['description']
    )


def test_create_event_item_translation(session):
    """Assert that an event item translation can be created."""
    event_item, _, language = event_item_model_with_language()
    event_item_translation = {
        **TestEventItemTranslationInfo.event_item_info1.value,
        'event_item_id': event_item.id,
        'language_id': language.id,
    }

    translation = EventItemTranslation.create_event_item_translation(
        event_item_translation
    )
    assert translation.id is not None
    assert (
        translation.description ==
        TestEventItemTranslationInfo.event_item_info1.value['description']
    )


def test_update_event_item_translation(session):
    """Assert that an event item translation can be updated."""
    event_item, _, language = event_item_model_with_language()
    event_item_translation = {
        **TestEventItemTranslationInfo.event_item_info1.value,
        'event_item_id': event_item.id,
        'language_id': language.id,
    }

    translation = factory_event_item_translation_model(event_item_translation)

    updated_data = {'description': 'Updated Description'}
    EventItemTranslation.update_event_item_translation(
        translation.id, updated_data
    )
    updated_translation = EventItemTranslation.query.get(translation.id)

    assert updated_translation.description == 'Updated Description'


def test_delete_event_item_translation(session):
    """Assert that an event item translation can be deleted."""
    event_item, _, language = event_item_model_with_language()
    event_item_translation = {
        **TestEventItemTranslationInfo.event_item_info1.value,
        'event_item_id': event_item.id,
        'language_id': language.id,
    }

    translation = factory_event_item_translation_model(event_item_translation)

    EventItemTranslation.delete_event_item_translation(translation.id)
    deleted_translation = EventItemTranslation.query.get(translation.id)

    assert deleted_translation is None
