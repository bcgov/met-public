"""Tests for the SurveyTranslation model.

Test suite to ensure that the SurveyTranslation model routines are working as expected.
"""

from met_api.models.survey_translation import SurveyTranslation
from tests.utilities.factory_utils import (
    factory_language_model, factory_survey_and_eng_model, factory_survey_translation_and_engagement_model,
    factory_survey_translation_model)


def test_create_survey_translation(session):
    """Assert that a survey translation can be created."""
    language_data = {'name': 'Spanish', 'code': 'es', 'right_to_left': False}
    language = factory_language_model(language_data)
    survey, _ = factory_survey_and_eng_model()
    translation_data = {
        'survey_id': survey.id,
        'language_id': language.id,
        'name': 'Survey Name',
        'form_json': '{"question": "What is your name?"}',
    }
    translation = factory_survey_translation_model(translation_data)
    assert translation.id is not None
    assert translation.name == 'Survey Name'


def test_get_survey_translation_by_survey_and_language(session):
    """Assert that a survey translation can be fetched by survey_id and language_id."""
    translation, survey, lang = (
        factory_survey_translation_and_engagement_model()
    )
    fetched_translation = (
        SurveyTranslation.get_survey_translation_by_survey_and_language(
            survey.id, lang.id
        )
    )
    assert len(fetched_translation) == 1
    assert fetched_translation[0].name == translation.name


def test_update_survey_translation(session):
    """Assert that a survey translation can be updated."""
    translation, _, _ = factory_survey_translation_and_engagement_model()
    updated_data = {'name': 'Updated Survey 3'}
    SurveyTranslation.update_survey_translation(translation.id, updated_data)
    updated_translation = SurveyTranslation.query.get(translation.id)

    assert updated_translation.name == 'Updated Survey 3'


def test_delete_survey_translation(session):
    """Assert that a survey translation can be deleted."""
    translation, _, _ = factory_survey_translation_and_engagement_model()
    SurveyTranslation.delete_survey_translation(translation.id)
    deleted_translation = SurveyTranslation.query.get(translation.id)

    assert deleted_translation is None
