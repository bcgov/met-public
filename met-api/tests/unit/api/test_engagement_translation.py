# Copyright © 2019 Province of British Columbia
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

"""Tests to verify the Engagement Translation API end-point.

Test-Suite to ensure that the Engagement Translation endpoint is working as expected.
"""
import json
from http import HTTPStatus
from marshmallow import ValidationError
from unittest.mock import patch

import pytest
from faker import Faker

from met_api.exceptions.business_exception import BusinessException
from met_api.services.engagement_translation_service import EngagementTranslationService
from met_api.utils.enums import ContentType
from tests.utilities.factory_scenarios import TestEngagementInfo, TestEngagementTranslationInfo
from tests.utilities.factory_utils import (
    factory_auth_header, factory_engagement_model, factory_engagement_translation_model, factory_language_model)


fake = Faker()


@pytest.mark.parametrize('engagement_translation_info', [TestEngagementTranslationInfo.engagementtranslation1])
@pytest.mark.parametrize('engagement_info', [TestEngagementInfo.engagement1])
def test_create_engagement_translation(client, jwt, session, engagement_translation_info, engagement_info,
                                       setup_admin_user_and_claims):  # pylint:disable=unused-argument
    """Assert that a engagement translation can be POSTed."""
    user, claims = setup_admin_user_and_claims
    headers = factory_auth_header(jwt=jwt, claims=claims)
    rv = client.post('/api/engagements/', data=json.dumps(engagement_info),
                     headers=headers, content_type=ContentType.JSON.value)
    assert rv.status_code == 200
    engagement_id = rv.json.get('id')
    language = factory_language_model({'name': 'French', 'code': 'FR', 'right_to_left': False})
    engagement_translation_info['engagement_id'] = engagement_id
    engagement_translation_info['language_id'] = language.id

    rv = client.post(f'/api/engagement/{engagement_id}/translations/',
                     data=json.dumps(engagement_translation_info),
                     headers=headers, content_type=ContentType.JSON.value)
    assert rv.status_code == HTTPStatus.OK

    rv = client.get(f'/api/engagement/{engagement_id}/translations/language/{language.id}',
                    headers=headers, content_type=ContentType.JSON.value)
    assert rv.status_code == HTTPStatus.OK
    assert rv.json[0].get('engagement_id') == engagement_id

    with patch.object(EngagementTranslationService, 'create_engagement_translation',
                      side_effect=ValueError('Test error')):
        rv = client.post(f'/api/engagement/{engagement_id}/translations/',
                         data=json.dumps(engagement_translation_info),
                         headers=headers, content_type=ContentType.JSON.value)
    assert rv.status_code == HTTPStatus.INTERNAL_SERVER_ERROR

    with patch.object(EngagementTranslationService, 'create_engagement_translation',
                      side_effect=KeyError('Test error')):
        rv = client.post(f'/api/engagement/{engagement_id}/translations/',
                         data=json.dumps(engagement_translation_info),
                         headers=headers, content_type=ContentType.JSON.value)
    assert rv.status_code == HTTPStatus.INTERNAL_SERVER_ERROR

    with patch.object(EngagementTranslationService, 'create_engagement_translation',
                      side_effect=ValidationError('Test error')):
        rv = client.post(f'/api/engagement/{engagement_id}/translations/',
                         data=json.dumps(engagement_translation_info),
                         headers=headers, content_type=ContentType.JSON.value)
    assert rv.status_code == HTTPStatus.BAD_REQUEST

    with patch.object(EngagementTranslationService, 'create_engagement_translation',
                      side_effect=BusinessException('Test error', status_code=HTTPStatus.CONFLICT)):
        rv = client.post(f'/api/engagement/{engagement_id}/translations/',
                         data=json.dumps(engagement_translation_info),
                         headers=headers, content_type=ContentType.JSON.value)
    assert rv.status_code == HTTPStatus.CONFLICT


@pytest.mark.parametrize('engagement_translation_info', [TestEngagementTranslationInfo.engagementtranslation1])
@pytest.mark.parametrize('engagement_info', [TestEngagementInfo.engagement1])
def test_get_engagement_translation(client, jwt, session, engagement_translation_info, engagement_info,
                                    setup_admin_user_and_claims):  # pylint:disable=unused-argument
    """Assert that a engagement translation can be fetched."""
    user, claims = setup_admin_user_and_claims
    headers = factory_auth_header(jwt=jwt, claims=claims)
    rv = client.post('/api/engagements/', data=json.dumps(engagement_info),
                     headers=headers, content_type=ContentType.JSON.value)
    assert rv.status_code == 200
    engagement_id = rv.json.get('id')
    language = factory_language_model({'name': 'French', 'code': 'FR', 'right_to_left': False})
    engagement_translation_info['engagement_id'] = engagement_id
    engagement_translation_info['language_id'] = language.id

    rv = client.post(f'/api/engagement/{engagement_id}/translations/',
                     data=json.dumps(engagement_translation_info),
                     headers=headers, content_type=ContentType.JSON.value)
    assert rv.status_code == HTTPStatus.OK

    rv = client.get(f'/api/engagement/{engagement_id}/translations/language/{language.id}',
                    headers=headers, content_type=ContentType.JSON.value)
    assert rv.status_code == HTTPStatus.OK
    assert rv.json[0].get('engagement_id') == engagement_id

    with patch.object(EngagementTranslationService, 'get_translation_by_engagement_and_language',
                      side_effect=ValueError('Test error')):
        rv = client.get(f'/api/engagement/{engagement_id}/translations/language/{language.id}',
                        headers=headers, content_type=ContentType.JSON.value)
    assert rv.status_code == HTTPStatus.INTERNAL_SERVER_ERROR

    with patch.object(EngagementTranslationService, 'get_translation_by_engagement_and_language',
                      side_effect=KeyError('Test error')):
        rv = client.get(f'/api/engagement/{engagement_id}/translations/language/{language.id}',
                        headers=headers, content_type=ContentType.JSON.value)
    assert rv.status_code == HTTPStatus.INTERNAL_SERVER_ERROR


