"""survey model class.

Manages the survey
"""
from sqlalchemy import ForeignKey

from .base_model import BaseModel
from .db import db


class Survey(BaseModel):  # pylint: disable=too-few-public-methods
    """Definition of the Survey entity."""

    __tablename__ = 'survey'

    id = db.Column(db.Integer, primary_key=True, nullable=False)
    name = db.Column(db.String(50))
    engagement_id = db.Column(db.Integer, ForeignKey('engagement.id', ondelete='CASCADE'))
