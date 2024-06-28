"""Tests for the LanguageService.

Test suite to ensure that the LanguageService routines are working as expected.
"""

from met_api.services.language_service import LanguageService


def test_get_language_by_id(session):
    """Assert that a language can be fetched by its ID."""
    fetched_language = LanguageService.get_language_by_id(49)
    assert fetched_language['name'] == 'French'


def test_get_languages(session):
    """Assert that all languages can be fetched."""
    languages = LanguageService.get_languages()
    assert len(languages) == 187
