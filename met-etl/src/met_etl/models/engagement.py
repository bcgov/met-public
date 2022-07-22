"""engagement model class.

Manages the engagement
"""
from datetime import datetime
from .db import db


class engagement(db.Model):  # pylint: disable=too-few-public-methods
    """Definition of the engagement entity."""

    __bind_key__ = 'met_db_analytics'
    __tablename__ = 'engagement'
    

    engagement_id = db.Column(db.Integer, primary_key=True, nullable=False)
    engagement_name = db.Column(db.String(50))
    start_date = db.Column(db.DateTime, default=datetime.utcnow)
    end_date = db.Column(db.DateTime, onupdate=datetime.utcnow)
    status_name = db.Column(db.String(50))
    created_date = db.Column(db.DateTime, default=datetime.utcnow)
    updated_date = db.Column(db.DateTime, onupdate=datetime.utcnow)
    published_date = db.Column(db.DateTime, onupdate=datetime.utcnow)

    @classmethod
    def get_all(cls):
        """Get all engagement."""
        return db.session.query(engagement).all()