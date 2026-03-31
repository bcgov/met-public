"""User Status model class.

Manages the User status
"""

from .base_model import BaseModel
from .db import db


class UserStatus(BaseModel):  # pylint: disable=too-few-public-methods
    """Definition of the User Status entity."""

    __tablename__ = 'user_status'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    status_name = db.Column(db.String(50))
    description = db.Column(db.String(50))
    user_status_id = db.relationship('StaffUser', backref='user_status', cascade='all, delete')
