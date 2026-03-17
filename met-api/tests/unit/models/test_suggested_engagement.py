# Copyright © 2026 Province of British Columbia
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

"""Tests for the SuggestedEngagement model."""

from datetime import datetime

import pytest
from sqlalchemy import text
from sqlalchemy.exc import IntegrityError

from met_api.models import db
from met_api.models.engagement import Engagement as EngagementModel
from met_api.models.suggested_engagement import SuggestedEngagement
from tests.utilities.factory_utils import factory_engagement_model


def _make_engagements(n=3):
    """Create and return n persisted Engagements."""
    engs = [factory_engagement_model() for _ in range(n)]
    db.session.commit()
    return engs


def _insert_suggestion(engagement_id: int, suggested_engagement_id: int, sort_index: int) -> SuggestedEngagement:
    """Assert that this is a helper to create one SuggestedEngagement row."""
    s = SuggestedEngagement(
        engagement_id=engagement_id,
        suggested_engagement_id=suggested_engagement_id,
        sort_index=sort_index,
    )
    db.session.add(s)
    db.session.commit()
    return s


def test_find_by_engagement_id_returns_sorted(session):
    """Assert that find_by_engagement_id returns suggestions sorted by sort_index ascending."""
    eng_a, eng_b, eng_c, eng_d = _make_engagements(4)

    # Unordered inserts
    _insert_suggestion(eng_a.id, eng_b.id, 3)
    _insert_suggestion(eng_a.id, eng_c.id, 1)
    _insert_suggestion(eng_a.id, eng_d.id, 2)

    results = SuggestedEngagement.find_by_engagement_id(eng_a.id)
    assert [r.sort_index for r in results] == [1, 2, 3]
    assert [r.suggested_engagement_id for r in results] == [eng_c.id, eng_d.id, eng_b.id]


def test_find_by_engagement_id_and_attach_joins_engagement(session):
    """Assert join + order works and returns (SuggestedEngagement, Engagement) tuples."""
    eng_a, eng_b, eng_c = _make_engagements(3)
    _insert_suggestion(eng_a.id, eng_b.id, 2)
    _insert_suggestion(eng_a.id, eng_c.id, 1)

    rows = SuggestedEngagement.find_by_engagement_id_and_attach(eng_a.id)
    assert len(rows) == 2
    first_suggestion, first_eng = rows[0]
    assert isinstance(first_suggestion, SuggestedEngagement)
    assert isinstance(first_eng, EngagementModel)
    assert first_suggestion.suggested_engagement_id == eng_c.id
    assert first_eng.id == eng_c.id


def test_bulk_insert_suggested_engagements(session):
    """Assert that bulk insert creates rows and enforces order by sort_index."""
    eng_a, eng_b, eng_c = _make_engagements(3)

    mappings = [
        {
            'engagement_id': eng_a.id,
            'suggested_engagement_id': eng_b.id,
            'sort_index': 2,
        },
        {
            'engagement_id': eng_a.id,
            'suggested_engagement_id': eng_c.id,
            'sort_index': 1,
        },
    ]
    SuggestedEngagement.bulk_insert_suggested_engagements(mappings)

    results = SuggestedEngagement.find_by_engagement_id(eng_a.id)
    assert len(results) == 2
    assert [r.sort_index for r in results] == [1, 2]
    assert [r.suggested_engagement_id for r in results] == [eng_c.id, eng_b.id]


def test_bulk_update_suggested_engagements(session):
    """Assert that bulk update modifies rows as expected."""
    eng_a, eng_b, eng_c = _make_engagements(3)
    s1 = _insert_suggestion(eng_a.id, eng_b.id, 1)
    s2 = _insert_suggestion(eng_a.id, eng_c.id, 2)

    # swap sort indexes
    updates = [
        {'id': s1.id, 'sort_index': 2},
        {'id': s2.id, 'sort_index': 1},
    ]
    SuggestedEngagement.bulk_update_suggested_engagements(updates)

    results = SuggestedEngagement.find_by_engagement_id(eng_a.id)
    assert [r.id for r in results] == [s2.id, s1.id]
    assert [r.sort_index for r in results] == [1, 2]


def test_update_suggested_engagement_success(session):
    """Assert that update_suggested_engagement updates fields and stamps updated_date."""
    eng_a, eng_b, _ = _make_engagements(3)
    s = _insert_suggestion(eng_a.id, eng_b.id, 1)

    before = datetime.now(None)
    updated = SuggestedEngagement.update_suggested_engagement(
        engagement_id=eng_a.id,
        suggestion_id=s.id,
        suggestion_data={'sort_index': 3},
    )
    assert updated is not None
    assert updated.sort_index == 3
    assert updated.updated_date is not None
    assert updated.updated_date >= before  # updated_date set by model method


