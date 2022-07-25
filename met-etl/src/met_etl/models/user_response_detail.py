"""user_response_detail model class.

Manages the user responses for a survey
"""
from datetime import datetime
from sqlalchemy import ForeignKey
from sqlalchemy import UniqueConstraint
from .db import db


class user_response_detail(db.Model):  # pylint: disable=too-few-public-methods
    """Definition of the user_response_detail entity."""

    __bind_key__ = 'met_db_analytics'
    __tablename__ = 'user_response_detail'
    

    id = db.Column(db.Integer, primary_key=True, nullable=False)
    survey_id = db.Column(db.Integer, ForeignKey('survey.id', ondelete='CASCADE'), primary_key=True, nullable=False)
    engagement_id = db.Column(db.Integer, ForeignKey('engagement.id', ondelete='CASCADE'), primary_key=True, nullable=False)
    user_id = db.Column(db.Integer, ForeignKey('user.id', ondelete='CASCADE'), primary_key=True, nullable=False)
    created_date = db.Column(db.DateTime, default=datetime.utcnow)
    updated_date = db.Column(db.DateTime, onupdate=datetime.utcnow)
    active_flag = db.Column(db.String(1))

    @classmethod
    def get_all(cls):
        """Get all user_response_detail."""
        return db.session.query(user_response_detail).all()