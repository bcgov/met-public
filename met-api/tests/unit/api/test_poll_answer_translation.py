"""Tests to verify the PollAnswerTranslation API endpoints."""

import json
from http import HTTPStatus

from met_api.utils.enums import ContentType
from tests.utilities.factory_utils import (
    factory_auth_header, factory_poll_answer_translation_model, poll_answer_model_with_poll_enagement)


def test_get_poll_answer_translation(client, jwt, session):
    """Assert that a poll answer translation can be fetched by its ID."""
    headers = factory_auth_header(jwt=jwt, claims={})
    answer, poll, language = poll_answer_model_with_poll_enagement()
    poll_answer_translation = factory_poll_answer_translation_model(
        {
            'poll_answer_id': answer.id,
            'language_id': language.id,
            'answer_text': 'Test Translation',
        }
    )
    session.add(poll_answer_translation)
    session.commit()

    rv = client.get(
        f'/api/polls/{poll.id}/translations/{poll_answer_translation.id}',
        headers=headers,
        content_type=ContentType.JSON.value,
    )

    assert rv.status_code == HTTPStatus.OK
    json_data = rv.json
    assert json_data['id'] == poll_answer_translation.id


def test_get_poll_answer_translation_by_langauge_id(client, jwt, session):
    """Assert that a poll answer translation can be fetched by its ID and Language ID."""
    headers = factory_auth_header(jwt=jwt, claims={})
    answer, poll, language = poll_answer_model_with_poll_enagement()
    poll_answer_translation = factory_poll_answer_translation_model(
        {
            'poll_answer_id': answer.id,
            'language_id': language.id,
            'answer_text': 'Test Translation',
        }
    )
    session.add(poll_answer_translation)
    session.commit()

    rv = client.get(
        f'/api/polls/{poll.id}/translations/answer/{answer.id}/language/{language.id}',
        headers=headers,
        content_type=ContentType.JSON.value,
    )

    assert rv.status_code == HTTPStatus.OK
    json_data = rv.json
    assert json_data[0]['id'] == poll_answer_translation.id


def test_create_poll_answer_translation(
    client, jwt, session, setup_admin_user_and_claims
):
    """Assert that a new poll answer translation can be created using the POST API endpoint."""
    _, claims = setup_admin_user_and_claims
    headers = factory_auth_header(jwt=jwt, claims=claims)
    answer, poll, language = poll_answer_model_with_poll_enagement()

    session.commit()

    data = {
        'poll_answer_id': answer.id,
        'language_id': language.id,
        'answer_text': 'New Answer Translation',
        'pre_populate': False,
    }

    rv = client.post(
        f'/api/polls/{poll.id}/translations/',
        data=json.dumps(data),
        headers=headers,
        content_type=ContentType.JSON.value,
    )

    assert rv.status_code == HTTPStatus.CREATED
    json_data = rv.json
    assert json_data['answer_text'] == 'New Answer Translation'


def test_update_poll_answer_translation(
    client, jwt, session, setup_admin_user_and_claims
):
    """Assert that a poll answer translation can be updated using the PATCH API endpoint."""
    _, claims = setup_admin_user_and_claims
    headers = factory_auth_header(jwt=jwt, claims=claims)
    answer, poll, language = poll_answer_model_with_poll_enagement()
    poll_answer_translation = factory_poll_answer_translation_model(
        {
            'poll_answer_id': answer.id,
            'language_id': language.id,
            'answer_text': 'Test Translation',
        }
    )
    session.commit()

    data = {'answer_text': 'Updated Answer Translation'}
    rv = client.patch(
        f'/api/polls/{poll.id}/translations/{poll_answer_translation.id}',
        data=json.dumps(data),
        headers=headers,
        content_type=ContentType.JSON.value,
    )

    assert rv.status_code == HTTPStatus.OK
    json_data = rv.json
    assert json_data['answer_text'] == 'Updated Answer Translation'


def test_delete_poll_answer_translation(
    client, jwt, session, setup_admin_user_and_claims
):
    """Assert that a poll answer translation can be deleted using the DELETE API endpoint."""
    _, claims = setup_admin_user_and_claims
    headers = factory_auth_header(jwt=jwt, claims=claims)
    answer, poll, language = poll_answer_model_with_poll_enagement()
    poll_answer_translation = factory_poll_answer_translation_model(
        {
            'poll_answer_id': answer.id,
            'language_id': language.id,
            'answer_text': 'Test Translation',
        }
    )
    session.commit()

    rv = client.delete(
        f'/api/polls/{poll.id}/translations/{poll_answer_translation.id}',
        headers=headers,
        content_type=ContentType.JSON.value,
    )

    assert rv.status_code == HTTPStatus.NO_CONTENT
