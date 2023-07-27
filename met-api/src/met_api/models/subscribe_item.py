"""Widget Subscribe model class.

Manages the Widget Subscribe
"""
from __future__ import annotations

from sqlalchemy.sql.schema import ForeignKey

from .base_model import BaseModel
from .db import db
from ..constants.subscribe_types import SubscribeTypeLabel

class SubscribeItem(BaseModel):  # pylint: disable=too-few-public-methods, too-many-instance-attributes
    """Subscribe Item table."""

    __tablename__ = 'subscribe_item'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    description = db.Column(db.Text)
    call_to_action_text = db.Column(db.String(25))
    call_to_action_type = db.Column((db.String(25)), nullable=False)
    sort_index = db.Column(db.Integer, nullable=True, default=1)
    widget_subscribe_id = db.Column(db.Integer, ForeignKey('widget_subscribe.id', ondelete='CASCADE'), nullable=True)

    @classmethod
    def save_subscribe_items(cls, subscribe_items: list) -> None:
        """Update widgets.."""
        db.session.bulk_save_objects(subscribe_items)

