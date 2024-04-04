"""Tests for the PollAnswerTranslation model.

Test suite to ensure that the PollAnswerTranslation model routines are working as expected.
"""

from met_api.models.poll_answer_translation import PollAnswerTranslation
from tests.utilities.factory_utils import factory_poll_answer_translation_model, poll_answer_model_with_poll_enagement


def test_get_poll_answer_translation_by_answer_and_language(session):
    """Assert that translations for a poll answer can be fetched by answer and language."""
    answer, _, language = poll_answer_model_with_poll_enagement()
    factory_poll_answer_translation_model(
        {
            'poll_answer_id': answer.id,
            'language_id': language.id,
            'answer_text': 'Translated Answer',
        }
    )
    session.commit()

    translations = PollAnswerTranslation.get_by_answer_and_language(
        answer.id, language.id
    )
    assert len(translations) == 1
    assert translations[0].answer_text == 'Translated Answer'


def test_create_poll_answer_translation(session):
    """Assert that a poll answer translation can be created."""
    answer, _, language = poll_answer_model_with_poll_enagement()
    translation_data = {
        'poll_answer_id': answer.id,
        'language_id': language.id,
        'answer_text': 'Réponse traduite',
    }

    translation = PollAnswerTranslation.create_poll_answer_translation(
        translation_data
    )
    assert translation.id is not None
    assert translation.answer_text == 'Réponse traduite'


def test_update_poll_answer_translation(session):
    """Assert that a poll answer translation can be updated."""
    answer, _, language = poll_answer_model_with_poll_enagement()
    translation = factory_poll_answer_translation_model(
        {
            'poll_answer_id': answer.id,
            'language_id': language.id,
            'answer_text': 'Translated Answer',
        }
    )

    updated_data = {'answer_text': 'Respuesta actualizada'}
    PollAnswerTranslation.update_poll_answer_translation(
        translation.id, updated_data
    )
    updated_translation = PollAnswerTranslation.query.get(translation.id)

    assert updated_translation.answer_text == 'Respuesta actualizada'


def test_delete_poll_answer_translation(session):
    """Assert that a poll answer translation can be deleted."""
    answer, _, language = poll_answer_model_with_poll_enagement()
    translation = factory_poll_answer_translation_model(
        {
            'poll_answer_id': answer.id,
            'language_id': language.id,
            'answer_text': 'Translated Answer',
        }
    )

    PollAnswerTranslation.delete_poll_answer_translation(translation.id)
    deleted_translation = PollAnswerTranslation.query.get(translation.id)

    assert deleted_translation is None
