"""Tests for the Language model.

Test suite to ensure that the Language model routines are working as expected.
"""

from met_api.models.language import Language
from tests.utilities.factory_utils import factory_language_model


def test_create_language(session):
    """Assert that a language can be created."""
    language_data = {'name': 'Spanish', 'code': 'es', 'right_to_left': False}
    language = factory_language_model(language_data)
    session.add(language)
    session.commit()

    assert language.id is not None
    assert language.name == 'Spanish'


def test_get_language_by_id(session):
    """Assert that a language can be fetched by its ID."""
    language = factory_language_model(
        {'name': 'French', 'code': 'fr', 'right_to_left': False}
    )
    session.add(language)
    session.commit()

    fetched_language = Language.find_by_id(language.id)
    assert fetched_language.id == language.id
    assert fetched_language.name == 'French'


def test_update_language(session):
    """Assert that a language can be updated."""
    language = factory_language_model(
        {'name': 'German', 'code': 'de', 'right_to_left': False}
    )
    session.add(language)
    session.commit()

    updated_data = {'name': 'Deutsch', 'right_to_left': False}
    Language.update_language(language.id, updated_data)
    updated_language = Language.query.get(language.id)

    assert updated_language.name == 'Deutsch'


def test_delete_language(session):
    """Assert that a language can be deleted."""
    language = factory_language_model(
        {'name': 'Italian', 'code': 'it', 'right_to_left': False}
    )
    session.add(language)
    session.commit()

    Language.delete_language(language.id)
    deleted_language = Language.query.get(language.id)

    assert deleted_language is None
