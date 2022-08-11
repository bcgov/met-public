"""response_type_textfield model class.

Manages the responses for a textfield type questions on a survey
"""
from sqlalchemy import ForeignKeyConstraint

from .base_model import BaseModel
from .db import db
from .request_type_textfield import RequestTypeTextfield


class ResponseTypeTextfield(BaseModel):  # pylint: disable=too-few-public-methods
    """Definition of the Response Type Textfield entity."""

    __tablename__ = 'response_type_textfield'

    id = db.Column(db.Integer, primary_key=True, nullable=False)
    request_id = db.Column(db.String(100), primary_key=True, nullable=False)
    request_key = db.Column(db.String(100), primary_key=True, nullable=False)
    survey_id = db.Column(db.Integer, primary_key=True, nullable=False)
    engagement_id = db.Column(db.Integer, primary_key=True, nullable=False)
    user_id = db.Column(db.Integer)
    value = db.Column(db.String(5000))
    __table_args__ = (ForeignKeyConstraint([request_id, request_key, survey_id, engagement_id],
                                           [RequestTypeTextfield.id, RequestTypeTextfield.key,
                                            RequestTypeTextfield.survey_id, RequestTypeTextfield.engagement_id]),
                      {})
