"""response_type_textarea model class.

Manages the responses for a textarea type questions on a survey
"""
from datetime import datetime
from sqlalchemy import ForeignKey
from .db import db


class response_type_textarea(db.Model):  # pylint: disable=too-few-public-methods
    """Definition of the response_type_textarea entity."""

    __bind_key__ = 'met_db_analytics'
    __tablename__ = 'response_type_textarea'
    

    id = db.Column(db.Integer, primary_key=True, nullable=False)
    survey_id = db.Column(db.Integer, ForeignKey('survey.id', ondelete='CASCADE'), primary_key=True, nullable=False)
    engagement_id = db.Column(db.Integer, ForeignKey('engagement.id', ondelete='CASCADE'), primary_key=True, nullable=False)
    user_id = db.Column(db.Integer, ForeignKey('user.id', ondelete='CASCADE'), primary_key=True, nullable=False)
    request_key = db.Column(db.String(100))
    value = db.Column(db.String(5000))
    created_date = db.Column(db.DateTime, default=datetime.utcnow)
    updated_date = db.Column(db.DateTime, onupdate=datetime.utcnow)
    active_flag = db.Column(db.String(1))

    @classmethod
    def get_all(cls):
        """Get all response_type_textarea."""
        return db.session.query(response_type_textarea).all()