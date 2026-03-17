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
"""Tests for the SuggestedEngagement service.

Ensures service orchestrations behave correctly and enforce constraints.
"""

import pytest
from unittest.mock import patch
from sqlalchemy.exc import IntegrityError

from met_api.models import db
from met_api.models.suggested_engagement import SuggestedEngagement
from met_api.services import authorization
from met_api.services.suggested_engagement_service import SuggestedEngagementService

from tests.utilities.factory_utils import factory_engagement_model


def _make_engagements(n=3):
    """Create and return n persisted Engagements."""
    engs = [factory_engagement_model() for _ in range(n)]
    db.session.commit()
    return engs


def _insert(engagement_id: int, suggested_engagement_id: int, sort_index: int) -> SuggestedEngagement:
    s = SuggestedEngagement(
        engagement_id=engagement_id,
        suggested_engagement_id=suggested_engagement_id,
        sort_index=sort_index,
    )
    db.session.add(s)
    db.session.commit()
    return s


def test_get_suggestions_returns_sorted(session, monkeypatch):
    """Service returns suggestions sorted by sort_index ascending."""
    with patch.object(authorization, 'check_auth', return_value=True):
        eng_a, eng_b, eng_c, eng_d = _make_engagements(4)
        _insert(eng_a.id, eng_b.id, 3)
        _insert(eng_a.id, eng_c.id, 1)
        _insert(eng_a.id, eng_d.id, 2)

        result = SuggestedEngagementService().get_suggestions_by_engagement_id(eng_a.id)

        def _to_tuple(row):
            if isinstance(row, dict):
                return row.get('suggested_engagement_id'), row.get('sort_index')
            return row.suggested_engagement_id, row.sort_index

        tuples = [_to_tuple(r) for r in result]
        assert tuples == [(eng_c.id, 1), (eng_d.id, 2), (eng_b.id, 3)]


def test_sync_suggestions_creates_updates_deletes(session, monkeypatch):
    """sync_suggestions upserts rows and deletes removed ones."""
    with patch.object(authorization, 'check_auth', return_value=True):
        eng_a, eng_b, eng_c, eng_d = _make_engagements(4)
        existing = _insert(eng_a.id, eng_b.id, 1)

        payload = [
            {'id': existing.id, 'suggested_engagement_id': eng_b.id, 'sort_index': 2},
            {'suggested_engagement_id': eng_c.id, 'sort_index': 1},
            {'suggested_engagement_id': eng_d.id, 'sort_index': 3},
        ]

        SuggestedEngagementService().sync_suggestions(eng_a.id, payload)

        rows = SuggestedEngagement.find_by_engagement_id(eng_a.id)
        assert [(r.suggested_engagement_id, r.sort_index) for r in rows] == [
            (eng_c.id, 1), (eng_b.id, 2), (eng_d.id, 3)
        ]

        remaining = [
            {'id': rows[0].id, 'suggested_engagement_id': eng_c.id, 'sort_index': 1},
            {'id': rows[2].id, 'suggested_engagement_id': eng_d.id, 'sort_index': 2},
        ]
        SuggestedEngagementService().sync_suggestions(eng_a.id, remaining)

        rows2 = SuggestedEngagement.find_by_engagement_id(eng_a.id)
        assert [(r.suggested_engagement_id, r.sort_index) for r in rows2] == [
            (eng_c.id, 1), (eng_d.id, 2)
        ]


def test_sync_suggestions_rejects_self_link(session, monkeypatch):
    """Service should block self-linking (engagement_id == suggested_engagement_id)."""
    with patch.object(authorization, 'check_auth', return_value=True):
        eng_a = _make_engagements(1)[0]

        payload = [{'suggested_engagement_id': eng_a.id, 'sort_index': 1}]

        with pytest.raises((ValueError, IntegrityError)):
            SuggestedEngagementService().sync_suggestions(eng_a.id, payload)


def test_update_suggestion_success(session, monkeypatch):
    """Update via sync_suggestions modifies a single row and stamps updated_date."""
    with patch.object(authorization, 'check_auth', return_value=True):
        eng_a, eng_b, _ = _make_engagements(3)
        s = _insert(eng_a.id, eng_b.id, 1)

        SuggestedEngagementService().sync_suggestions(
            eng_a.id,
            [
                {
                    'id': s.id,
                    'suggested_engagement_id': eng_b.id,
                    'sort_index': 3,
                }
            ]
        )

        fresh = SuggestedEngagement.find_by_engagement_id(eng_a.id)
        assert [(r.id, r.sort_index) for r in fresh] == [(s.id, 3)]
        assert fresh[0].updated_date is not None


def test_delete_suggestion_single(session, monkeypatch):
    """delete_suggestion removes exactly one row."""
    with patch.object(authorization, 'check_auth', return_value=True):
        eng_a, eng_b, eng_c = _make_engagements(3)
        s1 = _insert(eng_a.id, eng_b.id, 1)
        s2 = _insert(eng_a.id, eng_c.id, 2)

        deleted = SuggestedEngagementService().delete_suggestion(eng_a.id, s1.id)
        if isinstance(deleted, dict):
            assert deleted.get('deleted') == 1
        else:
            assert deleted == 1

        rows = SuggestedEngagement.find_by_engagement_id(eng_a.id)
        assert [r.id for r in rows] == [s2.id]


def test_swap_sort_index_no_unique_violation(session, monkeypatch):
    """Swapping sort_index values via service should succeed (deferrable unique constraint)."""
    with patch.object(authorization, 'check_auth', return_value=True):
        eng_a, eng_b, eng_c = _make_engagements(3)
        s1 = _insert(eng_a.id, eng_b.id, 1)
        s2 = _insert(eng_a.id, eng_c.id, 2)

        payload = [
            {'id': s1.id, 'suggested_engagement_id': eng_b.id, 'sort_index': 2},
            {'id': s2.id, 'suggested_engagement_id': eng_c.id, 'sort_index': 1},
        ]

        SuggestedEngagementService().sync_suggestions(eng_a.id, payload)

        rows = SuggestedEngagement.find_by_engagement_id(eng_a.id)
        assert [r.id for r in rows] == [s2.id, s1.id]
        assert [r.sort_index for r in rows] == [1, 2]


def test_authorization_enforced_on_mutations(session, monkeypatch):
    """Mutating endpoints should check authorization; deny when unauthorized."""
    with patch.object(authorization, 'check_auth', side_effect=PermissionError('unauthorized')):
        eng_a, eng_b = _make_engagements(2)
        payload = [{'suggested_engagement_id': eng_b.id, 'sort_index': 1}]

        with pytest.raises(PermissionError):
            SuggestedEngagementService().sync_suggestions(eng_a.id, payload)
