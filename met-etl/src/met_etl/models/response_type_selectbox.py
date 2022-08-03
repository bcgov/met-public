"""response_type_selectbox model class.

Manages the responses for a selectboxes type questions on a survey
"""
from sqlalchemy import ForeignKeyConstraint
from .db import db
from .base_model import BaseModel
from .request_type_selectbox import request_type_selectbox


class ResponseTypeSelectbox(BaseModel):  # pylint: disable=too-few-public-methods
    """Definition of the Response Type Selectbox entity."""

    __tablename__ = 'response_type_selectbox'
    

    id = db.Column(db.Integer, primary_key=True, nullable=False)
    request_id = db.Column(db.String(100), primary_key=True, nullable=False)
    request_key = db.Column(db.String(100), primary_key=True, nullable=False)
    survey_id = db.Column(db.Integer, primary_key=True, nullable=False)
    engagement_id = db.Column(db.Integer, primary_key=True, nullable=False)
    user_id = db.Column(db.Integer)
    request_label = db.Column(db.String(5000), primary_key=True, nullable=False)
    request_value = db.Column(db.String(5000))
    value = db.Column(db.String(5000)) 
    __table_args__ = (ForeignKeyConstraint([request_id, request_key, survey_id, engagement_id],
                                           [request_type_selectbox.id, request_type_selectbox.key, request_type_selectbox.survey_id, request_type_selectbox.engagement_id]),
                      {}) 