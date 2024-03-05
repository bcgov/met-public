"""Tests for the LanguageService.

Test suite to ensure that the LanguageService routines are working as expected.
"""

from met_api.models.language import Language
from met_api.services.language_service import LanguageService
from tests.utilities.factory_utils import factory_language_model


def test_get_language_by_id(session):
    """Assert that a language can be fetched by its ID."""
    language = factory_language_model(
        {'name': 'French', 'code': 'fr', 'right_to_left': False}
    )
    session.add(language)
    session.commit()

    fetched_language = LanguageService.get_language_by_id(language.id)
    assert fetched_language['name'] == 'French'


def test_get_languages(session):
    """Assert that all languages can be fetched."""
    factory_language_model(
        {'name': 'German', 'code': 'de', 'right_to_left': False}
    )
    factory_language_model(
        {'name': 'Spanish', 'code': 'es', 'right_to_left': False}
    )
    session.commit()

    languages = LanguageService.get_languages()
    assert len(languages) >= 2


def test_create_language(session):
    """Assert that a language can be created."""
    language_data = {'name': 'Italian', 'code': 'it', 'right_to_left': False}
    created_language = LanguageService.create_language(language_data)

    assert created_language.name == 'Italian'


def test_update_language(session):
    """Assert that a language can be updated."""
    language = factory_language_model(
        {'name': 'Japanese', 'code': 'jp', 'right_to_left': True}
    )
    session.add(language)
    session.commit()

    updated_data = {'name': 'Nihongo', 'right_to_left': True}
    updated_language = LanguageService.update_language(
        language.id, updated_data
    )

    assert updated_language.name == 'Nihongo'


def test_delete_language(session):
    """Assert that a language can be deleted."""
    language = factory_language_model(
        {'name': 'Russian', 'code': 'ru', 'right_to_left': False}
    )
    session.add(language)
    session.commit()

    LanguageService.delete_language(language.id)
    deleted_language = Language.query.get(language.id)

    assert deleted_language is None

    # Testing for invalid id
    is_deleted = LanguageService.delete_language(99999)
    assert is_deleted is False
