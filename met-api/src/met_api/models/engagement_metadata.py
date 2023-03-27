"""Engagement model class.

Manages the engagement
"""

from __future__ import annotations

from typing import Optional

from sqlalchemy.dialects import postgresql
from sqlalchemy.sql.schema import ForeignKey

from .base_model import BaseModel
from .db import db


class EngagementMetadataModel(BaseModel):
    """Definition of the Engagement metadata entity."""

    __tablename__ = 'engagement_metadata'
    engagement_id = db.Column(db.Integer, ForeignKey('engagement.id', ondelete='CASCADE'), primary_key=True)
    project_id = db.Column(db.String(50), unique=False, nullable=True)
    project_metadata = db.Column(postgresql.JSONB(astext_type=db.Text()), unique=False, nullable=True)

    @classmethod
    def update(cls, engagement_metadata_data: dict) -> Optional[EngagementMetadataModel]:
        """Update engagement."""
        engagement_id = engagement_metadata_data.get('engagement_id', None)
        query = EngagementMetadataModel.query.filter_by(engagement_id=engagement_id)
        engagement_metadata: EngagementMetadataModel = query.first()
        if not engagement_metadata:
            return None
        update_fields = dict(
            project_id=engagement_metadata_data.get('project_id', engagement_metadata.project_id),
            project_metadata=engagement_metadata_data.get('project_metadata', engagement_metadata.project_metadata),
        )
        query.update(update_fields)
        db.session.commit()
        return engagement_metadata
