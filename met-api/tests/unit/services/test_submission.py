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

from met_api.constants.comment_status import Status
from met_api.schemas.submission import SubmissionSchema
from met_api.services.comment_service import CommentService
from met_api.services.email_verification_service import EmailVerificationService
from met_api.services.submission_service import SubmissionService

from tests.utilities.factory_utils import (
    factory_comment_model, factory_email_verification, factory_submission_model, factory_survey_and_eng_model,
    factory_user_model)


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
    submission = SubmissionService().create(email_verification.verification_token, submission_request)
    actual_email_verification = EmailVerificationService().get(email_verification.verification_token)

    assert submission is not None
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

    with patch.object(CommentService, 'extract_comments_from_survey', side_effect=ValueError) as mock:
        try:
            SubmissionService().create(email_verification.verification_token, submission_request)
        except ValueError:
            mock.assert_called()
        actual_email_verification = EmailVerificationService().get(email_verification.verification_token)
        assert actual_email_verification['is_active'] is True


def test_review_comment(client, jwt, session):  # pylint:disable=unused-argument
    """Assert that a comment can be reviewed."""
    admin_user = factory_user_model(3)
    user_details = factory_user_model()
    survey, eng = factory_survey_and_eng_model()
    submission = factory_submission_model(survey.id, eng.id, user_details.id)
    factory_comment_model(survey.id, submission.id)
    reasons = {
        'status_id': 2,
    }
    submission_record = SubmissionService().review_comment(submission.id, reasons, admin_user.external_id)
    assert submission_record.get('comment_status_id') == 2


def test_auto_approval_of_submissions_without_comment(session):  # pylint:disable=unused-argument
    """Assert that a submission without comment is auto approved."""
    survey, eng = factory_survey_and_eng_model()
    email_verification = factory_email_verification(survey.id)
    user_details = factory_user_model()

    submission_request: SubmissionSchema = {
        'submission_json': {'simplepostalcode': 'abc', 'simpletextarea': '', 'simpletextarea1': ''},
        'survey_id': survey.id,
        'user_id': user_details.id,
        'verification_token': email_verification.verification_token,
    }
    submission = SubmissionService().create(email_verification.verification_token, submission_request)

    assert submission is not None
    assert submission.comment_status_id == Status.Approved.value


def test_submissions_with_comment_are_not_auto_approved(session):  # pylint:disable=unused-argument
    """Assert that a submission with comment is not auto approved."""
    survey, eng = factory_survey_and_eng_model()
    email_verification = factory_email_verification(survey.id)
    user_details = factory_user_model()

    submission_request: SubmissionSchema = {
        'submission_json': {'simplepostalcode': 'abc', 'simpletextarea': 'Test Comment','simpletextarea1': 'Test Comment 2'},
        'survey_id': survey.id,
        'user_id': user_details.id,
        'verification_token': email_verification.verification_token,
    }
    submission = SubmissionService().create(email_verification.verification_token, submission_request)

    assert submission is not None
    assert submission.comment_status_id == Status.Pending.value
    
    
def test_check_if_submission_has_comments(session):
    
        survey, eng = factory_survey_and_eng_model()
        email_verification = factory_email_verification(survey.id)
        user_details = factory_user_model()

        # Create a sample submission with a comment in a text field that starts with 'simpletextarea'
        submission_request: SubmissionSchema = {
            'submission_json': {'simplepostalcode': 'abc', 'simpletextfield': 'This is some text', 'simpletextfield2': 'This is some text 2', 'simpletextarea2': 'This is a comment 1','simpletextarea1': 'This is a comment 1'},
            'survey_id': survey.id,
            'user_id': user_details.id,
            'verification_token': email_verification.verification_token,
        }

        submission = SubmissionService().create(email_verification.verification_token, submission_request)

        # Assert that the function returns True since there is a comment in a text field that starts with 'simpletextarea'
        assert submission is not None

        # Create another sample submission with no comments in any text field
        submission_request: SubmissionSchema = {
            'submission_json': {'simplepostalcode': 'abc'},
            'survey_id': survey.id,
            'user_id': user_details.id,
            'verification_token': email_verification.verification_token,
        }
     
        submission = SubmissionService().create(email_verification.verification_token, submission_request)

        # Assert that the function returns False since there are no comments in any text field
        assert submission is None
