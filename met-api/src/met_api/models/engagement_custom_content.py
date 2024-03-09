"""Engagement custom model class.

Manages the engagement custom content
"""

from __future__ import annotations

from sqlalchemy.dialects.postgresql import JSON
from sqlalchemy.sql.schema import ForeignKey

from .base_model import BaseModel
from .db import db


class EngagementCustom(BaseModel):
    """Definition of the Engagement custom content entity."""

    __tablename__ = 'engagement_custom_content'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    custom_text_content = db.Column(db.Text, unique=False, nullable=True)
    custom_json_content = db.Column(JSON, unique=False, nullable=True)
    engagement_content_id = db.Column(db.Integer, ForeignKey('engagement_content.id', ondelete='CASCADE'))
    engagement_id = db.Column(db.Integer, ForeignKey('engagement.id', ondelete='CASCADE'))

    @classmethod
    def get_custom_content(cls, content_id) -> list[EngagementCustom]:
        """Get engagement custom content."""
        custom_content = db.session.query(EngagementCustom) \
            .filter(EngagementCustom.engagement_content_id == content_id) \
            .all()
        return custom_content

    @classmethod
    def update_custom_content(cls, content_id, custom_content_data: dict) -> EngagementCustom:
        """Update engagement custom content."""
        query = EngagementCustom.query.filter_by(engagement_content_id=content_id)
        custom_content: EngagementCustom = query.first()
        if not custom_content:
            return custom_content_data
        query.update(custom_content_data)
        db.session.commit()
        return custom_content

    @classmethod
    def save_engagement_custom_content(cls, custom_content: list) -> None:
        """Save custom content."""
        db.session.bulk_save_objects(custom_content)
