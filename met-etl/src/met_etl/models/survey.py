"""Survey model class.

Manages the Survey
"""
from datetime import datetime
from .db import db


class Survey(db.Model):  # pylint: disable=too-few-public-methods
    """Definition of the Survey entity."""

    __bind_key__ = 'met_db_analytics'
    __tablename__ = 'survey'
    

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(50), index=True)
    engagement_id = db.Column(db.Integer)
    created_date = db.Column(db.DateTime, default=datetime.utcnow)
    updated_date = db.Column(db.DateTime, onupdate=datetime.utcnow)
    created_by = db.Column(db.String(50))
    updated_by = db.Column(db.String(50))
    helo = db.Column(db.String(50))

    @classmethod
    def get_all(cls):
        """Get all surveys."""
        return db.session.query(Survey).all()
