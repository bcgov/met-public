"""Suggested engagement model class.

Database operations for suggested engagements. These are received by the API as an array
"""

from __future__ import annotations

from sqlalchemy import CheckConstraint
from sqlalchemy.sql.schema import ForeignKey

from .base_model import BaseModel
from .db import db


class SuggestedEngagement(BaseModel):
    """Definition of the Suggested Engagement entity."""

    __tablename__ = 'suggested_engagements'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    engagement_id = db.Column(db.Integer, ForeignKey('engagement.id', ondelete='CASCADE'), nullable=False)
    suggested_engagement_id = db.Column(db.Integer, ForeignKey('engagement.id', ondelete='CASCADE'), nullable=False)
    sort_index = db.Column(db.Integer, nullable=False)

    source_engagement = db.relationship(
        'Engagement',
        back_populates='suggested_engagement_links',
        foreign_keys=[engagement_id],
    )
    suggested_engagement = db.relationship(
        'Engagement',
        back_populates='suggested_by_links',
        foreign_keys=[suggested_engagement_id],
    )

    __table_args__ = (
        db.UniqueConstraint('engagement_id', 'sort_index', name='uq_suggested_sort_index',
                            deferrable=True, initially='DEFERRED'),
        db.UniqueConstraint('engagement_id', 'suggested_engagement_id', name='uq_suggested_no_duplicates'),
        CheckConstraint('engagement_id <> suggested_engagement_id', name='ck_no_self_link'),
    )
