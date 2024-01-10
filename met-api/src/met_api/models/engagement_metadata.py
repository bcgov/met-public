"""Engagement model class.

Manages the engagement
"""

from __future__ import annotations

from typing import Optional

# from sqlalchemy.dialects import postgresql
from sqlalchemy.sql.schema import ForeignKey

from .base_model import BaseModel
from .db import db


class EngagementMetadataModel(BaseModel):
    """Definition of the Engagement metadata entity."""

    __tablename__ = 'engagement_metadata'
    engagement_id = db.Column(db.Integer, ForeignKey('engagement.id', ondelete='CASCADE'), primary_key=True)
    # TODO: Uncomment when upcoming changes to app metadata take place
    # project_metadata = db.Column(postgresql.JSONB(astext_type=db.Text()), unique=False, nullable=True)

    @classmethod
    def find_by_engagement_id(cls, engagement_id):
        """Return engagement slug by engagement id."""
        return cls.query.filter_by(engagement_id=engagement_id).first()

    @classmethod
    def update(cls, engagement_metadata_data: dict) -> Optional[EngagementMetadataModel]:
        """Update engagement."""
        engagement_id = engagement_metadata_data.get('engagement_id', None)
        query = EngagementMetadataModel.query.filter_by(engagement_id=engagement_id)
        engagement_metadata: EngagementMetadataModel = query.first()
        if not engagement_metadata:
            return None

        # TODO: Restore partial functionality to this method when the new Engagement Metadata is added.
        db.session.commit()
        return engagement_metadata
