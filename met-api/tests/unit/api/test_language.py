"""Tests to verify the Language API endpoints.

Test-Suite to ensure that the Language API endpoints are working as expected.
"""
from http import HTTPStatus

from faker import Faker
from met_api.utils.enums import ContentType
from tests.utilities.factory_utils import factory_auth_header

fake = Faker()


def test_get_language(client, jwt, session):
    """Assert that the get language by ID API endpoint is working as expected."""
    headers = factory_auth_header(jwt=jwt, claims={})

    rv = client.get(
        '/api/languages/42',
        headers=headers,
        content_type=ContentType.JSON.value,
    )

    assert rv.status_code == HTTPStatus.OK
    json_data = rv.json
    assert json_data['name'] == 'English'


def test_get_languages(client, jwt, session):
    """Assert that the get all languages API endpoint is working as expected."""
    headers = factory_auth_header(jwt=jwt, claims={})

    rv = client.get(
        '/api/languages/',
        headers=headers,
        content_type=ContentType.JSON.value,
    )

    assert rv.status_code == HTTPStatus.OK
    json_data = rv.json
    assert len(json_data) > 0


def test_add_language_tenant_mapping(client, jwt, session, setup_admin_user_and_claims):
    """Assert that a new language can be added to a tenant."""
    _, claims = setup_admin_user_and_claims
    headers = factory_auth_header(jwt=jwt, claims=claims)

    rv = client.post(
        '/api/languages/42/tenant/gdx',
        headers=headers,
        content_type=ContentType.JSON.value,
    )

    assert rv.status_code == HTTPStatus.OK


def test_delete_language_tenant_mapping(client, jwt, session, setup_admin_user_and_claims):
    """Assert that a language can be removed from a tenant."""
    _, claims = setup_admin_user_and_claims
    headers = factory_auth_header(jwt=jwt, claims=claims)

    rv = client.delete(
        '/api/languages/42/tenant/gdx',
        headers=headers,
        content_type=ContentType.JSON.value,
    )

    assert rv.status_code == HTTPStatus.OK
    assert rv.json.get('status') == 'success'
