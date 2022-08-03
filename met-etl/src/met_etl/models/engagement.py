"""engagement model class.

Manages the engagement
"""
from datetime import datetime
from .db import db
from .base_model import BaseModel


class Engagement(BaseModel):  # pylint: disable=too-few-public-methods
    """Definition of the Engagement entity."""

    __tablename__ = 'engagement'
    
    id = db.Column(db.Integer, primary_key=True, nullable=False)
    name = db.Column(db.String(50))
    start_date = db.Column(db.DateTime, default=datetime.utcnow)
    end_date = db.Column(db.DateTime, onupdate=datetime.utcnow)
    status_name = db.Column(db.String(50))
    published_date = db.Column(db.DateTime, onupdate=datetime.utcnow)