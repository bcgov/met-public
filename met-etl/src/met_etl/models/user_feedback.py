"""user_feedback model class.

Manages the user feedback for a survey
"""
from datetime import datetime
from sqlalchemy import ForeignKey
from .db import db


class user_feedback(db.Model):  # pylint: disable=too-few-public-methods
    """Definition of the user_feedback entity."""

    __bind_key__ = 'met_db_analytics'
    __tablename__ = 'user_feedback'
    

    id = db.Column(db.Integer, primary_key=True, nullable=False, autoincrement=True)
    survey_id = db.Column(db.Integer, ForeignKey('survey.id', ondelete='CASCADE'), primary_key=True, nullable=False)
    engagement_id = db.Column(db.Integer, ForeignKey('engagement.id', ondelete='CASCADE'), primary_key=True, nullable=False)
    user_id = db.Column(db.Integer, ForeignKey('user.id', ondelete='CASCADE'), primary_key=True, nullable=False)
    comment = db.Column(db.String(5000))
    created_date = db.Column(db.DateTime, default=datetime.utcnow)
    updated_date = db.Column(db.DateTime, onupdate=datetime.utcnow)
    sentiment_analysis = db.Column(db.String(100))
    label = db.Column(db.String(100))

    @classmethod
    def get_all(cls):
        """Get all user_feedback."""
        return db.session.query(user_feedback).all()