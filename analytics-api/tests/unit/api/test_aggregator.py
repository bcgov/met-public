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

"""Tests to verify the aggregator API end-point.

Test-Suite to ensure that the aggregator endpoint is working as expected.
"""
import pytest
from http import HTTPStatus
from unittest.mock import patch

from analytics_api.services.aggregator_service import AggregatorService
from analytics_api.utils.util import ContentType
from tests.utilities.factory_utils import factory_engagement_model, factory_email_verification_model


@pytest.mark.parametrize("exception_type", [KeyError, ValueError])
def test_get_aggregator_data(client, exception_type, session):  # pylint:disable=unused-argument
    """Assert that aggregator data for an engagement can be fetched."""
    factory_engagement_model()
    factory_email_verification_model()
    rv = client.get('/api/counts/', content_type=ContentType.JSON.value)
    assert rv.status_code == HTTPStatus.OK

    with patch.object(AggregatorService, 'get_count', side_effect=exception_type('Test error')):
        rv = client.get('/api/counts/', content_type=ContentType.JSON.value)
    assert rv.status_code == HTTPStatus.INTERNAL_SERVER_ERROR
