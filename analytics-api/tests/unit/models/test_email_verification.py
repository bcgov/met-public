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
"""Tests for the Engagement model.

Test suite to ensure that the Engagement model routines are working as expected.
"""

from analytics_api.models import EmailVerification as EmailVerificationModel
from tests.utilities.factory_utils import factory_email_verification_model


def test_get_email_verification_data_by_id(session):
    """Assert that an email verification data can be created and fetched."""
    email_verification = factory_email_verification_model()
    assert email_verification.id is not None
    retrieved_email_verification = EmailVerificationModel.find_by_id(email_verification.id)
    assert email_verification.participant_id == retrieved_email_verification.participant_id


def test_get_email_verification_count(session):
    """Test get count for email verification."""
    email_verification = factory_email_verification_model()
    assert email_verification.id is not None
    email_verification_count = EmailVerificationModel.get_email_verification_count(email_verification.engagement_id)
    assert email_verification_count == 1
