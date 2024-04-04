"""Tests for the PollAnswerTranslationService.

Test suite to ensure that the PollAnswerTranslationService routines are working as expected.
"""

from met_api.services.poll_answer_translation_service import PollAnswerTranslationService
from tests.utilities.factory_scenarios import TestJwtClaims
from tests.utilities.factory_utils import (
    factory_poll_answer_translation_model, factory_staff_user_model, patch_token_info,
    poll_answer_model_with_poll_enagement)


def test_get_poll_answer_translation_by_id(session):
    """Assert that poll answer translation can be fetched by its ID."""
    answer, _, language = poll_answer_model_with_poll_enagement()
    translation = factory_poll_answer_translation_model(
        {
            'poll_answer_id': answer.id,
            'language_id': language.id,
            'answer_text': 'Test Translation',
        }
    )
    session.commit()

    fetched_translation = PollAnswerTranslationService.get_by_id(
        translation.id
    )
    assert fetched_translation is not None
    assert fetched_translation.id == translation.id


def test_get_poll_answer_translation(session):
    """Assert that poll answer translations can be fetched by answer and language."""
    answer, _, language = poll_answer_model_with_poll_enagement()
    factory_poll_answer_translation_model(
        {
            'poll_answer_id': answer.id,
            'language_id': language.id,
            'answer_text': 'Test Translation',
        }
    )
    session.commit()

    translations = PollAnswerTranslationService.get_poll_answer_translation(
        answer.id, language.id
    )
    assert len(translations) == 1
    assert translations[0].answer_text == 'Test Translation'


def test_create_poll_answer_translation_with_authorization(
    session, monkeypatch
):
    """Assert that a poll answer translation can be created with proper authorization."""
    # Mock the authorization check or provide necessary setup
    patch_token_info(TestJwtClaims.staff_admin_role, monkeypatch)
    factory_staff_user_model(external_id=TestJwtClaims.staff_admin_role['sub'])
    answer, poll, language = poll_answer_model_with_poll_enagement()
    data = {
        'poll_answer_id': answer.id,
        'language_id': language.id,
        'answer_text': 'New Translated Answer',
    }

    created_translation = (
        PollAnswerTranslationService.create_poll_answer_translation(
            poll.id, data, False
        )
    )
    assert created_translation is not None
    assert created_translation.answer_text == 'New Translated Answer'


def test_create_poll_answer_translation_with_authorization_with_prepopulate(
    session, monkeypatch
):
    """Assert that a poll answer translation can be created with proper authorization."""
    # Mock the authorization check or provide necessary setup
    patch_token_info(TestJwtClaims.staff_admin_role, monkeypatch)
    factory_staff_user_model(external_id=TestJwtClaims.staff_admin_role['sub'])
    answer, poll, language = poll_answer_model_with_poll_enagement()

    data = {
        'poll_answer_id': answer.id,
        'language_id': language.id,
        'pre_populate': True,
    }

    created_translation = (
        PollAnswerTranslationService.create_poll_answer_translation(
            poll.id, data, data['pre_populate']
        )
    )
    assert created_translation is not None
    assert created_translation.answer_text == answer.answer_text


def test_update_poll_answer_translation_with_authorization(
    session, monkeypatch
):
    """Assert that a poll answer translation can be updated with proper authorization."""
    # Mock the authorization check or provide necessary setup
    patch_token_info(TestJwtClaims.staff_admin_role, monkeypatch)
    factory_staff_user_model(external_id=TestJwtClaims.staff_admin_role['sub'])
    answer, poll, language = poll_answer_model_with_poll_enagement()
    translation = factory_poll_answer_translation_model(
        {
            'poll_answer_id': answer.id,
            'language_id': language.id,
            'answer_text': 'Old Translation',
        }
    )
    session.commit()

    updated_data = {'answer_text': 'Updated Translation'}
    updated_translation = (
        PollAnswerTranslationService.update_poll_answer_translation(
            poll.id, translation.id, updated_data
        )
    )
    assert updated_translation.answer_text == 'Updated Translation'


def test_delete_poll_answer_translation_with_authorization(
    session, monkeypatch
):
    """Assert that a poll answer translation can be deleted with proper authorization."""
    # Mock the authorization check or provide necessary setup
    patch_token_info(TestJwtClaims.staff_admin_role, monkeypatch)
    factory_staff_user_model(external_id=TestJwtClaims.staff_admin_role['sub'])
    answer, poll, language = poll_answer_model_with_poll_enagement()
    translation = factory_poll_answer_translation_model(
        {
            'poll_answer_id': answer.id,
            'language_id': language.id,
            'answer_text': 'Translation to Delete',
        }
    )
    session.commit()

    PollAnswerTranslationService.delete_poll_answer_translation(
        poll.id, translation.id
    )
    deleted_translation = PollAnswerTranslationService.get_by_id(
        translation.id
    )
    assert deleted_translation is None
