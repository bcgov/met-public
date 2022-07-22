"""request_type_selectboxes model class.

Manages the selectboxes type questions on a survey
"""
from datetime import datetime
from sqlalchemy import ForeignKey
from .db import db


class request_type_selectboxes(db.Model):  # pylint: disable=too-few-public-methods
    """Definition of the request_type_selectboxes entity."""

    __bind_key__ = 'met_db_analytics'
    __tablename__ = 'request_type_selectboxes'
    

    request_id = db.Column(db.Integer, primary_key=True, nullable=False)
    survey_id = db.Column(db.Integer, ForeignKey('survey.survey_id', ondelete='CASCADE'), primary_key=True, nullable=False)
    engagement_id = db.Column(db.Integer, ForeignKey('engagement.engagement_id', ondelete='CASCADE'), primary_key=True, nullable=False)
    request_key = db.Column(db.String(100), primary_key=True, nullable=False)
    request_type = db.Column(db.String(100))
    request_label = db.Column(db.String(100))
    created_date = db.Column(db.DateTime, default=datetime.utcnow)
    updated_date = db.Column(db.DateTime, onupdate=datetime.utcnow)
    active_flag = db.Column(db.String(1))

    @classmethod
    def get_all(cls):
        """Get all request_type_selectboxes."""
        return db.session.query(request_type_selectboxes).all()