"""survey model class.

Manages the survey
"""
from datetime import datetime
from sqlalchemy import ForeignKey
from .db import db


class survey(db.Model):  # pylint: disable=too-few-public-methods
    """Definition of the survey entity."""

    __bind_key__ = 'met_db_analytics'
    __tablename__ = 'survey'
    

    id = db.Column(db.Integer, primary_key=True, nullable=False)
    name = db.Column(db.String(50))
    engagement_id = db.Column(db.Integer, ForeignKey('engagement.id', ondelete='CASCADE'))
    created_date = db.Column(db.DateTime, default=datetime.utcnow)
    updated_date = db.Column(db.DateTime, onupdate=datetime.utcnow)
    version = db.Column(db.String(50))
    active_flag = db.Column(db.String(1))

    @classmethod
    def get_all(cls): 
        """Get all survey."""
        return db.session.query(survey).all()