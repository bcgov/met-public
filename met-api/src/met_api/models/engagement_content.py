"""Engagement content model class.

Manages the engagement content. Each record in this table stores the configurations
associated with different sections or content elements within an engagement.
"""

from __future__ import annotations
from datetime import datetime
from typing import Optional

from sqlalchemy.sql.schema import ForeignKey
from met_api.constants.engagement_content_type import EngagementContentType

from .base_model import BaseModel
from .db import db


class EngagementContent(BaseModel):
    """Definition of the Engagement content entity."""

    __tablename__ = 'engagement_content'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    title = db.Column(db.String(50), unique=False, nullable=False)
    icon_name = db.Column(db.Text, unique=False, nullable=True)
    content_type = db.Column(db.Enum(EngagementContentType), nullable=False,
                             default=EngagementContentType.Summary)
    engagement_id = db.Column(db.Integer, ForeignKey('engagement.id', ondelete='CASCADE'))
    sort_index = db.Column(db.Integer, nullable=False, default=1)
    is_internal = db.Column(db.Boolean, nullable=False)

    @classmethod
    def get_contents_by_engagement_id(cls, engagement_id):
        """Get contents by engagement id."""
        return db.session.query(EngagementContent)\
            .filter(EngagementContent.engagement_id == engagement_id)\
            .order_by(EngagementContent.sort_index.asc())\
            .all()

    @classmethod
    def update_engagement_contents(cls, update_mappings: list) -> None:
        """Update contents."""
        db.session.bulk_update_mappings(EngagementContent, update_mappings)
        db.session.commit()

    @classmethod
    def save_engagement_content(cls, content: list) -> None:
        """Update custom content."""
        db.session.bulk_save_objects(content)

    @classmethod
    def remove_engagement_content(cls, engagement_id, engagement_content_id,) -> EngagementContent:
        """Remove engagement content from engagement."""
        engagement_content = EngagementContent.query.filter_by(id=engagement_content_id,
                                                               engagement_id=engagement_id).delete()
        db.session.commit()
        return engagement_content

    @classmethod
    def update_engagement_content(cls, engagement_id, engagement_content_id,
                                  engagement_content_data: dict) -> Optional[EngagementContent]:
        """Update engagement content."""
        query = EngagementContent.query.filter_by(id=engagement_content_id, engagement_id=engagement_id)
        engagement_content: EngagementContent = query.first()
        if not engagement_content:
            return None
        engagement_content_data['updated_date'] = datetime.utcnow()
        query.update(engagement_content_data)
        db.session.commit()
        return engagement_content
