"""engagement model class.

Manages the engagement
"""
from datetime import datetime
from sqlalchemy import update


from .base_model import BaseModel
from .db import db


class Engagement(BaseModel):  # pylint: disable=too-few-public-methods
    """Definition of the Engagement entity."""

    __tablename__ = 'engagement'

    id = db.Column(db.Integer, primary_key=True, nullable=False)
    source_engagement_id = db.Column(db.Integer)
    name = db.Column(db.String(100))
    start_date = db.Column(db.DateTime, default=datetime.utcnow)
    end_date = db.Column(db.DateTime, onupdate=datetime.utcnow)
    published_date = db.Column(db.DateTime, onupdate=datetime.utcnow)

    @classmethod
    def find_by_source_id(cls, source_identifier: int):
        """Return model by source_identifier."""
        return cls.query.filter_by(source_engagement_id=source_identifier).all()

    @classmethod
    def deactivate_by_source_id(cls, source_identifier: int):
        """Deactivate model by source_identifier."""
        return cls.query.filter_by(source_engagement_id=source_identifier).update(
            {Engagement.is_active: False})
