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

"""Tests to verify the Widget Translation API end-point.

Test-Suite to ensure that the Widget Translation endpoint is working as expected.
"""
import json
from http import HTTPStatus
from marshmallow import ValidationError
from unittest.mock import patch

import pytest
from faker import Faker

from met_api.services.widget_translation_service import WidgetTranslationService
from met_api.utils.enums import ContentType
from tests.utilities.factory_scenarios import TestWidgetInfo, TestWidgetTranslationInfo
from tests.utilities.factory_utils import (
    factory_auth_header, factory_engagement_model, factory_language_model, factory_widget_model,
    factory_widget_translation_model)


fake = Faker()


@pytest.mark.parametrize('widget_translation_info', [TestWidgetTranslationInfo.widgettranslation1])
def test_create_widget_translation(client, jwt, session, widget_translation_info,
                                   setup_admin_user_and_claims):  # pylint:disable=unused-argument
    """Assert that a widget translation can be POSTed."""
    engagement = factory_engagement_model()
    TestWidgetInfo.widget1['engagement_id'] = engagement.id
    widget = factory_widget_model(TestWidgetInfo.widget1)
    language = factory_language_model({'name': 'French', 'code': 'FR', 'right_to_left': False})
    widget_translation_info['widget_id'] = widget.id
    widget_translation_info['language_id'] = language.id
    user, claims = setup_admin_user_and_claims
    headers = factory_auth_header(jwt=jwt, claims=claims)

    rv = client.post(f'/api/widget/{widget.id}/translations/',
                     data=json.dumps(widget_translation_info),
                     headers=headers, content_type=ContentType.JSON.value)
    assert rv.status_code == 200

    rv = client.get(f'/api/widget/{widget.id}/translations/language/{language.id}',
                    headers=headers, content_type=ContentType.JSON.value)
    assert rv.status_code == 200
    assert rv.json[0].get('widget_id') == widget.id

    with patch.object(WidgetTranslationService, 'create_widget_translation', side_effect=ValueError('Test error')):
        rv = client.post(f'/api/widget/{widget.id}/translations/',
                         data=json.dumps(widget_translation_info),
                         headers=headers, content_type=ContentType.JSON.value)
    assert rv.status_code == HTTPStatus.INTERNAL_SERVER_ERROR

    with patch.object(WidgetTranslationService, 'create_widget_translation', side_effect=KeyError('Test error')):
        rv = client.post(f'/api/widget/{widget.id}/translations/',
                         data=json.dumps(widget_translation_info),
                         headers=headers, content_type=ContentType.JSON.value)
    assert rv.status_code == HTTPStatus.INTERNAL_SERVER_ERROR

    with patch.object(WidgetTranslationService, 'create_widget_translation', side_effect=ValidationError('Test error')):
        rv = client.post(f'/api/widget/{widget.id}/translations/',
                         data=json.dumps(widget_translation_info),
                         headers=headers, content_type=ContentType.JSON.value)
    assert rv.status_code == HTTPStatus.BAD_REQUEST


@pytest.mark.parametrize('widget_translation_info', [TestWidgetTranslationInfo.widgettranslation1])
def test_get_widget_translation(client, jwt, session, widget_translation_info,
                                setup_admin_user_and_claims):  # pylint:disable=unused-argument
    """Assert that a widget translation can be fetched."""
    engagement = factory_engagement_model()
    TestWidgetInfo.widget1['engagement_id'] = engagement.id
    widget = factory_widget_model(TestWidgetInfo.widget1)
    language = factory_language_model({'name': 'French', 'code': 'FR', 'right_to_left': False})
    widget_translation_info['widget_id'] = widget.id
    widget_translation_info['language_id'] = language.id
    user, claims = setup_admin_user_and_claims
    headers = factory_auth_header(jwt=jwt, claims=claims)
    rv = client.post(f'/api/widget/{widget.id}/translations/',
                     data=json.dumps(widget_translation_info),
                     headers=headers, content_type=ContentType.JSON.value)
    assert rv.status_code == 200

    rv = client.get(f'/api/widget/{widget.id}/translations/language/{language.id}',
                    headers=headers, content_type=ContentType.JSON.value)
    assert rv.status_code == 200
    assert rv.json[0].get('widget_id') == widget.id

    with patch.object(WidgetTranslationService, 'get_translation_by_widget_id_and_language_id',
                      side_effect=ValueError('Test error')):
        rv = client.get(f'/api/widget/{widget.id}/translations/language/{language.id}',
                        headers=headers, content_type=ContentType.JSON.value)
    assert rv.status_code == HTTPStatus.INTERNAL_SERVER_ERROR


