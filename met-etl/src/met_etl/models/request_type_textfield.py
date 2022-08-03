"""request_type_textfield model class.

Manages the textfield type questions on a survey
"""
from sqlalchemy import ForeignKey
from .db import db
from .base_model import BaseModel


class RequestTypeTextfield(BaseModel):  # pylint: disable=too-few-public-methods
    """Definition of the Request Type Textfield entity."""

    __tablename__ = 'request_type_textfield'
    

    id = db.Column(db.String(100), primary_key=True, nullable=False)
    survey_id = db.Column(db.Integer, ForeignKey('survey.id', ondelete='CASCADE'), primary_key=True, nullable=False)
    engagement_id = db.Column(db.Integer, ForeignKey('engagement.id', ondelete='CASCADE'), primary_key=True, nullable=False)
    key = db.Column(db.String(100), primary_key=True, nullable=False)
    type = db.Column(db.String(100))
    label = db.Column(db.String(100))