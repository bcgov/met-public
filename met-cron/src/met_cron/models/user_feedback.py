"""user_feedback model class.

Manages the user feedback for a survey
"""
from sqlalchemy import ForeignKey

from .base_model import BaseModel
from .db import db


class UserFeedback(BaseModel):  # pylint: disable=too-few-public-methods
    """Definition of the User Feedback entity."""

    __tablename__ = 'user_feedback'

    id = db.Column(db.Integer, primary_key=True, nullable=False, autoincrement=True)
    survey_id = db.Column(db.Integer, ForeignKey('survey.id', ondelete='CASCADE'), primary_key=True, nullable=False)
    user_id = db.Column(db.Integer)
    comment = db.Column(db.String(5000))
    sentiment_analysis = db.Column(db.String(100))
    label = db.Column(db.String(100))
    source_comment_id = db.Column(db.Integer)
