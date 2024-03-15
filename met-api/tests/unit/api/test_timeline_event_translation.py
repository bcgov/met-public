"""Tests to verify the TimelineEventTranslation API endpoints."""
import json
from http import HTTPStatus

from met_api.utils.enums import ContentType
from tests.utilities.factory_utils import (
    factory_auth_header, factory_timeline_event_translation_model, timeline_event_model_with_language)


def test_get_timeline_event_translation(client, jwt, session):
    """Assert that a timeline event translation can be fetched by its ID."""
    headers = factory_auth_header(jwt=jwt, claims={})
    timeline_event, timeline, language = timeline_event_model_with_language()
    timeline_event_translation = factory_timeline_event_translation_model(
        {
            'timeline_event_id': timeline_event.id,
            'language_id': language.id,
            'description': 'Test Translation',
            'time': '2021-01-01T00:00:00',
        }
    )

    session.add(timeline_event_translation)
    session.commit()

    rv = client.get(
        f'/api/timelines/{timeline.id}/translations/{timeline_event_translation.id}',
        headers=headers,
        content_type=ContentType.JSON.value,
    )

    assert rv.status_code == HTTPStatus.OK
    json_data = rv.json
    assert json_data['id'] == timeline_event_translation.id


def test_get_timeline_event_translation_by_language(client, jwt, session):
    """Assert that a timeline event translation can be fetched by its language ID."""
    headers = factory_auth_header(jwt=jwt, claims={})
    timeline_event, timeline, language = timeline_event_model_with_language()
    timeline_event_translation = factory_timeline_event_translation_model(
        {
            'timeline_event_id': timeline_event.id,
            'language_id': language.id,
            'description': 'Test Translation',
            'time': '2021-01-01T00:00:00',
        }
    )

    session.add(timeline_event_translation)
    session.commit()

    rv = client.get(
        f'/api/timelines/{timeline.id}/translations/event/{timeline_event.id}/language/{language.id}',
        headers=headers,
        content_type=ContentType.JSON.value,
    )

    assert rv.status_code == HTTPStatus.OK
    json_data = rv.json
    assert json_data['id'] == timeline_event_translation.id


def test_create_timeline_event_translation(client, jwt, session, setup_admin_user_and_claims):
    """Assert that a new timeline event translation can be created using POST."""
    _, claims = setup_admin_user_and_claims
    headers = factory_auth_header(jwt=jwt, claims=claims)
    timeline_event, timeline, language = timeline_event_model_with_language()

    data = {
        'timeline_event_id': timeline_event.id,
        'language_id': language.id,
        'description': 'New Translation',
        'time': '2021-01-01T00:00:00',
        'pre_populate': False,
    }

    rv = client.post(
        f'/api/timelines/{timeline.id}/translations/',
        data=json.dumps(data),
        headers=headers,
        content_type=ContentType.JSON.value,
    )

    assert rv.status_code == HTTPStatus.CREATED
    json_data = rv.json
    assert json_data['description'] == 'New Translation'


def test_create_timeline_event_translation_with_prepopulate(client, jwt, session, setup_admin_user_and_claims):
    """Assert that a new timeline event translation can be created using POST."""
    _, claims = setup_admin_user_and_claims
    headers = factory_auth_header(jwt=jwt, claims=claims)
    timeline_event, timeline, language = timeline_event_model_with_language()

    data = {
        'timeline_event_id': timeline_event.id,
        'language_id': language.id,
        'pre_populate': True,
    }

    rv = client.post(
        f'/api/timelines/{timeline.id}/translations/',
        data=json.dumps(data),
        headers=headers,
        content_type=ContentType.JSON.value,
    )

    assert rv.status_code == HTTPStatus.CREATED
    json_data = rv.json
    assert json_data['description'] == timeline_event.description


def test_patch_timeline_event_translation(client, jwt, session, setup_admin_user_and_claims):
    """Assert that a timeline event translation can be updated using PATCH."""
    _, claims = setup_admin_user_and_claims
    headers = factory_auth_header(jwt=jwt, claims=claims)
    timeline_event, timeline, language = timeline_event_model_with_language()
    session.commit()
    timeline_event_translation = factory_timeline_event_translation_model(
        {
            'timeline_event_id': timeline_event.id,
            'language_id': language.id,
            'description': 'Test Translation',
            'time': '2021-01-01T00:00:00',
        }
    )

    updated_data = {
        'description': 'Updated Translation',
    }

    rv = client.patch(
        f'/api/timelines/{timeline.id}/translations/{timeline_event_translation.id}',
        data=json.dumps(updated_data),
        headers=headers,
        content_type=ContentType.JSON.value,
    )

    assert rv.status_code == HTTPStatus.OK
    json_data = rv.json
    assert json_data['description'] == updated_data['description']


def test_delete_timeline_event_translation(client, jwt, session, setup_admin_user_and_claims):
    """Assert that a timeline event translation can be deleted using DELETE."""
    _, claims = setup_admin_user_and_claims
    headers = factory_auth_header(jwt=jwt, claims=claims)
    timeline_event, timeline, language = timeline_event_model_with_language()
    timeline_event_translation = factory_timeline_event_translation_model(
        {
            'timeline_event_id': timeline_event.id,
            'language_id': language.id,
            'description': 'Test Translation',
            'time': '2021-01-01T00:00:00',
        }
    )
    session.commit()

    rv = client.delete(
        f'/api/timelines/{timeline.id}/translations/{timeline_event_translation.id}',
        headers=headers,
        content_type=ContentType.JSON.value,
    )

    assert rv.status_code == HTTPStatus.NO_CONTENT
