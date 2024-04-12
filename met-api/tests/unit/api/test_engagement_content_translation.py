"""Tests to verify the EngagementContentTranslation API endpoints."""

import json
from http import HTTPStatus

from met_api.utils.enums import ContentType
from tests.utilities.factory_scenarios import TestEngagementContentTranslationInfo
from tests.utilities.factory_utils import (
    engagement_content_model_with_language, factory_auth_header, factory_engagement_content_translation_model)


def test_get_engagement_content_translation(client, jwt, session):
    """Assert that an engagement content translation can be fetched by its ID."""
    headers = factory_auth_header(jwt=jwt, claims={})
    content, language = engagement_content_model_with_language()
    engagement_content_translation = factory_engagement_content_translation_model(
        {
            **TestEngagementContentTranslationInfo.translation_info1.value,
            'engagement_content_id': content.id,
            'language_id': language.id,
        }
    )
    session.add(engagement_content_translation)
    session.commit()

    rv = client.get(
        f'/api/engagement_content/{content.id}/translations/{engagement_content_translation.id}',
        headers=headers,
        content_type=ContentType.JSON.value
    )

    assert rv.status_code == HTTPStatus.OK
    json_data = rv.json
    assert json_data['id'] == engagement_content_translation.id


def test_get_engagement_content_translation_by_language(client, jwt, session):
    """Assert that engagement content translations can be fetched by content ID and Language ID."""
    headers = factory_auth_header(jwt=jwt, claims={})
    content, language = engagement_content_model_with_language()
    engagement_content_translation = factory_engagement_content_translation_model(
        {
            **TestEngagementContentTranslationInfo.translation_info1.value,
            'engagement_content_id': content.id,
            'language_id': language.id,
        }
    )
    session.add(engagement_content_translation)
    session.commit()

    rv = client.get(
        f'/api/engagement_content/{content.id}/translations/language/{language.id}',
        headers=headers,
        content_type=ContentType.JSON.value
    )

    assert rv.status_code == HTTPStatus.OK
    json_data = rv.json
    assert json_data[0]['id'] == engagement_content_translation.id


def test_create_engagement_content_translation(client, jwt, session, setup_admin_user_and_claims):
    """Assert that a new engagement content translation can be created using the POST API endpoint."""
    _, claims = setup_admin_user_and_claims
    headers = factory_auth_header(jwt=jwt, claims=claims)
    content, language = engagement_content_model_with_language()

    session.commit()

    data = {
        **TestEngagementContentTranslationInfo.translation_info1.value,
        'engagement_content_id': content.id,
        'language_id': language.id,
        'pre_populate': False
    }

    rv = client.post(
        f'/api/engagement_content/{content.id}/translations/',
        data=json.dumps(data),
        headers=headers,
        content_type=ContentType.JSON.value
    )

    assert rv.status_code == HTTPStatus.CREATED
    json_data = rv.json
    assert json_data['content_title'] == TestEngagementContentTranslationInfo.translation_info1.value['content_title']


def test_update_engagement_content_translation(client, jwt, session, setup_admin_user_and_claims):
    """Assert that an engagement content translation can be updated using the PATCH API endpoint."""
    _, claims = setup_admin_user_and_claims
    headers = factory_auth_header(jwt=jwt, claims=claims)
    content, language = engagement_content_model_with_language()
    engagement_content_translation = factory_engagement_content_translation_model(
        {
            **TestEngagementContentTranslationInfo.translation_info1.value,
            'engagement_content_id': content.id,
            'language_id': language.id,
        }
    )
    session.commit()

    updated_data = {'content_title': 'Updated Translation'}
    rv = client.patch(
        f'/api/engagement_content/{content.id}/translations/{engagement_content_translation.id}',
        data=json.dumps(updated_data),
        headers=headers,
        content_type=ContentType.JSON.value
    )

    assert rv.status_code == HTTPStatus.OK
    json_data = rv.json
    assert json_data['content_title'] == 'Updated Translation'


def test_delete_engagement_content_translation(client, jwt, session, setup_admin_user_and_claims):
    """Assert that an engagement content translation can be deleted using the DELETE API endpoint."""
    _, claims = setup_admin_user_and_claims
    headers = factory_auth_header(jwt=jwt, claims=claims)
    content, language = engagement_content_model_with_language()
    engagement_content_translation = factory_engagement_content_translation_model(
        {
            **TestEngagementContentTranslationInfo.translation_info1.value,
            'engagement_content_id': content.id,
            'language_id': language.id,
        }
    )
    session.commit()

    rv = client.delete(
        f'/api/engagement_content/{content.id}/translations/{engagement_content_translation.id}',
        headers=headers,
        content_type=ContentType.JSON.value
    )

    assert rv.status_code == HTTPStatus.NO_CONTENT
