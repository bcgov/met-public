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
"""Tests for the feedback model.

Test suite to ensure that the Feedback model routines are working as expected.
"""

from faker import Faker
from met_api.constants.feedback import FeedbackSourceType, FeedbackStatusType

from met_api.models import Feedback as FeedbackModel
from met_api.models.pagination_options import PaginationOptions
from tests.utilities.factory_utils import factory_feedback_model

fake = Faker()


def test_feedback(session):
    """Assert that a feedback can be created and fetched."""
    feedback = factory_feedback_model()
    assert feedback.id is not None
    feedback_existing = FeedbackModel.find_by_id(feedback.id)
    assert feedback.status == FeedbackStatusType.Unreviewed
    assert feedback.comment == feedback_existing.comment
    assert feedback.source == FeedbackSourceType.Public


def test_get_feedbacks_paginated(session):
    """Assert that a feedback can be created and fetched."""
    feedback = factory_feedback_model()
    for i in range(0, 10):
        factory_feedback_model()
    assert feedback.id is not None
    pagination_options = PaginationOptions(
        page=None,
        size=None,
        sort_key='comment',
        sort_order=''
    )
    status = FeedbackStatusType.Unreviewed

    # verify name search
    _, count = FeedbackModel.get_all_paginated(pagination_options, status)
    assert count == 11
