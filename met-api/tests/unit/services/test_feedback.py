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
"""Tests for the Feedback service.

Test suite to ensure that the Feedback service routines are working as expected.
"""

from met_api.constants.feedback import FeedbackSourceType
from met_api.services.feedback_service import FeedbackService
from tests.utilities.factory_scenarios import TestFeedbackInfo


def test_create_feedback_public(session):  # pylint:disable=unused-argument
    """Assert that a feedback can be created."""
    feedback_data = TestFeedbackInfo.feedback1
    saved_feedback = FeedbackService().create_feedback(feedback_data, None)
    # fetch the feedback with id and assert
    fetched_feedback = FeedbackService().get_feedback(saved_feedback.get('id'))
    assert fetched_feedback.get('comment') == feedback_data.get('comment')
    assert fetched_feedback.get('source') == FeedbackSourceType.Public


def test_create_feedback_internal(session):  # pylint:disable=unused-argument
    """Assert that a feedback can be created."""
    feedback_data = TestFeedbackInfo.feedback1
    saved_feedback = FeedbackService().create_feedback(feedback_data, 'TestUser')
    # fetch the feedback with id and assert
    fetched_feedback = FeedbackService().get_feedback(saved_feedback.get('id'))
    assert fetched_feedback.get('comment') == feedback_data.get('comment')
    assert fetched_feedback.get('source') == FeedbackSourceType.Internal
