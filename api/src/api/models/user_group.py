"""User group model class.

Manages the user groups
"""
from __future__ import annotations

from .base_model import BaseModel
from .db import db


class UserGroup(BaseModel):  # pylint: disable=too-few-public-methods, too-many-instance-attributes
    """Definition of the User group entity."""

    __tablename__ = 'user_group'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(50), nullable=False)

    # Define the relationship with GroupRoleMapping
    role_mappings = db.relationship('GroupRoleMapping', backref='user_group')

    @classmethod
    def get_all_groups(cls):
        """Get all the available groups."""
        return db.session.query(UserGroup).all()
