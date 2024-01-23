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

"""Tests to verify the CAC Form API end-point.

Test-Suite to ensure that the /cacform endpoint is working as expected.
"""
import json
from http import HTTPStatus
from unittest.mock import MagicMock, patch
import pytest

from met_api.exceptions.business_exception import BusinessException
from met_api.services.cac_form_service import CACFormService
from met_api.utils.enums import ContentType
from tests.utilities.factory_scenarios import TestCACForm, TestJwtClaims, TestSubscribeInfo, TestWidgetInfo
from tests.utilities.factory_utils import factory_auth_header, factory_engagement_model, factory_widget_model


def create_widget_subscription(client, jwt, widget_id, headers):
    """Add subscribe widget to the engagement."""
    data = {
        **TestSubscribeInfo.subscribe_info_2.value,
        'widget_id': widget_id,
    }
    return client.post(
        f'/api/widgets/{widget_id}/subscribe',
        data=json.dumps(data),
        headers=headers,
        content_type=ContentType.JSON.value,
    )


def create_cac_form_submission(client, jwt, engagement_id, widget_id, form_data, headers):
    """Create CAC Form data."""
    return client.post(
        f'/api/engagements/{engagement_id}/cacform/{widget_id}',
        data=json.dumps(form_data),
        headers=headers,
        content_type=ContentType.JSON.value,
    )


@pytest.mark.parametrize('side_effect, expected_status', [
    (KeyError('Test error'), HTTPStatus.BAD_REQUEST),
    (ValueError('Test error'), HTTPStatus.BAD_REQUEST),
])
def test_create_form_submission(client, jwt, session, side_effect,
                                expected_status):  # pylint:disable=unused-argument
    """Assert that cac form submission can be POSTed."""
    engagement = factory_engagement_model()
    TestWidgetInfo.widget_subscribe['engagement_id'] = engagement.id
    widget = factory_widget_model(TestWidgetInfo.widget_subscribe)
    form_data = TestCACForm.form_data.value

    headers = factory_auth_header(jwt=jwt, claims=TestJwtClaims.no_role)

    rv = create_widget_subscription(client, jwt, widget.id, headers)
    # Checking response
    assert rv.status_code == HTTPStatus.OK.value

    # Sending POST request for CAC
    rv = create_cac_form_submission(client, jwt, engagement.id, widget.id, form_data, headers)
    # Checking response
    assert rv.status_code == HTTPStatus.OK.value
    response_data = json.loads(rv.data)
    assert response_data.get('engagement_id') == engagement.id

    with patch.object(CACFormService, 'create_form_submission', side_effect=side_effect):
        rv = client.post(
            f'/api/engagements/{engagement.id}/cacform/{widget.id}',
            data=json.dumps(form_data),
            headers=headers,
            content_type=ContentType.JSON.value,
        )
    assert rv.status_code == expected_status

    with patch.object(CACFormService, 'create_form_submission',
                      side_effect=BusinessException('Test error', status_code=HTTPStatus.BAD_REQUEST)):
        rv = client.post(
            f'/api/engagements/{engagement.id}/cacform/{widget.id}',
            data=json.dumps(form_data),
            headers=headers,
            content_type=ContentType.JSON.value,
        )
    assert rv.status_code == HTTPStatus.BAD_REQUEST


@pytest.mark.parametrize('side_effect, expected_status', [
    (KeyError('Test error'), HTTPStatus.INTERNAL_SERVER_ERROR),
    (ValueError('Test error'), HTTPStatus.INTERNAL_SERVER_ERROR),
])
def test_get_cac_form_spreadsheet(mocker, client, jwt, session, side_effect, expected_status,
                                  setup_admin_user_and_claims):  # pylint:disable=unused-argument
    """Assert that cac form submissions sheet can be fetched."""
    user, claims = setup_admin_user_and_claims
    mock_post_generate_document_response = MagicMock()
    mock_post_generate_document_response.content = b'mock data'
    mock_post_generate_document_response.headers = {}
    mock_post_generate_document_response.status_code = 200
    mock_post_generate_document = mocker.patch(
        'met_api.services.cdogs_api_service.CdogsApiService._post_generate_document',
        return_value=mock_post_generate_document_response
    )
    mock_get_access_token = mocker.patch(
        'met_api.services.cdogs_api_service.CdogsApiService._get_access_token',
        return_value='token'
    )

    mock_upload_template_response = MagicMock()
    mock_upload_template_response.headers = {
        'X-Template-Hash': 'hash_code'
    }
    mock_upload_template_response.status_code = 200
    mock_post_upload_template = mocker.patch(
        'met_api.services.cdogs_api_service.CdogsApiService._post_upload_template',
        return_value=mock_upload_template_response
    )

    engagement = factory_engagement_model()
    TestWidgetInfo.widget_subscribe['engagement_id'] = engagement.id
    widget = factory_widget_model(TestWidgetInfo.widget_subscribe)
    form_data = TestCACForm.form_data.value

    headers = factory_auth_header(jwt=jwt, claims=TestJwtClaims.no_role)

    rv = create_widget_subscription(client, jwt, widget.id, headers)
    assert rv.status_code == HTTPStatus.OK.value

    # Sending POST request for CAC
    rv = create_cac_form_submission(client, jwt, engagement.id, widget.id, form_data, headers)
    assert rv.status_code == HTTPStatus.OK.value

    headers = factory_auth_header(jwt=jwt, claims=claims)
    rv = client.get(f'/api/engagements/{engagement.id}/cacform/sheet',
                    headers=headers, content_type=ContentType.JSON.value)
    assert rv.status_code == 200
    mock_post_generate_document.assert_called()
    mock_get_access_token.assert_called()
    mock_post_upload_template.assert_called()

    with patch.object(CACFormService, 'export_cac_form_submissions_to_spread_sheet', side_effect=side_effect):
        rv = client.get(f'/api/engagements/{engagement.id}/cacform/sheet',
                        headers=headers, content_type=ContentType.JSON.value)
    assert rv.status_code == expected_status
