"""user_response_detail model class.

Manages the user responses for a survey
"""
from sqlalchemy import ForeignKey
from .db import db
from .base_model import BaseModel


class user_response_detail(BaseModel):  # pylint: disable=too-few-public-methods
    """Definition of the user_response_detail entity."""

    __tablename__ = 'user_response_detail'
    

    id = db.Column(db.Integer, primary_key=True, nullable=False)
    survey_id = db.Column(db.Integer, ForeignKey('survey.id', ondelete='CASCADE'), primary_key=True, nullable=False)
    engagement_id = db.Column(db.Integer, ForeignKey('engagement.id', ondelete='CASCADE'), primary_key=True, nullable=False)
    user_id = db.Column(db.Integer)