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

"""Tests to verify the engagement API end-point.

Test-Suite to ensure that the engagement endpoint is working as expected.
"""
from analytics_api.utils.util import ContentType
from tests.utilities.factory_utils import factory_engagement_model


def test_get_engagement(client, session):  # pylint:disable=unused-argument
    """Assert that engagement can be fetched."""
    engagement = factory_engagement_model()
    rv = client.get(f'/api/engagements/{engagement.id}', content_type=ContentType.JSON.value)
    assert rv.status_code == 200
