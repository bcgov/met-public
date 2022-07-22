"""response_type_selectboxes model class.

Manages the responses for a selectboxes type questions on a survey
"""
from datetime import datetime
from sqlalchemy import ForeignKey
from .db import db


class response_type_selectboxes(db.Model):  # pylint: disable=too-few-public-methods
    """Definition of the response_type_selectboxes entity."""

    __bind_key__ = 'met_db_analytics'
    __tablename__ = 'response_type_selectboxes'
    

    response_id = db.Column(db.Integer, primary_key=True, nullable=False)
    survey_id = db.Column(db.Integer, ForeignKey('survey.survey_id', ondelete='CASCADE'), primary_key=True, nullable=False)
    engagement_id = db.Column(db.Integer, ForeignKey('engagement.engagement_id', ondelete='CASCADE'), primary_key=True, nullable=False)
    user_id = db.Column(db.Integer, ForeignKey('user_table.user_id', ondelete='CASCADE'), primary_key=True, nullable=False)
    request_key = db.Column(db.String(100), primary_key=True, nullable=False)
    request_label = db.Column(db.String(5000), primary_key=True, nullable=False)
    request_value = db.Column(db.String(5000))
    response_value = db.Column(db.String(5000))
    created_date = db.Column(db.DateTime, default=datetime.utcnow)
    updated_date = db.Column(db.DateTime, onupdate=datetime.utcnow)
    active_flag = db.Column(db.String(1))

    @classmethod
    def get_all(cls):
        """Get all response_type_selectboxes."""
        return db.session.query(response_type_selectboxes).all()