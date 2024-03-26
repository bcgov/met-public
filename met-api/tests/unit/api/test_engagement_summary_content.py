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

"""Tests to verify the engagement summary content API end-point.

Test-Suite to ensure that the engagement summary content endpoint is working as expected.
"""
import json
from http import HTTPStatus
from unittest.mock import patch

import pytest
from faker import Faker

from met_api.exceptions.business_exception import BusinessException
from met_api.services.engagement_summary_content_service import EngagementSummaryContentService
from met_api.utils.enums import ContentType
from tests.utilities.factory_scenarios import TestEngagementContentInfo
from tests.utilities.factory_utils import factory_auth_header, factory_engagement_model


fake = Faker()


@pytest.mark.parametrize('engagement_content_info', [TestEngagementContentInfo.content1])
def test_engagement_summary_content(client, jwt, session, engagement_content_info,
                                    setup_admin_user_and_claims):  # pylint:disable=unused-argument
    """Assert that a engagement summary content can be POSTed."""
    engagement = factory_engagement_model()
    engagement_content_info['engagement_id'] = engagement.id
    user, claims = setup_admin_user_and_claims
    headers = factory_auth_header(jwt=jwt, claims=claims)
    rv = client.post(f'/api/engagement/{engagement.id}/content',
                     data=json.dumps(engagement_content_info),
                     headers=headers, content_type=ContentType.JSON.value)
    assert rv.status_code == 200
    response_json = rv.json
    created_content_id = response_json.get('id')

    data = {
        'content': 'Content Sample',
        'rich_content': '"{\"blocks\":[{\"key\":\"fclgj\",\"text\":\"Rich Content Sample\",\"type\":\"unstyled\",\"depth\":0,\
        \"inlineStyleRanges\":[],\"entityRanges\":[],\"data\":{}}],\"entityMap\":{}}"',
        'engagement_id': engagement.id
    }

    rv = client.post(
        f'/api/content/{created_content_id}/summary',
        data=json.dumps(data),
        headers=headers,
        content_type=ContentType.JSON.value
    )
    assert rv.status_code == HTTPStatus.OK.value

    with patch.object(EngagementSummaryContentService, 'create_summary_content',
                      side_effect=BusinessException('Test error', status_code=HTTPStatus.BAD_REQUEST)):
        rv = client.post(
            f'/api/content/{created_content_id}/summary',
            data=json.dumps(data),
            headers=headers,
            content_type=ContentType.JSON.value
        )
    assert rv.status_code == HTTPStatus.BAD_REQUEST

    rv = client.get(
        f'/api/content/{created_content_id}/summary',
        headers=headers,
        content_type=ContentType.JSON.value
    )
    assert rv.status_code == HTTPStatus.OK.value
    assert rv.json[0].get('content') == data.get('content')

    with patch.object(EngagementSummaryContentService, 'get_summary_content',
                      side_effect=BusinessException('Test error', status_code=HTTPStatus.BAD_REQUEST)):
        rv = client.get(
            f'/api/content/{created_content_id}/summary',
            headers=headers,
            content_type=ContentType.JSON.value
        )
    assert rv.status_code == HTTPStatus.BAD_REQUEST

    data_edits = {
        'content': fake.text(max_nb_chars=10)
    }

    rv = client.patch(
        f'/api/content/{created_content_id}/summary',
        data=json.dumps(data_edits),
        headers=headers,
        content_type=ContentType.JSON.value
    )
    assert rv.status_code == HTTPStatus.OK

    rv = client.get(
        f'/api/content/{created_content_id}/summary',
        headers=headers,
        content_type=ContentType.JSON.value
    )
    assert rv.status_code == HTTPStatus.OK.value
    assert rv.json[0].get('content') == data_edits.get('content')

    with patch.object(EngagementSummaryContentService, 'update_summary_content',
                      side_effect=BusinessException('Test error', status_code=HTTPStatus.BAD_REQUEST)):
        rv = client.patch(
            f'/api/content/{created_content_id}/summary',
            data=json.dumps(data_edits),
            headers=headers,
            content_type=ContentType.JSON.value
        )
    assert rv.status_code == HTTPStatus.BAD_REQUEST
