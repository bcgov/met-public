"""Tests to verify the Language API endpoints.

Test-Suite to ensure that the Language API endpoints are working as expected.
"""
import json
from http import HTTPStatus

from faker import Faker
from met_api.utils.enums import ContentType
from tests.utilities.factory_utils import factory_auth_header, factory_language_model

fake = Faker()


def test_get_language(client, jwt, session):
    """Assert that the get language by ID API endpoint is working as expected."""
    headers = factory_auth_header(jwt=jwt, claims={})
    language = factory_language_model({'name': 'French', 'code': 'fr', 'right_to_left': False})
    session.add(language)
    session.commit()

    rv = client.get(
        f'/api/languages/{language.id}',
        headers=headers,
        content_type=ContentType.JSON.value,
    )

    assert rv.status_code == HTTPStatus.OK
    json_data = rv.json
    assert json_data['name'] == 'French'


def test_get_languages(client, jwt, session):
    """Assert that the get all languages API endpoint is working as expected."""
    headers = factory_auth_header(jwt=jwt, claims={})
    factory_language_model({'name': 'German', 'code': 'de', 'right_to_left': False})
    session.commit()

    rv = client.get(
        '/api/languages/',
        headers=headers,
        content_type=ContentType.JSON.value,
    )

    assert rv.status_code == HTTPStatus.OK
    json_data = rv.json
    assert len(json_data) > 0
