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
"""Tests for the Submission service.

Test suite to ensure that the Submission service routines are working as expected.
"""
from unittest.mock import patch
from met_api.schemas.submission import SubmissionSchema
from met_api.services.comment_service import CommentService
from met_api.services.submission_service import SubmissionService
from met_api.services.email_verification_service import EmailVerificationService
from tests.utilities.factory_utils import factory_email_verification, factory_survey_and_eng_model, factory_user_model


def test_create_submission(session):  # pylint:disable=unused-argument
    """Assert that a submission can be Created."""
    survey, eng = factory_survey_and_eng_model()
    email_verification = factory_email_verification(survey.id)
    user_details = factory_user_model()

    submission_request: SubmissionSchema = {
        'submission_json': '{ "test_question": "test answer"}',
        'survey_id': survey.id,
        'user_id': user_details.id,
        'verification_token': email_verification.verification_token,
    }
    submission = SubmissionService().create(submission_request)
    actual_email_verification = EmailVerificationService().get(email_verification.verification_token)

    assert submission.success is True
    assert actual_email_verification['is_active'] is False


def test_create_submission_rollback(session):  # pylint:disable=unused-argument
    """Assert that a submission failure will rollback changes to email verification."""
    survey, eng = factory_survey_and_eng_model()
    email_verification = factory_email_verification(survey.id)
    user_details = factory_user_model()

    submission_request: SubmissionSchema = {
        'submission_json': '{ "test_question": "test answer"}',
        'survey_id': survey.id,
        'user_id': user_details.id,
        'verification_token': email_verification.verification_token,
    }

    with patch.object(CommentService, 'extract_comments', side_effect=ValueError) as mock:
        try:
            SubmissionService().create(submission_request)
        except ValueError:
            mock.assert_called()
        actual_email_verification = EmailVerificationService().get(email_verification.verification_token)
        assert actual_email_verification['is_active'] is True
