"""Engagement summary model class.

Manages the engagement summary content
"""

from __future__ import annotations

from sqlalchemy.dialects.postgresql import JSON
from sqlalchemy.sql.schema import ForeignKey

from .base_model import BaseModel
from .db import db


class EngagementSummary(BaseModel):
    """Definition of the Engagement summary content entity."""

    __tablename__ = 'engagement_summary_content'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    content = db.Column(db.Text, unique=False, nullable=False)
    rich_content = db.Column(JSON, unique=False, nullable=False)
    engagement_content_id = db.Column(db.Integer, ForeignKey('engagement_content.id', ondelete='CASCADE'))
    engagement_id = db.Column(db.Integer, ForeignKey('engagement.id', ondelete='CASCADE'))

    @classmethod
    def get_summary_content(cls, content_id) -> list[EngagementSummary]:
        """Get engagement summary content."""
        summary_content = db.session.query(EngagementSummary) \
            .filter(EngagementSummary.engagement_content_id == content_id) \
            .all()
        return summary_content

    @classmethod
    def get_summary_content_by_engagement_id(cls, engagement_id) -> list[EngagementSummary]:
        """Get engagement summary content by engagement id."""
        summary_content = db.session.query(EngagementSummary) \
            .filter(EngagementSummary.engagement_id == engagement_id) \
            .first()
        return summary_content

    @classmethod
    def update_summary_content(cls, content_id, summary_content_data: dict) -> EngagementSummary:
        """Update engagement summary content."""
        query = EngagementSummary.query.filter_by(engagement_content_id=content_id)
        summary_content: EngagementSummary = query.first()
        if not summary_content:
            return summary_content_data
        query.update(summary_content_data)
        db.session.commit()
        return summary_content

    @classmethod
    def save_engagement_summary_content(cls, summary_content: list) -> None:
        """Save summary content."""
        db.session.bulk_save_objects(summary_content)
