"""Engagement model class.

Manages the engagement
"""

from __future__ import annotations

from typing import Optional

from sqlalchemy.sql.schema import ForeignKey

from .base_model import BaseModel
from .db import db


class EngagementSettingsModel(BaseModel):
    """Definition of the Engagement metadata entity."""

    __tablename__ = 'engagement_settings'
    engagement_id = db.Column(db.Integer, ForeignKey('engagement.id', ondelete='CASCADE'), primary_key=True)
    send_report = db.Column(db.Boolean, nullable=False)

    @classmethod
    def update(cls, engagement_id, engagement_settings_data: dict) -> Optional[EngagementSettingsModel]:
        """Update engagement."""
        query = EngagementSettingsModel.query.filter_by(engagement_id=engagement_id)
        engagement_settings: EngagementSettingsModel = query.first()
        if not engagement_settings:
            return None
        query.update(engagement_settings_data)
        db.session.commit()
        return engagement_settings
