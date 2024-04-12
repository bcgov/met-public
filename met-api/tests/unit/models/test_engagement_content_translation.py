"""Tests for the EngagementContentTranslation model.

Test suite to ensure that the EngagementContentTranslation model
routines are working as expected.
"""

from met_api.models.engagement_content_translation import EngagementContentTranslation
from tests.utilities.factory_scenarios import TestEngagementContentTranslationInfo
from tests.utilities.factory_utils import (
    engagement_content_model_with_language, factory_engagement_content_translation_model)


def test_get_translations_by_content_and_language(session):
    """Translations for engagement content can be fetched by content and language."""
    engagement_content, language = engagement_content_model_with_language()
    translation_data = {
        **TestEngagementContentTranslationInfo.translation_info1.value,
        'engagement_content_id': engagement_content.id,
        'language_id': language.id,
    }

    factory_engagement_content_translation_model(translation_data)
    session.commit()

    translations = EngagementContentTranslation.get_translations_by_content_and_language(
        engagement_content.id, language.id
    )
    assert len(translations) == 1
    assert (
        translations[0].content_title == TestEngagementContentTranslationInfo.translation_info1.value['content_title']
    )


def test_create_engagement_content_translation(session):
    """Assert that an engagement content translation can be created."""
    engagement_content, language = engagement_content_model_with_language()
    translation_data = {
        **TestEngagementContentTranslationInfo.translation_info1.value,
        'engagement_content_id': engagement_content.id,
        'language_id': language.id,
    }

    translation = EngagementContentTranslation.create_engagement_content_translation(translation_data)
    session.commit()

    assert translation.id is not None
    assert translation.content_title == TestEngagementContentTranslationInfo.translation_info1.value['content_title']


def test_update_engagement_content_translation(session):
    """Assert that an engagement content translation can be updated."""
    engagement_content, language = engagement_content_model_with_language()
    translation_data = {
        **TestEngagementContentTranslationInfo.translation_info1.value,
        'engagement_content_id': engagement_content.id,
        'language_id': language.id,
    }

    translation = factory_engagement_content_translation_model(translation_data)
    session.commit()

    updated_data = {'content_title': 'Updated Title'}
    EngagementContentTranslation.update_engagement_content_translation(translation.id, updated_data)
    session.commit()

    updated_translation = EngagementContentTranslation.query.get(translation.id)
    assert updated_translation.content_title == 'Updated Title'


def test_delete_engagement_content_translation(session):
    """Assert that an engagement content translation can be deleted."""
    engagement_content, language = engagement_content_model_with_language()
    translation_data = {
        **TestEngagementContentTranslationInfo.translation_info1.value,
        'engagement_content_id': engagement_content.id,
        'language_id': language.id,
    }

    translation = factory_engagement_content_translation_model(translation_data)
    session.commit()

    EngagementContentTranslation.delete_engagement_content_translation(translation.id)
    session.commit()

    deleted_translation = EngagementContentTranslation.query.get(translation.id)
    assert deleted_translation is None
