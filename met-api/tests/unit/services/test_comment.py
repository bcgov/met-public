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

"""Tests for the Comment Service class.

Test-Suite to ensure that the Comment service routines are working as expected.
"""
from met_api.services.comment_service import CommentService
from tests.utilities.factory_scenarios import TestJwtClaims, TestSubmissionInfo
from tests.utilities.factory_utils import (
    factory_comment_model, factory_membership_model, factory_participant_model, factory_staff_user_model,
    factory_submission_model, factory_survey_and_eng_model, patch_token_info, set_global_tenant)


def test_get_comments(session, monkeypatch):  # pylint:disable=unused-argument
    """Assert that comments can be fetched."""
    patch_token_info(TestJwtClaims.public_user_role, monkeypatch)
    set_global_tenant()
    user_details = factory_staff_user_model(external_id=TestJwtClaims.public_user_role['sub'])
    participant = factory_participant_model()
    survey, eng = factory_survey_and_eng_model()

    submission = factory_submission_model(survey.id, eng.id, participant.id)
    factory_comment_model(survey.id, submission.id)
    comment_records = CommentService().get_comments_by_submission(submission.id)
    assert len(comment_records) == 0, 'No membership for the public user.so cant see the records.'

    # create membership and try again.
    factory_membership_model(user_id=user_details.id, engagement_id=eng.id)
    comment_records = CommentService().get_comments_by_submission(submission.id)
    assert len(comment_records) == 1
    assert comment_records[0]['status_id'] == 1


def test_get_comments_approved_comments(session):  # pylint:disable=unused-argument
    """Assert that comments can be fetched."""
    participant = factory_participant_model()
    survey, eng = factory_survey_and_eng_model()
    approved_submission = TestSubmissionInfo.approved_submission
    submission = factory_submission_model(survey.id, eng.id, participant.id, approved_submission)
    factory_comment_model(survey.id, submission.id)
    comment_records = CommentService().get_comments_by_submission(submission.id)
    assert len(comment_records) == 1
    assert comment_records[0]['status_id'] == approved_submission.get('comment_status_id')
