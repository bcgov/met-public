"""user model class.

Manages the user details
"""
from .db import db
from .base_model import BaseModel


class user(BaseModel):  # pylint: disable=too-few-public-methods
    """Definition of the user entity."""

    __tablename__ = 'user'
    

    id = db.Column(db.Integer, primary_key=True, nullable=False)
    name = db.Column(db.String(100))