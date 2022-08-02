"""response_type_textfield model class.

Manages the responses for a textfield type questions on a survey
"""
from sqlalchemy import ForeignKeyConstraint
from .db import db
from .base_model import BaseModel
from .request_type_textfield import request_type_textfield


class response_type_textfield(BaseModel):  # pylint: disable=too-few-public-methods
    """Definition of the response_type_textfield entity."""

    __tablename__ = 'response_type_textfield'
    

    id = db.Column(db.Integer, primary_key=True, nullable=False)
    request_id = db.Column(db.String(100), primary_key=True, nullable=False)
    request_key = db.Column(db.String(100), primary_key=True, nullable=False)
    survey_id = db.Column(db.Integer, primary_key=True, nullable=False)
    engagement_id = db.Column(db.Integer, primary_key=True, nullable=False)
    user_id = db.Column(db.Integer)
    value = db.Column(db.String(5000)) 
    __table_args__ = (ForeignKeyConstraint([request_id, request_key, survey_id, engagement_id],
                                           [request_type_textfield.id, request_type_textfield.key, request_type_textfield.survey_id, request_type_textfield.engagement_id]),
                      {}) 