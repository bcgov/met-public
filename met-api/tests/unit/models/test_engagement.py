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
"""Tests for the Org model.

Test suite to ensure that the Engagement model routines are working as expected.
"""

from faker import Faker

from met_api.constants.engagement_status import SubmissionStatus
from met_api.models import Engagement as EngagementModel
from met_api.models.pagination_options import PaginationOptions
from tests.utilities.factory_utils import factory_engagement_model


fake = Faker()


def test_engagement(session):
    """Assert that an engagement can be created and fetched."""
    eng = factory_engagement_model()
    assert eng.id is not None
    eng_existing = EngagementModel.get_engagement(eng.id)
    assert eng.name == eng_existing.name


def test_get_engagements_paginated(session):
    """Assert that an engagement can be created and fetched."""
    eng = factory_engagement_model()
    for i in range(0, 10):
        factory_engagement_model()
    assert eng.id is not None
    pagination_options = PaginationOptions(
        page=None,
        size=None,
        sort_key='name',
        sort_order=''

    )

    # verify name search
    result, count = EngagementModel.get_engagements_paginated(pagination_options, eng.name)
    assert eng.name == result[0].name
    assert count == 1, 'Name search brings up only search result'

    # status search
    factory_engagement_model(status=SubmissionStatus.Closed.value)
    factory_engagement_model(status=SubmissionStatus.Closed.value)
    result, count = EngagementModel.get_engagements_paginated(pagination_options, None, [SubmissionStatus.Closed.value])
    assert count == 2

    result, count = EngagementModel.get_engagements_paginated(pagination_options, None, [SubmissionStatus.Open.value])
    # 11 Open ones are created
    assert count == 11
    assert len(result) == 11

    result, count = EngagementModel.get_engagements_paginated(pagination_options, None, [SubmissionStatus.Open.value,
                                                                                         SubmissionStatus.Closed.value])

    # 13 Total. Open+Closed ones are created
    assert count == 13
    assert len(result) == 13

    # pass in pagination options and do the count

    pagination_options = PaginationOptions(
        page=1,
        size=2,
        sort_key='name',
        sort_order=''

    )

    result, count = EngagementModel.get_engagements_paginated(pagination_options, None, [SubmissionStatus.Open.value,
                                                                                         SubmissionStatus.Closed.value])
    assert count == 13
    # only two items are returned
    assert len(result) == 2
