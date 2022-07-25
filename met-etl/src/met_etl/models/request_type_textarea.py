"""request_type_textarea model class.

Manages the textarea type questions on a survey
"""
from datetime import datetime
from sqlalchemy import ForeignKey
from .db import db


class request_type_textarea(db.Model):  # pylint: disable=too-few-public-methods
    """Definition of the request_type_textarea entity."""

    __bind_key__ = 'met_db_analytics'
    __tablename__ = 'request_type_textarea'
    

    id = db.Column(db.Integer, primary_key=True, nullable=False)
    survey_id = db.Column(db.Integer, ForeignKey('survey.id', ondelete='CASCADE'), primary_key=True, nullable=False)
    engagement_id = db.Column(db.Integer, ForeignKey('engagement.id', ondelete='CASCADE'), primary_key=True, nullable=False)
    key = db.Column(db.String(100), primary_key=True, nullable=False)
    type = db.Column(db.String(100))
    label = db.Column(db.String(100))
    created_date = db.Column(db.DateTime, default=datetime.utcnow)
    updated_date = db.Column(db.DateTime, onupdate=datetime.utcnow)
    active_flag = db.Column(db.String(1))

    @classmethod
    def get_all(cls):
        """Get all request_type_textarea."""
        return db.session.query(request_type_textarea).all()