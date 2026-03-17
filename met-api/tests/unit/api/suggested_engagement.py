# Copyright © 2026 Province of British Columbia
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

"""Tests for SuggestedEngagement resource (GET, PUT)."""

import json
import pytest
from marshmallow import ValidationError

from met_api.exceptions.business_exception import BusinessException
from met_api.services.suggested_engagement_service import SuggestedEngagementService

from tests.utilities.factory_utils import factory_auth_header


@pytest.fixture(autouse=True)
def _app_ctx(client):
    """Ensure app context exists for any code that touches current_app."""
    with client.application.app_context():
        client.application.config['TESTING'] = True
        yield


def _path(engagement_id: int, attach: str | None = None) -> str:
    """Build the API path for suggested engagements."""
    base = f'/api/engagement/{engagement_id}/suggestions'
    return f'{base}?attach={attach}' if attach is not None else base


def test_get_suggestions_ok_with_attach_true(client, monkeypatch):
    """Assert GET returns suggested engagements with attached data when attach=true."""
    eid = 123
    expected = [
        {'id': 10, 'engagement_id': eid, 'suggested_engagement_id': 456, 'sort_index': 1},
        {'id': 11, 'engagement_id': eid, 'suggested_engagement_id': 789, 'sort_index': 2},
    ]

    def _fake_get(engagement_id, attach=False):
        assert engagement_id == eid
        assert attach is True
        return expected

    monkeypatch.setattr(
        SuggestedEngagementService,
        'get_suggestions_by_engagement_id',
        staticmethod(_fake_get),
        raising=True,
    )

    resp = client.get(_path(eid, attach='true'))
    assert resp.status_code == 200
    assert resp.get_json() == expected


def test_get_suggestions_handles_value_error_returns_500(client, monkeypatch):
    """Assert GET returns 500 when the service raises a ValueError."""
    eid = 999

    def _fake_get(*_args, **_kwargs):
        raise ValueError('boom')

    monkeypatch.setattr(
        SuggestedEngagementService,
        'get_suggestions_by_engagement_id',
        staticmethod(_fake_get),
        raising=True,
    )

    resp = client.get(_path(eid, attach='false'))
    assert resp.status_code == 500
    body = resp.get_json()
    assert body.get('message') == 'boom'


def test_put_sync_ok(client, jwt, session, monkeypatch, setup_admin_user_and_claims):
    """Assert PUT successfully syncs suggested engagements."""
    eid = 777
    payload = [
        {'suggested_engagement_id': 22, 'sort_index': 1},
        {'suggested_engagement_id': 33, 'sort_index': 2},
    ]
    expected = {'updated': 2, 'deleted': 0, 'created': 2}

    def _fake_sync(engagement_id, request_json):
        assert engagement_id == eid
        assert request_json == payload
        return expected

    monkeypatch.setattr(
        SuggestedEngagementService,
        'sync_suggestions',
        staticmethod(_fake_sync),
        raising=True,
    )

    # Build auth header using your standard helper
    _, claims = setup_admin_user_and_claims
    headers = factory_auth_header(jwt=jwt, claims=claims)

    resp = client.put(
        _path(eid),
        data=json.dumps(payload),
        headers={'Content-Type': 'application/json', **headers},
    )
    assert resp.status_code == 200
    assert resp.get_json() == expected


def test_put_business_exception_400(client, jwt, session, monkeypatch, setup_admin_user_and_claims):
    """Assert PUT returns 400 when a BusinessException is raised."""
    eid = 101

    def _fake_sync(*_args, **_kwargs):
        raise BusinessException(error='invalid suggested_engagement_id', status_code=400)

    monkeypatch.setattr(
        SuggestedEngagementService,
        'sync_suggestions',
        staticmethod(_fake_sync),
        raising=True,
    )

    _, claims = setup_admin_user_and_claims
    headers = factory_auth_header(jwt=jwt, claims=claims)

    resp = client.put(
        _path(eid),
        data=json.dumps([{'suggested_engagement_id': 101, 'sort_index': 1}]),
        headers={'Content-Type': 'application/json', **headers},
    )

    assert resp.status_code == 400
    body = resp.get_json()
    assert body.get('status') == 'failure'
    assert body.get('message') == 'invalid suggested_engagement_id'

    _, claims = setup_admin_user_and_claims
    headers = factory_auth_header(jwt=jwt, claims=claims)

    resp = client.put(
        _path(eid),
        data=json.dumps([{'suggested_engagement_id': 101, 'sort_index': 1}]),
        headers={'Content-Type': 'application/json', **headers},
    )

    assert resp.status_code == 400
    body = resp.get_json()
    assert body.get('status') == 'failure'
    assert body.get('message') == 'invalid suggested_engagement_id'


def test_put_validation_error_400(client, jwt, session, monkeypatch, setup_admin_user_and_claims):
    """Assert PUT returns 400 when a ValidationError is raised."""
    eid = 202

    def _fake_sync(*_args, **_kwargs):
        raise ValidationError({'sort_index': ['must be >= 1']})

    monkeypatch.setattr(
        SuggestedEngagementService,
        'sync_suggestions',
        staticmethod(_fake_sync),
        raising=True,
    )

    _, claims = setup_admin_user_and_claims
    headers = factory_auth_header(jwt=jwt, claims=claims)

    resp = client.put(
        _path(eid),
        data=json.dumps([{'suggested_engagement_id': 303, 'sort_index': 0}]),
        headers={'Content-Type': 'application/json', **headers},
    )

    assert resp.status_code == 400
    body = resp.get_json()
    assert body.get('status') == 'failure'
    assert body.get('message') == {'sort_index': ['must be >= 1']}
