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

from http import HTTPStatus
from faker import Faker
from unittest.mock import patch
import pytest

from met_api.services.subscription_service import SubscriptionService
from met_api.utils.enums import ContentType
from tests.utilities.factory_scenarios import TestJwtClaims
from tests.utilities.factory_utils import (
    factory_auth_header, factory_participant_model, factory_subscription_model, factory_survey_and_eng_model,
    set_global_tenant)

fake = Faker()


@pytest.mark.parametrize('side_effect, expected_status', [
    (KeyError('Test error'), HTTPStatus.INTERNAL_SERVER_ERROR),
    (ValueError('Test error'), HTTPStatus.INTERNAL_SERVER_ERROR),
])
def test_create_subscription(client, jwt, session, side_effect,
                             expected_status):  # pylint:disable=unused-argument
    """Assert that an Email can be sent."""
    claims = TestJwtClaims.public_user_role
    set_global_tenant()
    survey, eng = factory_survey_and_eng_model()
    participant = factory_participant_model()
    to_dict = {
        'engagement_id': eng.id,
        'participant_id': participant.id,
        'is_subscribed': True,
    }
    headers = factory_auth_header(jwt=jwt, claims=claims)
    rv = client.post('/api/subscription/', data=json.dumps(to_dict),
                     headers=headers, content_type=ContentType.JSON.value)

    assert rv.status_code == HTTPStatus.OK.value

    with patch.object(SubscriptionService, 'create_subscription', side_effect=side_effect):
        rv = client.post('/api/subscription/', data=json.dumps(to_dict),
                         headers=headers, content_type=ContentType.JSON.value)
    assert rv.status_code == expected_status


@pytest.mark.parametrize('side_effect, expected_status', [
    (KeyError('Test error'), HTTPStatus.INTERNAL_SERVER_ERROR),
    (ValueError('Test error'), HTTPStatus.INTERNAL_SERVER_ERROR),
])
def test_update_subscription(client, jwt, session, side_effect,
                             expected_status):  # pylint:disable=unused-argument
    """Assert that a subscription can be updated."""
    headers = factory_auth_header(jwt=jwt, claims=TestJwtClaims.public_user_role)
    subscription = factory_subscription_model()
    subscription_participant_id = str(subscription.participant_id)

    subscription_edits = {
        'participant_id': subscription_participant_id,
        'is_subscribed': False,
    }

    rv = client.patch('/api/subscription/', data=json.dumps(subscription_edits),
                      headers=headers, content_type=ContentType.JSON.value)

    assert rv.status_code == HTTPStatus.OK.value

    with patch.object(SubscriptionService, 'update_subscription_for_participant', side_effect=side_effect):
        rv = client.patch('/api/subscription/', data=json.dumps(subscription_edits),
                          headers=headers, content_type=ContentType.JSON.value)
    assert rv.status_code == expected_status


@pytest.mark.parametrize('side_effect, expected_status', [
    (KeyError('Test error'), HTTPStatus.INTERNAL_SERVER_ERROR),
    (ValueError('Test error'), HTTPStatus.INTERNAL_SERVER_ERROR),
])
def test_get_subscription(client, jwt, session, side_effect,
                          expected_status):  # pylint:disable=unused-argument
    """Assert that a subscription can be fetched."""
    headers = factory_auth_header(jwt=jwt, claims=TestJwtClaims.public_user_role)
    subscription = factory_subscription_model()
    subscription_participant_id = str(subscription.participant_id)

    rv = client.get(f'/api/subscription/{subscription_participant_id}',
                    headers=headers, content_type=ContentType.JSON.value)

    assert rv.status_code == HTTPStatus.OK.value
    assert rv.json.get('participant_id') == subscription.participant_id

    with patch.object(SubscriptionService, 'get', side_effect=side_effect):
        rv = client.get(f'/api/subscription/{subscription_participant_id}',
                        headers=headers, content_type=ContentType.JSON.value)
    assert rv.status_code == expected_status

    # test subscription not found
    subscription_participant_id = fake.pyint()
    rv = client.get(f'/api/subscription/{subscription_participant_id}',
                    headers=headers, content_type=ContentType.JSON.value)

    assert rv.status_code == HTTPStatus.NOT_FOUND.value


@pytest.mark.parametrize('side_effect, expected_status', [
    (KeyError('Test error'), HTTPStatus.INTERNAL_SERVER_ERROR),
    (ValueError('Test error'), HTTPStatus.INTERNAL_SERVER_ERROR),
])
def test_confirm_subscription(client, jwt, session, side_effect,
                              expected_status):  # pylint:disable=unused-argument
    """Assert that a subscription can be confirmed or unsubscribed."""
    claims = TestJwtClaims.public_user_role
    set_global_tenant()
    survey, eng = factory_survey_and_eng_model()
    participant = factory_participant_model()
    to_dict = {
        'engagement_id': eng.id,
        'participant_id': participant.id,
        'is_subscribed': True,
    }
    headers = factory_auth_header(jwt=jwt, claims=claims)
    rv = client.post('/api/subscription/manage', data=json.dumps(to_dict),
                     headers=headers, content_type=ContentType.JSON.value)

    assert rv.status_code == HTTPStatus.OK.value

    subscription_participant_id = str(participant.id)

    rv = client.get(f'/api/subscription/{subscription_participant_id}',
                    headers=headers, content_type=ContentType.JSON.value)

    assert rv.status_code == HTTPStatus.OK.value
    assert rv.json.get('is_subscribed') is True

    with patch.object(SubscriptionService, 'create_or_update_subscription', side_effect=side_effect):
        rv = client.post('/api/subscription/manage', data=json.dumps(to_dict),
                         headers=headers, content_type=ContentType.JSON.value)
    assert rv.status_code == expected_status

    subscription_edits = {
        'engagement_id': eng.id,
        'participant_id': participant.id,
        'is_subscribed': False,
    }

    rv = client.patch('/api/subscription/manage', data=json.dumps(subscription_edits),
                      headers=headers, content_type=ContentType.JSON.value)

    assert rv.status_code == 200

    rv = client.get(f'/api/subscription/{subscription_participant_id}',
                    headers=headers, content_type=ContentType.JSON.value)

    assert rv.status_code == HTTPStatus.OK.value
    assert rv.json.get('is_subscribed') is False

    with patch.object(SubscriptionService, 'update_subscription_for_participant_eng', side_effect=side_effect):
        rv = client.patch('/api/subscription/manage', data=json.dumps(subscription_edits),
                          headers=headers, content_type=ContentType.JSON.value)
    assert rv.status_code == expected_status