def test_update_suggested_engagement_not_found_returns_none(session):
    """Assert update returns None when the row doesn't match (wrong id or engagement_id)."""
    eng_a, eng_b = _make_engagements(2)
    s = _insert_suggestion(eng_a.id, eng_b.id, 1)

    # wrong engagement_id
    updated = SuggestedEngagement.update_suggested_engagement(
        engagement_id=eng_b.id,
        suggestion_id=s.id,
        suggestion_data={'sort_index': 2},
    )
    assert updated is None

    # wrong suggestion_id
    updated = SuggestedEngagement.update_suggested_engagement(
        engagement_id=eng_a.id,
        suggestion_id=999999,
        suggestion_data={'sort_index': 2},
    )
    assert updated is None


def test_delete_suggestions_by_ids(session):
    """Assert that delete_suggestions_by_ids deletes multiple rows."""
    eng_a, eng_b, eng_c, eng_d = _make_engagements(4)
    s1 = _insert_suggestion(eng_a.id, eng_b.id, 1)
    s2 = _insert_suggestion(eng_a.id, eng_c.id, 2)
    s3 = _insert_suggestion(eng_a.id, eng_d.id, 3)

    SuggestedEngagement.delete_suggestions_by_ids({s1.id, s3.id})
    remaining = SuggestedEngagement.find_by_engagement_id(eng_a.id)
    assert [r.id for r in remaining] == [s2.id]


def test_delete_suggested_engagement_single(session):
    """Assert that delete_suggested_engagement deletes only the targeted row and returns count."""
    eng_a, eng_b, eng_c = _make_engagements(3)
    s1 = _insert_suggestion(eng_a.id, eng_b.id, 1)
    s2 = _insert_suggestion(eng_a.id, eng_c.id, 2)

    deleted_count = SuggestedEngagement.delete_suggested_engagement(eng_a.id, s1.id)
    assert deleted_count == 1

    rows = SuggestedEngagement.find_by_engagement_id(eng_a.id)
    assert [r.id for r in rows] == [s2.id]


def test_unique_sort_index_per_engagement_enforced(session):
    """Assert UniqueConstraint(engagement_id, sort_index) is enforced (deferrable)."""
    eng_a, eng_b, eng_c = _make_engagements(3)
    _insert_suggestion(eng_a.id, eng_b.id, 1)

    dupe = SuggestedEngagement(
        engagement_id=eng_a.id,
        suggested_engagement_id=eng_c.id,
        sort_index=1,  # duplicate for this engagement_id
    )
    db.session.add(dupe)

    if db.session.bind.dialect.name == 'postgresql':
        db.session.execute(text('SET CONSTRAINTS uq_suggested_sort_index IMMEDIATE'))

    with pytest.raises(IntegrityError):
        db.session.flush()

    db.session.rollback()


def test_unique_no_duplicate_suggested_for_same_engagement_enforced(session):
    """Assert UniqueConstraint(engagement_id, suggested_engagement_id) is enforced."""
    eng_a, eng_b = _make_engagements(2)
    _insert_suggestion(eng_a.id, eng_b.id, 1)

    dupe = SuggestedEngagement(
        engagement_id=eng_a.id,
        suggested_engagement_id=eng_b.id,  # duplicate pair
        sort_index=2,
    )
    db.session.add(dupe)

    with pytest.raises(IntegrityError):
        db.session.commit()
    db.session.rollback()


def test_check_no_self_link_enforced(session):
    """Assert CheckConstraint prevents engagement linking to itself."""
    eng_a = _make_engagements(1)[0]

    bad = SuggestedEngagement(
        engagement_id=eng_a.id,
        suggested_engagement_id=eng_a.id,  # same ID, violates ck_no_self_link
        sort_index=1,
    )
    db.session.add(bad)

    with pytest.raises(IntegrityError):
        db.session.commit()
    db.session.rollback()


def test_cascade_delete_when_engagement_deleted(session):
    """Assert ondelete='CASCADE' removes suggestions when an engagement is deleted."""
    eng_a, eng_b, eng_c = _make_engagements(3)
    _insert_suggestion(eng_a.id, eng_b.id, 1)
    _insert_suggestion(eng_a.id, eng_c.id, 2)
    assert SuggestedEngagement.find_by_engagement_id(eng_a.id)  # rows exist

    # Delete the parent engagement (eng_a)
    deleted = EngagementModel.delete_engagement(eng_a.id)
    assert deleted is not None

    remaining = SuggestedEngagement.find_by_engagement_id(eng_a.id)
    assert remaining == []
