"""Tests to verify the EventItemTranslation API endpoints."""
import json
from http import HTTPStatus

from met_api.utils.enums import ContentType
from tests.utilities.factory_scenarios import TestEventItemTranslationInfo
from tests.utilities.factory_utils import (
    event_item_model_with_language, factory_auth_header, factory_event_item_translation_model)


def test_get_event_item_translation(client, jwt, session):
    """Assert that an event item translation can be fetched by its ID."""
    headers = factory_auth_header(jwt=jwt, claims={})
    item, event, language = event_item_model_with_language()
    event_item_translation = factory_event_item_translation_model(
        {
            **TestEventItemTranslationInfo.event_item_info1.value,
            'event_item_id': item.id,
            'language_id': language.id,
            'description': 'Test Translation',
        }
    )
    session.add(event_item_translation)
    session.commit()

    rv = client.get(
        f'/api/events/{event.id}/translations/{event_item_translation.id}',
        headers=headers,
        content_type=ContentType.JSON.value,
    )

    assert rv.status_code == HTTPStatus.OK
    json_data = rv.json
    assert json_data['id'] == event_item_translation.id


def test_get_event_item_translation_by_language(client, jwt, session):
    """Assert that an event item translation can be fetched by its langauge id."""
    headers = factory_auth_header(jwt=jwt, claims={})
    item, event, language = event_item_model_with_language()
    event_item_translation = factory_event_item_translation_model(
        {
            **TestEventItemTranslationInfo.event_item_info1.value,
            'event_item_id': item.id,
            'language_id': language.id,
            'description': 'Test Translation',
        }
    )

    session.commit()

    rv = client.get(
        f'/api/events/{event.id}/translations/item/{item.id}/language/{language.id}',
        headers=headers,
        content_type=ContentType.JSON.value,
    )

    assert rv.status_code == HTTPStatus.OK
    json_data = rv.json
    assert json_data['id'] == event_item_translation.id


def test_patch_event_item_translation(
    client, jwt, session, setup_admin_user_and_claims
):
    """Assert that an event item translation can be updated using the PATCH API endpoint."""
    _, claims = setup_admin_user_and_claims
    headers = factory_auth_header(jwt=jwt, claims=claims)
    item, event, language = event_item_model_with_language()
    event_item_translation = factory_event_item_translation_model(
        {
            **TestEventItemTranslationInfo.event_item_info1.value,
            'event_item_id': item.id,
            'language_id': language.id,
            'description': 'Old Translation',
        }
    )
    session.commit()

    data = {'description': 'Updated Translation'}
    rv = client.patch(
        f'/api/events/{event.id}/translations/{event_item_translation.id}',
        data=json.dumps(data),
        headers=headers,
        content_type=ContentType.JSON.value,
    )

    assert rv.status_code == HTTPStatus.OK
    json_data = rv.json
    assert json_data['description'] == 'Updated Translation'


def test_delete_event_item_translation(
    client, jwt, session, setup_admin_user_and_claims
):
    """Assert that an event item translation can be deleted using the DELETE API endpoint."""
    _, claims = setup_admin_user_and_claims
    headers = factory_auth_header(jwt=jwt, claims=claims)
    item, event, language = event_item_model_with_language()
    event_item_translation = factory_event_item_translation_model(
        {
            **TestEventItemTranslationInfo.event_item_info1.value,
            'event_item_id': item.id,
            'language_id': language.id,
            'description': 'Translation to Delete',
        }
    )
    session.commit()

    rv = client.delete(
        f'/api/events/{event.id}/translations/{event_item_translation.id}',
        headers=headers,
        content_type=ContentType.JSON.value,
    )

    assert rv.status_code == HTTPStatus.NO_CONTENT


def test_create_event_item_translation(
    client, jwt, session, setup_admin_user_and_claims
):
    """Assert that a new event item translation can be created using the POST API endpoint."""
    _, claims = setup_admin_user_and_claims
    headers = factory_auth_header(jwt=jwt, claims=claims)
    item, event, language = event_item_model_with_language()

    data = {
        **TestEventItemTranslationInfo.event_item_info1.value,
        'event_item_id': item.id,
        'language_id': language.id,
        'description': 'New Translation',
        'pre_populate': False,
    }

    rv = client.post(
        f'/api/events/{event.id}/translations/',
        data=json.dumps(data),
        headers=headers,
        content_type=ContentType.JSON.value,
    )

    assert rv.status_code == HTTPStatus.CREATED
    json_data = rv.json
    assert json_data['description'] == 'New Translation'


def test_create_event_item_translation_with_pre_populate(
    client, jwt, session, setup_admin_user_and_claims
):
    """Assert that a new event item translation can be created using the POST API endpoint."""
    _, claims = setup_admin_user_and_claims
    headers = factory_auth_header(jwt=jwt, claims=claims)
    item, event, language = event_item_model_with_language()

    data = {
        'event_item_id': item.id,
        'language_id': language.id,
        'pre_populate': True,
    }

    rv = client.post(
        f'/api/events/{event.id}/translations/',
        data=json.dumps(data),
        headers=headers,
        content_type=ContentType.JSON.value,
    )

    assert rv.status_code == HTTPStatus.CREATED
    json_data = rv.json
    assert json_data['description'] == item.description
