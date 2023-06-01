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

"""Tests to verify the Subscription API end-point.

Test-Suite to ensure that the subscription endpoint is working as expected.
"""
import json

from met_api.utils.enums import ContentType
from tests.utilities.factory_scenarios import TestJwtClaims
from tests.utilities.factory_utils import (
    factory_auth_header, factory_email_verification, factory_subscription_model, factory_survey_and_eng_model,
    factory_user_model, set_global_tenant)


def test_create_subscription(client, jwt, session):  # pylint:disable=unused-argument
    """Assert that an Email can be sent."""
    claims = TestJwtClaims.public_user_role
    set_global_tenant()
    survey, eng = factory_survey_and_eng_model()
    emailverification = factory_email_verification(survey.id)
    user = factory_user_model()
    to_dict = {
        'email_verification_id': emailverification.id,
        'user_id': user.id,
        'is_subscribed': True,
    }
    headers = factory_auth_header(jwt=jwt, claims=claims)
    rv = client.post('/api/subscription/', data=json.dumps(to_dict),
                     headers=headers, content_type=ContentType.JSON.value)

    assert rv.status_code == 200


def test_update_subscription(client, jwt, session):  # pylint:disable=unused-argument
    """Assert that an subscription can be updated."""
    headers = factory_auth_header(jwt=jwt, claims=TestJwtClaims.public_user_role)
    subscription = factory_subscription_model()
    subscription_user_id = str(subscription.user_id)

    subscription_edits = {
        'user_id': subscription_user_id,
        'is_subscribed': False,
    }

    rv = client.patch('/api/subscription/', data=json.dumps(subscription_edits),
                      headers=headers, content_type=ContentType.JSON.value)

    assert rv.status_code == 200
