"""request_type_selectbox model class.

Manages the selectboxes type questions on a survey
"""
from sqlalchemy import ForeignKey
from .db import db
from .base_model import BaseModel


class request_type_selectbox(BaseModel):  # pylint: disable=too-few-public-methods
    """Definition of the request_type_selectbox entity."""

    __tablename__ = 'request_type_selectbox'
    

    id = db.Column(db.String(100), primary_key=True, nullable=False)
    survey_id = db.Column(db.Integer, ForeignKey('survey.id', ondelete='CASCADE'), primary_key=True, nullable=False)
    engagement_id = db.Column(db.Integer, ForeignKey('engagement.id', ondelete='CASCADE'), primary_key=True, nullable=False)
    key = db.Column(db.String(100), primary_key=True, nullable=False)
    type = db.Column(db.String(100))
    label = db.Column(db.String(100))