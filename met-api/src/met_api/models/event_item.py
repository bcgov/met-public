"""Widget Documents model class.

Manages the Widget Documents
"""
from __future__ import annotations

from sqlalchemy.sql.schema import ForeignKey

from .base_model import BaseModel
from .db import db


class EventItem(BaseModel):  # pylint: disable=too-few-public-methods, too-many-instance-attributes
    """Event Items table."""

    __tablename__ = 'event_item'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    description = db.Column(db.String(500))
    location_name = db.Column(db.String(50), nullable=True)
    location_address = db.Column(db.String(100), comment='The address of the location', nullable=True)
    start_date = db.Column(db.DateTime)
    end_date = db.Column(db.DateTime)
    url = db.Column(db.String(500))
    url_label = db.Column(db.String(100), comment='Label to show for href links')
    sort_index = db.Column(db.Integer, nullable=True, default=1)
    widget_events_id = db.Column(db.Integer, ForeignKey('widget_events.id', ondelete='CASCADE'), nullable=True)

    @classmethod
    def save_event_items(cls, event_items: list) -> None:
        """Update widgets.."""
        db.session.bulk_save_objects(event_items)
