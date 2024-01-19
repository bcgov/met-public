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

from faker import Faker
from met_api.constants.email_verification import EmailVerificationType
from met_api.constants.subscription_type import SubscriptionTypes
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


def test_get_email_verification_by_token(client, jwt, session):  # pylint:disable=unused-argument
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


def test_post_subscription_email_verification(client, jwt, session, notify_mock):  # pylint:disable=unused-argument
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
