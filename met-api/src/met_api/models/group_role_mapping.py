"""Group role mapping model class.

Manages the group to role mapping
"""
from __future__ import annotations

from .base_model import BaseModel
from .db import db


class GroupRoleMapping(BaseModel):  # pylint: disable=too-few-public-methods, too-many-instance-attributes
    """Definition of the Group role mapping entity."""

    __tablename__ = 'group_role_mapping'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    role_id = db.Column(db.Integer, db.ForeignKey('user_role.id'), nullable=True)
    group_id = db.Column(db.Integer, db.ForeignKey('user_group.id'), nullable=True)

    @classmethod
    def get_all_by_group_id(cls, group_id):
        """Get roles by group id."""
        return db.session.query(GroupRoleMapping).filter(GroupRoleMapping.group_id == group_id).all()
