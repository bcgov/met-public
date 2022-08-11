"""user model class.

Manages the user details
"""
from .base_model import BaseModel
from .db import db


class User(BaseModel):  # pylint: disable=too-few-public-methods
    """Definition of the User entity."""

    __tablename__ = 'user'

    id = db.Column(db.Integer, primary_key=True, nullable=False)
    name = db.Column(db.String(100))
