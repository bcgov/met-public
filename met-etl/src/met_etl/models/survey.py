"""survey model class.

Manages the survey
"""
from sqlalchemy import ForeignKey
from .db import db
from .base_model import BaseModel


class survey(BaseModel):  # pylint: disable=too-few-public-methods
    """Definition of the survey entity."""

    __tablename__ = 'survey'
    

    id = db.Column(db.Integer, primary_key=True, nullable=False)
    name = db.Column(db.String(50))
    engagement_id = db.Column(db.Integer, ForeignKey('engagement.id', ondelete='CASCADE'))