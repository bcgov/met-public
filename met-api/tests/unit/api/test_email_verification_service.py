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

"""Tests to verify the Engagement API end-point.

Test-Suite to ensure that the /user endpoint is working as expected.
"""
import json

from http import HTTPStatus
from faker import Faker
from unittest.mock import patch
import pytest

from met_api.constants.email_verification import EmailVerificationType
from met_api.constants.subscription_type import SubscriptionTypes
from met_api.services.email_verification_service import EmailVerificationService
from met_api.utils.enums import ContentType
from tests.utilities.factory_scenarios import TestJwtClaims
from tests.utilities.factory_utils import (
    factory_auth_header, factory_email_verification, factory_survey_and_eng_model, set_global_tenant)

fake = Faker()


def test_email_verification(client, jwt, session, notify_mock, ):  # pylint:disable=unused-argument
    """Assert that an Email can be sent."""
    claims = TestJwtClaims.public_user_role
    set_global_tenant()
    survey, eng = factory_survey_and_eng_model()
    to_dict = {
        'email_address': fake.email(),
        'survey_id': survey.id
    }
    headers = factory_auth_header(jwt=jwt, claims=claims)
    rv = client.post('/api/email_verification/', data=json.dumps(to_dict),
                     headers=headers, content_type=ContentType.JSON.value)

    assert rv.status_code == 200


@pytest.mark.parametrize('side_effect, expected_status', [
    (KeyError('Test error'), HTTPStatus.INTERNAL_SERVER_ERROR),
    (ValueError('Test error'), HTTPStatus.INTERNAL_SERVER_ERROR),
])
def test_get_email_verification_by_token(client, jwt, session, side_effect,
                                         expected_status):  # pylint:disable=unused-argument
    """Assert that an email verification can be fetched."""
    claims = TestJwtClaims.public_user_role
    set_global_tenant()
    survey, eng = factory_survey_and_eng_model()
    email_verification = factory_email_verification(survey.id)

    headers = factory_auth_header(jwt=jwt, claims=claims)
    rv = client.get(f'/api/email_verification/{email_verification.verification_token}',
                    headers=headers, content_type=ContentType.JSON.value)

    assert rv.status_code == 200
    assert rv.json.get('verification_token') == email_verification.verification_token
    assert rv.json.get('is_active') is True

    with patch.object(EmailVerificationService, 'get_active', side_effect=side_effect):
        rv = client.get(f'/api/email_verification/{email_verification.verification_token}',
                        headers=headers, content_type=ContentType.JSON.value)
    assert rv.status_code == expected_status

    # test email verification not found
    email_verification_token = fake.text(max_nb_chars=20)
    rv = client.get(f'/api/email_verification/{email_verification_token}',
                    headers=headers, content_type=ContentType.JSON.value)
    assert rv.status_code == HTTPStatus.INTERNAL_SERVER_ERROR


def test_patch_email_verification_by_token(client, jwt, session):  # pylint:disable=unused-argument
    """Assert that an email verification can be fetched."""
    claims = TestJwtClaims.public_user_role
    set_global_tenant()
    survey, eng = factory_survey_and_eng_model()
    email_verification = factory_email_verification(survey.id)

    headers = factory_auth_header(jwt=jwt, claims=claims)
    rv = client.put(f'/api/email_verification/{email_verification.verification_token}',
                    headers=headers, content_type=ContentType.JSON.value)

    assert rv.status_code == 200
    assert rv.json.get('verification_token') == email_verification.verification_token
    assert rv.json.get('is_active') is False

    with patch.object(EmailVerificationService, 'verify', side_effect=KeyError('Test error')):
        rv = client.put(f'/api/email_verification/{email_verification.verification_token}',
                        headers=headers, content_type=ContentType.JSON.value)
    assert rv.status_code == HTTPStatus.NOT_FOUND

    with patch.object(EmailVerificationService, 'verify', side_effect=ValueError('Test error')):
        rv = client.put(f'/api/email_verification/{email_verification.verification_token}',
                        headers=headers, content_type=ContentType.JSON.value)
    assert rv.status_code == HTTPStatus.INTERNAL_SERVER_ERROR

    # test email verification not found to update the data
    email_verification_token = fake.text(max_nb_chars=20)
    rv = client.put(f'/api/email_verification/{email_verification_token}',
                    headers=headers, content_type=ContentType.JSON.value)
    assert rv.status_code == HTTPStatus.INTERNAL_SERVER_ERROR


@pytest.mark.parametrize('side_effect, expected_status', [
    (KeyError('Test error'), HTTPStatus.INTERNAL_SERVER_ERROR),
    (ValueError('Test error'), HTTPStatus.INTERNAL_SERVER_ERROR),
])
def test_post_subscription_email_verification(client, jwt, session, notify_mock,
                                              side_effect, expected_status):  # pylint:disable=unused-argument
    """Assert that an Subscription Email can be sent."""
    claims = TestJwtClaims.public_user_role
    set_global_tenant()
    survey, eng = factory_survey_and_eng_model()
    to_dict = {
        'email_address': fake.email(),
        'survey_id': survey.id,
        'type': EmailVerificationType.Subscribe
    }
    headers = factory_auth_header(jwt=jwt, claims=claims)
    rv = client.post(f'/api/email_verification/{SubscriptionTypes.PROJECT.value}/subscribe',
                     data=json.dumps(to_dict),
                     headers=headers, content_type=ContentType.JSON.value)

    assert rv.status_code == 200
    verification_token = rv.json.get('verification_token')

    rv = client.get(f'/api/email_verification/{verification_token}',
                    headers=headers, content_type=ContentType.JSON.value)

    assert rv.status_code == 200
    assert rv.json.get('type') == EmailVerificationType.Subscribe

    with patch.object(EmailVerificationService, 'create', side_effect=side_effect):
        rv = client.post(f'/api/email_verification/{SubscriptionTypes.PROJECT.value}/subscribe',
                         data=json.dumps(to_dict),
                         headers=headers, content_type=ContentType.JSON.value)
    assert rv.status_code == expected_status
