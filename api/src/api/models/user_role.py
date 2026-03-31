"""User role model class.

Manages the user roles
"""
from __future__ import annotations

from .base_model import BaseModel
from .db import db


class UserRole(BaseModel):  # pylint: disable=too-few-public-methods, too-many-instance-attributes
    """Definition of the User role entity."""

    __tablename__ = 'user_role'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(50), nullable=False)
    description = db.Column(db.Text, unique=False, nullable=False)
