"""Tests to verify the SubscribeItemTranslation Model."""

from met_api.models.subscribe_item_translation import SubscribeItemTranslation
from tests.utilities.factory_utils import (
    factory_subscribe_item_model_with_enagement, factory_subscribe_item_translation_model)


def test_create_subscribe_item_translation(session):
    """Assert that a subscribe item translation can be created."""
    item = factory_subscribe_item_model_with_enagement()
    translation_data = {
        'subscribe_item_id': item.id,
        'language_id': 49,  # French lang ID from pre-populated DB.
        'description': 'Description traduite',
    }

    translation = SubscribeItemTranslation.create_sub_item_translation(
        translation_data
    )
    assert translation.id is not None
    assert translation.description == 'Description traduite'


def test_get_subscribe_item_translation_by_item_and_language(session):
    """Assert that translations for a subscribe item can be fetched by item and language."""
    item = factory_subscribe_item_model_with_enagement()
    factory_subscribe_item_translation_model(
        {
            'subscribe_item_id': item.id,
            'language_id': 49,  # French lang ID from pre-populated DB.
            'description': 'Translated Description',
        }
    )
    session.commit()

    translations = SubscribeItemTranslation.get_by_item_and_language(
        item.id, 49  # French lang ID from pre-populated DB.
    )
    assert len(translations) == 1
    assert translations[0].description == 'Translated Description'


def test_update_subscribe_item_translation(session):
    """Assert that a subscribe item translation can be updated."""
    item = factory_subscribe_item_model_with_enagement()
    translation = factory_subscribe_item_translation_model(
        {
            'subscribe_item_id': item.id,
            'language_id': 49,  # French lang ID from pre-populated DB.
            'description': 'Translated Description',
        }
    )

    updated_data = {'description': 'Descripción actualizada'}
    SubscribeItemTranslation.update_sub_item_translation(
        translation.id, updated_data
    )
    updated_translation = SubscribeItemTranslation.query.get(translation.id)

    assert updated_translation.description == 'Descripción actualizada'


def test_delete_subscribe_item_translation(session):
    """Assert that a subscribe item translation can be deleted."""
    item = factory_subscribe_item_model_with_enagement()
    translation = factory_subscribe_item_translation_model(
        {
            'subscribe_item_id': item.id,
            'language_id': 49,  # French lang ID from pre-populated DB.
            'description': 'Translated Description',
        }
    )

    SubscribeItemTranslation.delete_sub_item_translation(translation.id)
    deleted_translation = SubscribeItemTranslation.query.get(translation.id)

    assert deleted_translation is None
