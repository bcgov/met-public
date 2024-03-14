"""Tests for the TimelineEventTranslation model.

Test suite to ensure that the TimelineEventTranslation model routines are working as expected.
"""

from met_api.models.timeline_event_translation import TimelineEventTranslation
from tests.utilities.factory_scenarios import TestTimelineEventTranslationInfo
from tests.utilities.factory_utils import factory_timeline_event_translation_model, timeline_event_model_with_language


def test_get_by_event_and_language(session):
    """Assert translations for a timeline event can be fetched by event and language."""
    timeline_event, _, language = timeline_event_model_with_language()
    timeline_event_translation_data = {
        **TestTimelineEventTranslationInfo.timeline_event_info1.value,
        'timeline_event_id': timeline_event.id,
        'language_id': language.id,
    }

    factory_timeline_event_translation_model(timeline_event_translation_data)
    session.commit()

    translations = TimelineEventTranslation.get_by_event_and_language(
        timeline_event.id, language.id
    )
    assert len(translations) == 1
    assert (
        translations[0].description ==
        TestTimelineEventTranslationInfo.timeline_event_info1.value[
            'description'
        ]
    )


def test_create_timeline_event_translation(session):
    """Assert that a timeline event translation can be created."""
    timeline_event, _, language = timeline_event_model_with_language()
    timeline_event_translation_data = {
        **TestTimelineEventTranslationInfo.timeline_event_info1.value,
        'timeline_event_id': timeline_event.id,
        'language_id': language.id,
    }

    translation = TimelineEventTranslation.create_timeline_event_translation(
        timeline_event_translation_data
    )
    assert translation.id is not None
    assert (
        translation.description ==
        TestTimelineEventTranslationInfo.timeline_event_info1.value[
            'description'
        ]
    )


def test_update_timeline_event_translation(session):
    """Assert that a timeline event translation can be updated."""
    timeline_event, _, language = timeline_event_model_with_language()
    timeline_event_translation = factory_timeline_event_translation_model(
        {
            **TestTimelineEventTranslationInfo.timeline_event_info1.value,
            'timeline_event_id': timeline_event.id,
            'language_id': language.id,
        }
    )

    updated_data = {'description': 'Updated Description'}
    TimelineEventTranslation.update_timeline_event_translation(
        timeline_event_translation.id, updated_data
    )
    updated_translation = TimelineEventTranslation.query.get(
        timeline_event_translation.id
    )

    assert updated_translation.description == 'Updated Description'


def test_delete_timeline_event_translation(session):
    """Assert that a timeline event translation can be deleted."""
    timeline_event, _, language = timeline_event_model_with_language()
    timeline_event_translation = factory_timeline_event_translation_model(
        {
            **TestTimelineEventTranslationInfo.timeline_event_info1.value,
            'timeline_event_id': timeline_event.id,
            'language_id': language.id,
        }
    )

    TimelineEventTranslation.delete_timeline_event_translation(
        timeline_event_translation.id
    )
    deleted_translation = TimelineEventTranslation.query.get(
        timeline_event_translation.id
    )

    assert deleted_translation is None
