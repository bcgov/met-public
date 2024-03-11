"""Tests for the SurveyTranslationService.

Test suite to ensure that the SurveyTranslationService routines are working as expected.
"""

from met_api.services.survey_translation_service import SurveyTranslationService
from tests.utilities.factory_scenarios import TestJwtClaims
from tests.utilities.factory_utils import (
    factory_language_model, factory_staff_user_model, factory_survey_and_eng_model,
    factory_survey_translation_and_engagement_model, patch_token_info)


def test_get_survey_translation_by_id(session):
    """Assert that a survey translation can be fetched by ID."""
    translation, _, _ = factory_survey_translation_and_engagement_model()
    session.add(translation)
    session.commit()

    fetched_translation = (
        SurveyTranslationService.get_survey_translation_by_id(translation.id)
    )
    assert fetched_translation.id == translation.id
    assert fetched_translation.name == translation.name


def test_create_survey_translation(session, monkeypatch):
    """Assert that a survey translation can be created."""
    # Setup language and survey
    patch_token_info(TestJwtClaims.staff_admin_role, monkeypatch)
    factory_staff_user_model(external_id=TestJwtClaims.staff_admin_role['sub'])
    language = factory_language_model()
    session.add(language)
    session.commit()
    survey, _ = factory_survey_and_eng_model()

    # Create translation with Prepoulate true
    translation_data = {
        'survey_id': survey.id,
        'language_id': language.id,
        'name': 'Survey in French',
        'form_json': '{"question": "Votre nom?"}',
    }
    created_translation = SurveyTranslationService.create_survey_translation(
        translation_data, pre_populate=False
    )
    assert created_translation.id is not None
    assert created_translation.name == 'Survey in French'

    language_data = {'name': 'Spanish', 'code': 'es', 'right_to_left': False}
    language1 = factory_language_model(language_data)

    # Create translation with Prepoulate True
    translation_data2 = {
        'survey_id': survey.id,
        'language_id': language1.id,
    }

    created_translation = SurveyTranslationService.create_survey_translation(
        translation_data2, pre_populate=True
    )
    assert created_translation.id is not None
    assert created_translation.name == survey.name


def test_update_survey_translation(session, monkeypatch):
    """Assert that a survey translation can be updated."""
    patch_token_info(TestJwtClaims.staff_admin_role, monkeypatch)
    factory_staff_user_model(external_id=TestJwtClaims.staff_admin_role['sub'])

    translation, _, _ = factory_survey_translation_and_engagement_model()

    updated_data = {'name': 'Updated Survey Translation'}
    updated_translation = SurveyTranslationService.update_survey_translation(
        translation.survey_id, translation.id, updated_data
    )
    assert updated_translation.id == translation.id
    assert updated_translation.name == 'Updated Survey Translation'


def test_delete_survey_translation(session, monkeypatch):
    """Assert that a survey translation can be deleted."""
    patch_token_info(TestJwtClaims.staff_admin_role, monkeypatch)
    factory_staff_user_model(external_id=TestJwtClaims.staff_admin_role['sub'])
    translation, _, _ = factory_survey_translation_and_engagement_model()
    session.add(translation)
    session.commit()

    deleted = SurveyTranslationService.delete_survey_translation(
        translation.survey_id, translation.id
    )
    assert deleted
    assert not SurveyTranslationService.get_survey_translation_by_id(
        translation.id
    )