@pytest.mark.parametrize('engagement_translation_info', [TestEngagementTranslationInfo.engagementtranslation1])
def test_delete_engagement_translation(client, jwt, session, engagement_translation_info,
                                       setup_admin_user_and_claims):  # pylint:disable=unused-argument
    """Assert that a engagement translation can be deleted."""
    engagement = factory_engagement_model()
    language = factory_language_model({'name': 'French', 'code': 'FR', 'right_to_left': False})
    engagement_translation_info['engagement_id'] = engagement.id
    engagement_translation_info['language_id'] = language.id
    user, claims = setup_admin_user_and_claims
    headers = factory_auth_header(jwt=jwt, claims=claims)
    engagement_translation = factory_engagement_translation_model(engagement_translation_info)

    rv = client.delete(f'/api/engagement/{engagement.id}/translations/{engagement_translation.id}',
                       headers=headers, content_type=ContentType.JSON.value)

    assert rv.status_code == HTTPStatus.OK

    engagement_translation = factory_engagement_translation_model(engagement_translation_info)
    with patch.object(EngagementTranslationService, 'delete_engagement_translation',
                      side_effect=ValueError('Test error')):
        rv = client.delete(f'/api/engagement/{engagement.id}/translations/{engagement_translation.id}',
                           headers=headers, content_type=ContentType.JSON.value)
    assert rv.status_code == HTTPStatus.NOT_FOUND

    with patch.object(EngagementTranslationService, 'delete_engagement_translation',
                      side_effect=KeyError('Test error')):
        rv = client.delete(f'/api/engagement/{engagement.id}/translations/{engagement_translation.id}',
                           headers=headers, content_type=ContentType.JSON.value)
    assert rv.status_code == HTTPStatus.BAD_REQUEST


@pytest.mark.parametrize('engagement_translation_info', [TestEngagementTranslationInfo.engagementtranslation1])
def test_patch_engagement_translation(client, jwt, session, engagement_translation_info,
                                      setup_admin_user_and_claims):  # pylint:disable=unused-argument
    """Assert that a engagement translation can be PATCHed."""
    engagement = factory_engagement_model()
    language = factory_language_model({'name': 'French', 'code': 'FR', 'right_to_left': False})
    engagement_translation_info['engagement_id'] = engagement.id
    engagement_translation_info['language_id'] = language.id
    user, claims = setup_admin_user_and_claims
    headers = factory_auth_header(jwt=jwt, claims=claims)
    engagement_translation = factory_engagement_translation_model(engagement_translation_info)

    data = {
        'name': fake.text(max_nb_chars=10),
    }
    rv = client.patch(f'/api/engagement/{engagement.id}/translations/{engagement_translation.id}',
                      data=json.dumps(data),
                      headers=headers, content_type=ContentType.JSON.value)

    assert rv.status_code == HTTPStatus.OK
    assert rv.json.get('name') == data.get('name')

    with patch.object(EngagementTranslationService, 'update_engagement_translation',
                      side_effect=ValueError('Test error')):
        rv = client.patch(f'/api/engagement/{engagement.id}/translations/{engagement_translation.id}',
                          data=json.dumps(data),
                          headers=headers, content_type=ContentType.JSON.value)
    assert rv.status_code == HTTPStatus.NOT_FOUND

    with patch.object(EngagementTranslationService, 'update_engagement_translation',
                      side_effect=ValidationError('Test error')):
        rv = client.patch(f'/api/engagement/{engagement.id}/translations/{engagement_translation.id}',
                          data=json.dumps(data),
                          headers=headers, content_type=ContentType.JSON.value)
    assert rv.status_code == HTTPStatus.BAD_REQUEST


@pytest.mark.parametrize('engagement_translation_info', [TestEngagementTranslationInfo.engagementtranslation1])
def test_get_engagement_translation_by_id(client, jwt, session, engagement_translation_info,
                                          setup_admin_user_and_claims):  # pylint:disable=unused-argument
    """Assert that a engagement translation can be fetched by id."""
    engagement = factory_engagement_model()
    language = factory_language_model({'name': 'French', 'code': 'FR', 'right_to_left': False})
    engagement_translation_info['engagement_id'] = engagement.id
    engagement_translation_info['language_id'] = language.id
    user, claims = setup_admin_user_and_claims
    headers = factory_auth_header(jwt=jwt, claims=claims)
    engagement_translation = factory_engagement_translation_model(engagement_translation_info)

    rv = client.get(f'/api/engagement/{engagement.id}/translations/{engagement_translation.id}',
                    headers=headers, content_type=ContentType.JSON.value)
    assert rv.status_code == HTTPStatus.OK
    json_data = rv.json
    assert json_data['engagement_id'] == engagement.id

    with patch.object(EngagementTranslationService, 'get_engagement_translation_by_id',
                      side_effect=ValueError('Test error')):
        rv = client.get(f'/api/engagement/{engagement.id}/translations/{engagement_translation.id}',
                        headers=headers, content_type=ContentType.JSON.value)
    assert rv.status_code == HTTPStatus.INTERNAL_SERVER_ERROR

    with patch.object(EngagementTranslationService, 'get_engagement_translation_by_id',
                      side_effect=KeyError('Test error')):
        rv = client.get(f'/api/engagement/{engagement.id}/translations/{engagement_translation.id}',
                        headers=headers, content_type=ContentType.JSON.value)
    assert rv.status_code == HTTPStatus.INTERNAL_SERVER_ERROR
