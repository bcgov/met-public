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

"""Tests to verify the engagement content API end-point.

Test-Suite to ensure that the engagement content endpoint is working as expected.
"""
import json
from http import HTTPStatus
from marshmallow import ValidationError
from unittest.mock import patch

import pytest
from faker import Faker

from met_api.constants.engagement_content_type import EngagementContentType
from met_api.services.engagement_content_service import EngagementContentService
from met_api.utils.enums import ContentType
from tests.utilities.factory_scenarios import TestEngagementContentInfo
from tests.utilities.factory_utils import factory_auth_header, factory_engagement_model


fake = Faker()


@pytest.mark.parametrize('engagement_content_info', [TestEngagementContentInfo.content1])
def test_create_engagement_content(client, jwt, session, engagement_content_info,
                                   setup_admin_user_and_claims):  # pylint:disable=unused-argument
    """Assert that a engagement content can be POSTed."""
    engagement = factory_engagement_model()
    engagement_content_info['engagement_id'] = engagement.id
    user, claims = setup_admin_user_and_claims
    headers = factory_auth_header(jwt=jwt, claims=claims)
    rv = client.post(f'/api/engagement/{engagement.id}/content',
                     data=json.dumps(engagement_content_info),
                     headers=headers, content_type=ContentType.JSON.value)
    assert rv.status_code == 200

    rv = client.get(f'/api/engagement/{engagement.id}/content',
                    headers=headers, content_type=ContentType.JSON.value)
    assert rv.status_code == 200
    assert rv.json[0].get('sort_index') == 1

    with patch.object(EngagementContentService, 'create_engagement_content',
                      side_effect=ValueError('Test error')):
        rv = client.post(f'/api/engagement/{engagement.id}/content',
                         data=json.dumps(engagement_content_info),
                         headers=headers, content_type=ContentType.JSON.value)
    assert rv.status_code == HTTPStatus.INTERNAL_SERVER_ERROR

    with patch.object(EngagementContentService, 'create_engagement_content',
                      side_effect=ValidationError('Test error')):
        rv = client.post(f'/api/engagement/{engagement.id}/content',
                         data=json.dumps(engagement_content_info),
                         headers=headers, content_type=ContentType.JSON.value)
    assert rv.status_code == HTTPStatus.INTERNAL_SERVER_ERROR


@pytest.mark.parametrize('engagement_content_info', [TestEngagementContentInfo.content1])
def test_get_engagement_content(client, jwt, session, engagement_content_info,
                                setup_admin_user_and_claims):  # pylint:disable=unused-argument
    """Assert that a engagement content can be fetched."""
    engagement = factory_engagement_model()
    engagement_content_info['engagement_id'] = engagement.id
    user, claims = setup_admin_user_and_claims
    headers = factory_auth_header(jwt=jwt, claims=claims)
    rv = client.post(f'/api/engagement/{engagement.id}/content',
                     data=json.dumps(engagement_content_info),
                     headers=headers, content_type=ContentType.JSON.value)
    assert rv.status_code == 200

    rv = client.get(f'/api/engagement/{engagement.id}/content',
                    headers=headers, content_type=ContentType.JSON.value)
    assert rv.status_code == 200
    assert rv.json[0].get('sort_index') == 1

    with patch.object(EngagementContentService, 'get_contents_by_engagement_id', side_effect=ValueError('Test error')):
        rv = client.get(f'/api/engagement/{engagement.id}/content',
                        headers=headers, content_type=ContentType.JSON.value)
    assert rv.status_code == HTTPStatus.INTERNAL_SERVER_ERROR


def test_create_engagement_content_sort(client, jwt, session,
                                        setup_admin_user_and_claims):  # pylint:disable=unused-argument
    """Assert that a engagement content can be sorted."""
    engagement = factory_engagement_model()
    engagement_content_info_1 = TestEngagementContentInfo.content1
    engagement_content_info_1['engagement_id'] = engagement.id
    user, claims = setup_admin_user_and_claims
    headers = factory_auth_header(jwt=jwt, claims=claims)
    rv = client.post(f'/api/engagement/{engagement.id}/content',
                     data=json.dumps(engagement_content_info_1),
                     headers=headers, content_type=ContentType.JSON.value)
    assert rv.status_code == 200

    engagement_content_info_2 = TestEngagementContentInfo.content2
    engagement_content_info_2['engagement_id'] = engagement.id
    headers = factory_auth_header(jwt=jwt, claims=claims)
    rv = client.post(f'/api/engagement/{engagement.id}/content',
                     data=json.dumps(engagement_content_info_2),
                     headers=headers, content_type=ContentType.JSON.value)
    assert rv.status_code == 200

    rv = client.get(f'/api/engagement/{engagement.id}/content',
                    headers=headers, content_type=ContentType.JSON.value)
    assert rv.status_code == 200
    assert len(rv.json) == 2, 'Two Contents Should exist.'
    engagement_contents = rv.json
    summary_content = _find_engagement_content(engagement_contents, EngagementContentType.Summary.name)
    assert summary_content.get('sort_index') == 1

    custom_content = _find_engagement_content(engagement_contents, EngagementContentType.Custom.name)
    assert custom_content.get('sort_index') == 2

    # Do reorder

    reorder_dict = [
        {
            'id': custom_content.get('id'),
        },
        {
            'id': summary_content.get('id'),
        }
    ]

    rv = client.patch(f'/api/engagement/{engagement.id}/content/sort_index',
                      data=json.dumps(reorder_dict),
                      headers=headers, content_type=ContentType.JSON.value)
    assert rv.status_code == 204

    rv = client.get(f'/api/engagement/{engagement.id}/content',
                    headers=headers, content_type=ContentType.JSON.value)
    engagement_contents = rv.json
    summary_content = _find_engagement_content(engagement_contents, EngagementContentType.Summary.name)
    assert summary_content.get('sort_index') == 2

    custom_content = _find_engagement_content(engagement_contents, EngagementContentType.Custom.name)
    assert custom_content.get('sort_index') == 1


