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

"""Tests to verify the comment API end-point.

Test-Suite to ensure that the /Comment endpoint is working as expected.
"""
import json
from unittest.mock import MagicMock, patch

from faker import Faker

from met_api.constants.staff_note_type import StaffNoteType
from met_api.utils import notification
from met_api.utils.enums import ContentType
from tests.utilities.factory_scenarios import TestJwtClaims
from tests.utilities.factory_utils import (
    factory_auth_header, factory_comment_model, factory_submission_model, factory_survey_and_eng_model,
    factory_tenant_model, factory_user_model, set_global_tenant
)

fake = Faker()


def test_get_comments(client, jwt, session):  # pylint:disable=unused-argument
    """Assert that comments can be fetched."""
    claims = TestJwtClaims.public_user_role

    user_details = factory_user_model()
    survey, eng = factory_survey_and_eng_model()
    submission = factory_submission_model(survey.id, eng.id, user_details.id)
    factory_comment_model(survey.id, submission.id)
    headers = factory_auth_header(jwt=jwt, claims=claims)
    rv = client.get(f'/api/comments/survey/{survey.id}', headers=headers, content_type=ContentType.JSON.value)
    assert rv.status_code == 200


def test_review_comment(client, jwt, session):  # pylint:disable=unused-argument
    """Assert that a comment can be reviewed."""
    claims = TestJwtClaims.public_user_role

    factory_user_model(TestJwtClaims.public_user_role.get('sub'))
    user_details = factory_user_model()
    survey, eng = factory_survey_and_eng_model()
    submission = factory_submission_model(survey.id, eng.id, user_details.id)
    factory_comment_model(survey.id, submission.id)
    to_dict = {
        'status_id': 2,
    }
    headers = factory_auth_header(jwt=jwt, claims=claims)
    rv = client.put(f'/api/submissions/{submission.id}',
                    data=json.dumps(to_dict), headers=headers, content_type=ContentType.JSON.value)
    assert rv.status_code == 200


def test_review_comment_internal_note(client, jwt, session):  # pylint:disable=unused-argument
    """Assert that a comment can be reviewed."""
    claims = TestJwtClaims.public_user_role

    factory_user_model(TestJwtClaims.public_user_role.get('sub'))
    user_details = factory_user_model()
    survey, eng = factory_survey_and_eng_model()
    submission = factory_submission_model(survey.id, eng.id, user_details.id)
    factory_comment_model(survey.id, submission.id)
    note = fake.paragraph()
    staff_note = {'note': note,
                  'note_type': StaffNoteType.Internal.name}
    to_dict = {
        'status_id': 2,
        'staff_note': [staff_note]
    }

    headers = factory_auth_header(jwt=jwt, claims=claims)
    rv = client.put(f'/api/submissions/{submission.id}',
                    data=json.dumps(to_dict), headers=headers, content_type=ContentType.JSON.value)
    assert rv.status_code == 200
    staff_notes = rv.json.get('staff_note', None)
    assert len(staff_notes) == 1
    assert staff_notes[0].get('note_type') == StaffNoteType.Internal.name
    assert staff_notes[0].get('note') == note


def test_review_comment_review_note(client, jwt, session):  # pylint:disable=unused-argument
    """Assert that a comment can be reviewed."""
    claims = TestJwtClaims.public_user_role
    factory_tenant_model()
    set_global_tenant()
    factory_user_model(TestJwtClaims.public_user_role.get('sub'))
    user_details = factory_user_model()
    survey, eng = factory_survey_and_eng_model()
    submission = factory_submission_model(survey.id, eng.id, user_details.id)
    factory_comment_model(survey.id, submission.id)
    note = fake.paragraph()
    staff_note = {'note': note,
                  'note_type': StaffNoteType.Review.name}
    to_dict = {
        'status_id': 3,
        'has_personal_info': True,
        'staff_note': [staff_note]
    }

    headers = factory_auth_header(jwt=jwt, claims=claims)
    with patch.object(notification, 'send_email', return_value=False) as mock_mail:
        rv = client.put(f'/api/submissions/{submission.id}',
                        data=json.dumps(to_dict), headers=headers, content_type=ContentType.JSON.value)
        assert rv.status_code == 200
        staff_notes = rv.json.get('staff_note', None)
        assert len(staff_notes) == 1
        assert staff_notes[0].get('note_type') == StaffNoteType.Review.name
        assert staff_notes[0].get('note') == note
        mock_mail.assert_called()


def test_get_comments_spreadsheet(mocker, client, jwt, session):  # pylint:disable=unused-argument
    """Assert that comments sheet can be fetched."""
    claims = TestJwtClaims.public_user_role

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

    user_details = factory_user_model()
    survey, eng = factory_survey_and_eng_model()
    submission = factory_submission_model(survey.id, eng.id, user_details.id)
    factory_comment_model(survey.id, submission.id)
    headers = factory_auth_header(jwt=jwt, claims=claims)
    rv = client.get(f'/api/comments/survey/{survey.id}/sheet', headers=headers, content_type=ContentType.JSON.value)
    assert rv.status_code == 200
    mock_post_generate_document.assert_called()
    mock_get_access_token.assert_called()
    mock_post_upload_template.assert_called()
