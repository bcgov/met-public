"""Engagement model class.

Manages the engagement
"""

from __future__ import annotations

from sqlalchemy.dialects.postgresql import JSON
from sqlalchemy.sql.schema import ForeignKey

from met_api.constants.engagement_status import SubmissionStatus
from .base_model import BaseModel
from .db import db


class EngagementStatusBlock(BaseModel):
    """Definition of the Engagement status block entity."""

    __tablename__ = 'engagement_status_block'
    __table_args__ = (
        db.UniqueConstraint('engagement_id', 'survey_status', name='unique_engagement_status_block'),
    )

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    engagement_id = db.Column(db.Integer, ForeignKey('engagement.id', ondelete='CASCADE'))
    survey_status = db.Column(db.Enum(SubmissionStatus), nullable=False)
    block_text = db.Column(JSON, unique=False, nullable=False)

    @classmethod
    def get_by_status(cls, engagement_id, survey_status):
        """Get Engagement Status by survey status."""
        return db.session.query(EngagementStatusBlock) \
            .filter(EngagementStatusBlock.survey_status == survey_status,
                    EngagementStatusBlock.engagement_id == engagement_id
                    ) \
            .first()

    @classmethod
    def save_status_blocks(cls, status_blocks: list) -> None:
        """Update widgets.."""
        db.session.bulk_save_objects(status_blocks)
