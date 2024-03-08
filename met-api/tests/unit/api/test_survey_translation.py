"""Tests to verify the SurveyTranslation API endpoints."""

import json
from http import HTTPStatus

from met_api.utils.enums import ContentType
from tests.utilities.factory_utils import (
    factory_auth_header, factory_language_model, factory_survey_and_eng_model,
    factory_survey_translation_and_engagement_model)


def test_get_survey_translation(client, jwt, session):
    """Assert that a survey translation can be fetched by its ID."""
    headers = factory_auth_header(jwt=jwt, claims={})
    survey_translation, survey, _ = (
        factory_survey_translation_and_engagement_model()
    )
    session.add(survey_translation)
    session.commit()

    rv = client.get(
        f'/api/surveys/{survey.id}/translations/{survey_translation.id}',
        headers=headers,
        content_type=ContentType.JSON.value,
    )

    assert rv.status_code == HTTPStatus.OK
    json_data = rv.json
    assert json_data['id'] == survey_translation.id


def test_create_survey_translation(client, jwt, session, setup_admin_user_and_claims):
    """Assert that a new survey translation can be created using the POST API endpoint."""
    _, claims = setup_admin_user_and_claims
    headers = factory_auth_header(jwt=jwt, claims=claims)
    survey, eng = factory_survey_and_eng_model()
    language = factory_language_model({'name': 'French', 'code': 'fr', 'right_to_left': False})
    session.add(eng)
    session.add(survey)
    session.add(language)
    session.commit()

    data = {
        'survey_id': survey.id,
        'language_id': language.id,
        'name': 'New Translation',
        'form_json': {'question': 'Your name?'},
        'pre_populate': False,
    }
    print(data)
    rv = client.post(
        f'/api/surveys/{survey.id}/translations/',
        data=json.dumps(data),
        headers=headers,
        content_type=ContentType.JSON.value,
    )

    assert rv.status_code == HTTPStatus.CREATED
    json_data = rv.json
    assert json_data['name'] == 'New Translation'


def test_update_survey_translation(client, jwt, session, setup_admin_user_and_claims):
    """Assert that a survey translation can be updated using the PATCH API endpoint."""
    _, claims = setup_admin_user_and_claims
    headers = factory_auth_header(jwt=jwt, claims=claims)
    survey_translation, survey, _ = (
        factory_survey_translation_and_engagement_model()
    )
    session.add(survey_translation)
    session.commit()

    data = {'name': 'Updated Translation'}
    rv = client.patch(
        f'/api/surveys/{survey.id}/translations/{survey_translation.id}',
        data=json.dumps(data),
        headers=headers,
        content_type=ContentType.JSON.value,
    )

    assert rv.status_code == HTTPStatus.OK
    json_data = rv.json
    assert json_data['name'] == 'Updated Translation'


def test_delete_survey_translation(client, jwt, session, setup_admin_user_and_claims):
    """Assert that a survey translation can be deleted using the DELETE API endpoint."""
    _, claims = setup_admin_user_and_claims
    headers = factory_auth_header(jwt=jwt, claims=claims)
    survey_translation, survey, _ = (
        factory_survey_translation_and_engagement_model()
    )
    session.add(survey_translation)
    session.commit()

    rv = client.delete(
        f'/api/surveys/{survey.id}/translations/{survey_translation.id}',
        headers=headers,
        content_type=ContentType.JSON.value,
    )

    assert rv.status_code == HTTPStatus.NO_CONTENT
