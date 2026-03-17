"""Suggested engagement model class.

Database operations for suggested engagements. These are received by the API as an array
"""

from __future__ import annotations
from datetime import datetime
from typing import Optional

from sqlalchemy import CheckConstraint
from sqlalchemy.sql.schema import ForeignKey

from met_api.models.engagement import Engagement
from .base_model import BaseModel
from .db import db


class SuggestedEngagement(BaseModel):
    """Definition of the Suggested Engagement entity."""

    __tablename__ = 'suggested_engagements'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    engagement_id = db.Column(db.Integer, ForeignKey('engagement.id', ondelete='CASCADE'), nullable=False)
    suggested_engagement_id = db.Column(db.Integer, ForeignKey('engagement.id', ondelete='CASCADE'), nullable=False)
    sort_index = db.Column(db.Integer, nullable=False)

    __table_args__ = (
        db.UniqueConstraint('engagement_id', 'sort_index', name='uq_suggested_sort_index',
                            deferrable=True, initially='DEFERRED'),
        db.UniqueConstraint('engagement_id', 'suggested_engagement_id', name='uq_suggested_no_duplicates'),
        CheckConstraint('engagement_id <> suggested_engagement_id', name='ck_no_self_link'),
    )

    @classmethod
    def find_by_engagement_id(cls, engagement_id) -> list[SuggestedEngagement]:
        """Get all suggested engagements for an engagement."""
        return db.session.query(cls)\
            .filter(cls.engagement_id == engagement_id)\
            .order_by(cls.sort_index.asc())\
            .all()

    @classmethod
    def find_by_engagement_id_and_attach(cls, engagement_id: int):
        """Get all suggested engagements with engagements attached."""
        return db.session.query(cls, Engagement)\
            .join(Engagement, Engagement.id == cls.suggested_engagement_id)\
            .filter(cls.engagement_id == engagement_id)\
            .order_by(cls.sort_index.asc())\
            .all()

    @classmethod
    def bulk_insert_suggested_engagements(cls, insert_mappings: list) -> None:
        """Insert multiple suggested engagements."""
        db.session.bulk_insert_mappings(cls, insert_mappings)
        db.session.commit()

    @classmethod
    def bulk_update_suggested_engagements(cls, update_mappings: list) -> None:
        """Update multiple suggested engagements."""
        db.session.bulk_update_mappings(cls, update_mappings)
        db.session.commit()

    @classmethod
    def update_suggested_engagement(cls, engagement_id, suggestion_id,
                                    suggestion_data) -> Optional[SuggestedEngagement]:
        """Update a single suggested engagement."""
        query = cls.query.filter_by(id=suggestion_id, engagement_id=engagement_id)
        suggestion = query.first()
        if not suggestion:
            return None
        suggestion_data['updated_date'] = datetime.utcnow()
        query.update(suggestion_data)
        db.session.commit()
        db.session.refresh(suggestion)
        return suggestion

    @classmethod
    def delete_suggestions_by_ids(cls, suggestion_ids: set) -> None:
        """Delete multiple suggestions by ID."""
        db.session.query(cls).filter(cls.id.in_(suggestion_ids)).delete(synchronize_session=False)
        db.session.commit()

    @classmethod
    def delete_suggested_engagement(cls, engagement_id, suggestion_id) -> int:
        """Delete a single suggested engagement."""
        deleted_count = cls.query.filter_by(id=suggestion_id, engagement_id=engagement_id).delete()
        db.session.commit()
        return deleted_count
