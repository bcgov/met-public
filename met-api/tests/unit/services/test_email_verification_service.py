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

"""Tests to verify the User Service class.

Test-Suite to ensure that the UserService is working as expected.
"""
from unittest.mock import patch

import pytest
from faker import Faker

from met_api.exceptions.business_exception import BusinessException
from met_api.services.email_verification_service import EmailVerificationService
from met_api.constants.email_verification import EmailVerificationType
from met_api.utils import notification
from tests.utilities.factory_scenarios import TestEngagementSlugInfo
from tests.utilities.factory_utils import factory_engagement_slug_model, factory_survey_and_eng_model, set_global_tenant


fake = Faker()


def test_create_email_verification(client, jwt, session, ):  # pylint:disable=unused-argument
    """Assert that an email verification can be Created."""
    set_global_tenant()
    survey, eng = factory_survey_and_eng_model()
    slug_info = {
        **TestEngagementSlugInfo.slug1,
        'engagement_id': eng.id
    }
    factory_engagement_slug_model(slug_info)
    email = fake.email()
    to_dict = {
        'email_address': email,
        'survey_id': survey.id,
        'type': EmailVerificationType.Survey
    }
    with patch.object(notification, 'send_email', return_value=False) as mock_mail:
        EmailVerificationService().create(to_dict)
        mock_mail.assert_called()
        actual_data = mock_mail.call_args.kwargs
        assert eng.name in actual_data.get('subject')
        assert actual_data.get('email') == email
        assert actual_data.get('args').get('engagement_name') == eng.name


def test_create_email_verification_exception(client, jwt, session, ):  # pylint:disable=unused-argument
    """Assert that an email verification can be Created."""
    set_global_tenant()
    survey, eng = factory_survey_and_eng_model()
    slug_info = {
        **TestEngagementSlugInfo.slug1,
        'engagement_id': eng.id
    }
    factory_engagement_slug_model(slug_info)
    email = fake.email()
    to_dict = {
        'email_address': email,
        'survey_id': survey.id,
        'type': EmailVerificationType.Survey
    }
    with pytest.raises(BusinessException) as exception:
        with patch.object(notification, 'send_email', side_effect=Exception('mocked error')):
            EmailVerificationService().create(to_dict)
    assert exception.type == BusinessException
