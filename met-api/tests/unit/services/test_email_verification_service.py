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
from met_api.utils import notification
from tests.utilities.factory_utils import factory_survey_and_eng_model, factory_tenant_model, set_global_tenant

fake = Faker()


def test_create_email_verification(client, jwt, session, ):  # pylint:disable=unused-argument
    """Assert that an email verification can be Created."""
    tenant = factory_tenant_model()
    set_global_tenant(tenant.id)
    survey, eng = factory_survey_and_eng_model()
    email = fake.email()
    to_dict = {
        'email_address': email,
        'survey_id': survey.id
    }
    with patch.object(notification, 'send_email', return_value=False) as mock_mail:
        EmailVerificationService().create(to_dict)
        mock_mail.assert_called()
        actual_data = mock_mail.call_args.kwargs
        assert eng.name in actual_data.get('subject')
        assert actual_data.get('email') == email
        assert str(eng.id) in actual_data.get('html_body'), 'engagement id will be in the email link'
        assert actual_data.get('args').get('engagement_name') == eng.name


def test_create_email_verification_exception(client, jwt, session, ):  # pylint:disable=unused-argument
    """Assert that an email verification can be Created."""
    tenant = factory_tenant_model()
    set_global_tenant(tenant.id)
    survey, eng = factory_survey_and_eng_model()
    email = fake.email()
    to_dict = {
        'email_address': email,
        'survey_id': survey.id
    }
    with pytest.raises(BusinessException) as exception:
        with patch.object(notification, 'send_email', side_effect=Exception('mocked error')):
            EmailVerificationService().create(to_dict)
    assert exception.type == BusinessException
