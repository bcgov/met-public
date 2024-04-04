"""Tests to verify the SubscribeItemTranslation API endpoints."""
import json
from http import HTTPStatus

from met_api.utils.enums import ContentType
from tests.utilities.factory_utils import (
    factory_auth_header, factory_subscribe_item_translation_model, subscribe_item_model_with_language)


def test_get_subscribe_item_translation(client, jwt, session):
    """Assert that a subscribe item translation can be fetched by its ID."""
    headers = factory_auth_header(jwt=jwt, claims={})
    item, widget_subscribe, language = subscribe_item_model_with_language()
    subscribe_item_translation = factory_subscribe_item_translation_model(
        {
            'subscribe_item_id': item.id,
            'language_id': language.id,
            'description': 'Test Translation',
        }
    )
    session.add(subscribe_item_translation)
    session.commit()

    rv = client.get(
        f'/api/subscribe/{widget_subscribe.id}/translations/{subscribe_item_translation.id}',
        headers=headers,
        content_type=ContentType.JSON.value,
    )

    assert rv.status_code == HTTPStatus.OK
    json_data = rv.json
    assert json_data['id'] == subscribe_item_translation.id


def test_get_subscribe_item_translation_by_language(client, jwt, session):
    """Assert that a subscribe item translation can be fetched by its language ID."""
    headers = factory_auth_header(jwt=jwt, claims={})
    item, widget_subscribe, language = subscribe_item_model_with_language()
    subscribe_item_translation = factory_subscribe_item_translation_model(
        {
            'subscribe_item_id': item.id,
            'language_id': language.id,
            'description': 'Test Translation',
        }
    )

    session.commit()

    rv = client.get(
        f'/api/subscribe/{widget_subscribe.id}/translations/item/{item.id}/language/{language.id}',
        headers=headers,
        content_type=ContentType.JSON.value,
    )

    assert rv.status_code == HTTPStatus.OK
    json_data = rv.json
    assert json_data['id'] == subscribe_item_translation.id


def test_patch_subscribe_item_translation(client, jwt, session, setup_admin_user_and_claims):
    """Assert that a subscribe item translation can be updated using PATCH."""
    _, claims = setup_admin_user_and_claims
    headers = factory_auth_header(jwt=jwt, claims=claims)
    item, widget_subscribe, language = subscribe_item_model_with_language()
    subscribe_item_translation = factory_subscribe_item_translation_model(
        {
            'subscribe_item_id': item.id,
            'language_id': language.id,
            'description': 'Old Translation',
        }
    )
    session.commit()

    data = {'description': 'Updated Translation'}
    rv = client.patch(
        f'/api/subscribe/{widget_subscribe.id}/translations/{subscribe_item_translation.id}',
        data=json.dumps(data),
        headers=headers,
        content_type=ContentType.JSON.value,
    )

    assert rv.status_code == HTTPStatus.OK
    json_data = rv.json
    assert json_data['description'] == 'Updated Translation'


def test_delete_subscribe_item_translation(client, jwt, session, setup_admin_user_and_claims):
    """Assert that a subscribe item translation can be deleted using DELETE."""
    _, claims = setup_admin_user_and_claims
    headers = factory_auth_header(jwt=jwt, claims=claims)
    item, widget_subscribe, language = subscribe_item_model_with_language()
    subscribe_item_translation = factory_subscribe_item_translation_model(
        {
            'subscribe_item_id': item.id,
            'language_id': language.id,
            'description': 'Translation to Delete',
        }
    )
    session.commit()

    rv = client.delete(
        f'/api/subscribe/{widget_subscribe.id}/translations/{subscribe_item_translation.id}',
        headers=headers,
        content_type=ContentType.JSON.value,
    )

    assert rv.status_code == HTTPStatus.NO_CONTENT


def test_create_subscribe_item_translation(client, jwt, session, setup_admin_user_and_claims):
    """Assert that a new subscribe item translation can be created using POST."""
    _, claims = setup_admin_user_and_claims
    headers = factory_auth_header(jwt=jwt, claims=claims)
    item, widget_subscribe, language = subscribe_item_model_with_language()

    data = {
        'subscribe_item_id': item.id,
        'language_id': language.id,
        'description': 'New Translation',
        'pre_populate': False,
    }

    rv = client.post(
        f'/api/subscribe/{widget_subscribe.id}/translations/',
        data=json.dumps(data),
        headers=headers,
        content_type=ContentType.JSON.value,
    )

    assert rv.status_code == HTTPStatus.CREATED
    json_data = rv.json
    assert json_data['description'] == 'New Translation'
