"""Tests for the Language model.

Test suite to ensure that the Language model routines are working as expected.
"""

from met_api.models.language import Language


def test_get_language_by_id(session):
    """Assert that a language can be fetched by its ID."""
    fetched_language = Language.find_by_id(49)
    assert fetched_language.name == 'French'


def test_get_languages(session):
    """Assert that all language can be fetched."""
    languages = Language.get_languages()
    # Should match the pre-populated entries in the "language" table.
    assert len(languages) == 187