def _find_engagement_content(engagement_contents, content_type):
    search_result = next(x for x in engagement_contents if x.get('content_type') == content_type)
    return search_result


def test_create_engagement_content_sort_invalid(client, jwt, session,
                                                setup_admin_user_and_claims):  # pylint:disable=unused-argument
    """Assert that a engagement content sort error handling is done."""
    engagement = factory_engagement_model()
    engagement_content_info_1 = TestEngagementContentInfo.content1
    engagement_content_info_1['engagement_id'] = engagement.id
    user, claims = setup_admin_user_and_claims
    headers = factory_auth_header(jwt=jwt, claims=claims)
    rv = client.post(f'/api/engagement/{engagement.id}/content',
                     data=json.dumps(engagement_content_info_1),
                     headers=headers, content_type=ContentType.JSON.value)
    assert rv.status_code == 200

    # invalid reorder
    reorder_dict = [{
        'id': 123,
        'sort_index': 2
    }, {
        'id': 1234,
        'sort_index': 1
    }
    ]
    rv = client.patch(f'/api/engagement/{engagement.id}/content/sort_index',
                      data=json.dumps(reorder_dict),
                      headers=headers, content_type=ContentType.JSON.value)
    assert rv.status_code == HTTPStatus.BAD_REQUEST


def test_delete_engagement_content(client, jwt, session,
                                   setup_admin_user_and_claims):  # pylint:disable=unused-argument
    """Assert that a engagement content can be deleted."""
    engagement = factory_engagement_model()
    engagement_content_info_1 = TestEngagementContentInfo.content1
    engagement_content_info_1['engagement_id'] = engagement.id
    user, claims = setup_admin_user_and_claims
    headers = factory_auth_header(jwt=jwt, claims=claims)
    rv = client.post(f'/api/engagement/{engagement.id}/content',
                     data=json.dumps(engagement_content_info_1),
                     headers=headers, content_type=ContentType.JSON.value)
    assert rv.status_code == 200
    response_json = rv.json
    created_content_id = response_json.get('id')

    rv = client.delete(f'/api/engagement/{engagement.id}/content/{created_content_id}',
                       headers=headers, content_type=ContentType.JSON.value)

    assert rv.status_code == HTTPStatus.OK

    rv = client.post(f'/api/engagement/{engagement.id}/content',
                     data=json.dumps(engagement_content_info_1),
                     headers=headers, content_type=ContentType.JSON.value)
    assert rv.status_code == 200
    response_json = rv.json
    created_content_id = response_json.get('id')

    with patch.object(EngagementContentService, 'delete_engagement_content',
                      side_effect=ValueError('Test error')):
        rv = client.delete(f'/api/engagement/{engagement.id}/content/{created_content_id}',
                           headers=headers, content_type=ContentType.JSON.value)
    assert rv.status_code == HTTPStatus.INTERNAL_SERVER_ERROR


def test_patch_engagement_content(client, jwt, session,
                                  setup_admin_user_and_claims):  # pylint:disable=unused-argument
    """Assert that a engagement content can be PATCHed."""
    engagement = factory_engagement_model()
    engagement_content_info_1 = TestEngagementContentInfo.content1
    engagement_content_info_1['engagement_id'] = engagement.id
    user, claims = setup_admin_user_and_claims
    headers = factory_auth_header(jwt=jwt, claims=claims)
    rv = client.post(f'/api/engagement/{engagement.id}/content',
                     data=json.dumps(engagement_content_info_1),
                     headers=headers, content_type=ContentType.JSON.value)
    assert rv.status_code == 200
    response_json = rv.json
    created_content_id = response_json.get('id')

    data = {
        'title': fake.text(max_nb_chars=10),
    }
    rv = client.patch(f'/api/engagement/{engagement.id}/content/{created_content_id}',
                      data=json.dumps(data),
                      headers=headers, content_type=ContentType.JSON.value)

    assert rv.status_code == HTTPStatus.OK
    assert rv.json.get('title') == data.get('title')

    with patch.object(EngagementContentService, 'update_engagement_content',
                      side_effect=ValueError('Test error')):
        rv = client.patch(f'/api/engagement/{engagement.id}/content/{created_content_id}',
                          data=json.dumps(data),
                          headers=headers, content_type=ContentType.JSON.value)
    assert rv.status_code == HTTPStatus.INTERNAL_SERVER_ERROR

    with patch.object(EngagementContentService, 'update_engagement_content',
                      side_effect=ValidationError('Test error')):
        rv = client.patch(f'/api/engagement/{engagement.id}/content/{created_content_id}',
                          data=json.dumps(data),
                          headers=headers, content_type=ContentType.JSON.value)
    assert rv.status_code == HTTPStatus.INTERNAL_SERVER_ERROR
