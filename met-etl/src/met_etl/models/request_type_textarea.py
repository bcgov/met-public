"""request_type_textarea model class.

Manages the textarea type questions on a survey
"""
from sqlalchemy import ForeignKey
from .db import db
from .base_model import BaseModel


class RequestTypeTextarea(BaseModel):  # pylint: disable=too-few-public-methods
    """Definition of the Request Type Textarea entity."""

    __tablename__ = 'request_type_textarea'
    

    id = db.Column(db.String(100), primary_key=True, nullable=False)
    survey_id = db.Column(db.Integer, ForeignKey('survey.id', ondelete='CASCADE'), primary_key=True, nullable=False)
    engagement_id = db.Column(db.Integer, ForeignKey('engagement.id', ondelete='CASCADE'), primary_key=True, nullable=False)
    key = db.Column(db.String(100), primary_key=True, nullable=False)
    type = db.Column(db.String(100))
    label = db.Column(db.String(100))