@pytest.mark.parametrize('widget_translation_info', [TestWidgetTranslationInfo.widgettranslation1])
def test_delete_widget_translation(client, jwt, session, widget_translation_info,
                                   setup_admin_user_and_claims):  # pylint:disable=unused-argument
    """Assert that a widget translation can be deleted."""
    engagement = factory_engagement_model()
    TestWidgetInfo.widget1['engagement_id'] = engagement.id
    widget = factory_widget_model(TestWidgetInfo.widget1)
    language = factory_language_model({'name': 'French', 'code': 'FR', 'right_to_left': False})
    widget_translation_info['widget_id'] = widget.id
    widget_translation_info['language_id'] = language.id
    user, claims = setup_admin_user_and_claims
    headers = factory_auth_header(jwt=jwt, claims=claims)
    widget_translation = factory_widget_translation_model(widget_translation_info)

    rv = client.delete(f'/api/widget/{widget.id}/translations/{widget_translation.id}',
                       headers=headers, content_type=ContentType.JSON.value)

    assert rv.status_code == HTTPStatus.OK

    widget_translation = factory_widget_translation_model(widget_translation_info)
    with patch.object(WidgetTranslationService, 'delete_widget_translation',
                      side_effect=ValueError('Test error')):
        rv = client.delete(f'/api/widget/{widget.id}/translations/{widget_translation.id}',
                           headers=headers, content_type=ContentType.JSON.value)
    assert rv.status_code == HTTPStatus.NOT_FOUND

    with patch.object(WidgetTranslationService, 'delete_widget_translation',
                      side_effect=KeyError('Test error')):
        rv = client.delete(f'/api/widget/{widget.id}/translations/{widget_translation.id}',
                           headers=headers, content_type=ContentType.JSON.value)
    assert rv.status_code == HTTPStatus.BAD_REQUEST


@pytest.mark.parametrize('widget_translation_info', [TestWidgetTranslationInfo.widgettranslation1])
def test_patch_widget_translation(client, jwt, session, widget_translation_info,
                                  setup_admin_user_and_claims):  # pylint:disable=unused-argument
    """Assert that a widget translation can be PATCHed."""
    engagement = factory_engagement_model()
    TestWidgetInfo.widget1['engagement_id'] = engagement.id
    widget = factory_widget_model(TestWidgetInfo.widget1)
    language = factory_language_model({'name': 'French', 'code': 'FR', 'right_to_left': False})
    widget_translation_info['widget_id'] = widget.id
    widget_translation_info['language_id'] = language.id
    user, claims = setup_admin_user_and_claims
    headers = factory_auth_header(jwt=jwt, claims=claims)
    widget_translation = factory_widget_translation_model(widget_translation_info)

    data = {
        'title': fake.text(max_nb_chars=10),
    }
    rv = client.patch(f'/api/widget/{widget.id}/translations/{widget_translation.id}',
                      data=json.dumps(data),
                      headers=headers, content_type=ContentType.JSON.value)

    assert rv.status_code == HTTPStatus.OK
    assert rv.json.get('title') == data.get('title')

    with patch.object(WidgetTranslationService, 'update_widget_translation',
                      side_effect=ValueError('Test error')):
        rv = client.patch(f'/api/widget/{widget.id}/translations/{widget_translation.id}',
                          data=json.dumps(data),
                          headers=headers, content_type=ContentType.JSON.value)
    assert rv.status_code == HTTPStatus.NOT_FOUND

    with patch.object(WidgetTranslationService, 'update_widget_translation',
                      side_effect=ValidationError('Test error')):
        rv = client.patch(f'/api/widget/{widget.id}/translations/{widget_translation.id}',
                          data=json.dumps(data),
                          headers=headers, content_type=ContentType.JSON.value)
    assert rv.status_code == HTTPStatus.BAD_REQUEST
