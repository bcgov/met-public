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

from met_api.services.comment_service import CommentService

from tests.utilities.factory_scenarios import TestJwtClaims
from tests.utilities.factory_utils import (
    factory_comment_model, factory_submission_model, factory_survey_and_eng_model, factory_user_model)


def test_get_comments(session):  # pylint:disable=unused-argument
    """Assert that comments can be fetched."""
    user_details = factory_user_model()
    survey, eng = factory_survey_and_eng_model()
    submission = factory_submission_model(survey.id, user_details.id)
    factory_comment_model(survey.id, submission.id)
    comment_records = CommentService().get_comments_by_submission(submission.id)
    assert len(comment_records) == 1
    assert comment_records[0]['status_id'] == 1


def test_review_comment(client, jwt, session):  # pylint:disable=unused-argument
    """Assert that a comment can be reviewed."""
    admin_user = factory_user_model(3)
    user_details = factory_user_model()
    survey, eng = factory_survey_and_eng_model()
    submission = factory_submission_model(survey.id, user_details.id)
    factory_comment_model(survey.id, submission.id)
    comment_records = CommentService().review_comment(submission.id, 2, admin_user.external_id)
    assert len(comment_records) == 1
    assert comment_records[0]['status_id'] == 2
