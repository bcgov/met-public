"""Widget Documents model class.

Manages the Widget Events
"""
from __future__ import annotations

from typing import List

from sqlalchemy.sql.schema import ForeignKey

from .base_model import BaseModel
from .db import db
from ..constants.event_types import EventTypes


class WidgetEvents(BaseModel):  # pylint: disable=too-few-public-methods
    """Widget Events table."""

    __tablename__ = 'widget_events'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    title = db.Column(db.String(50))
    type = db.Column(db.Enum(EventTypes), nullable=False)
    sort_index = db.Column(db.Integer, nullable=True, default=1)
    widget_id = db.Column(db.Integer, ForeignKey('widget.id', ondelete='CASCADE'), nullable=True)
    event_items = db.relationship('EventItem', cascade='all,delete,delete-orphan')

    @classmethod
    def get_all_by_widget_id(cls, widget_id) -> List[WidgetEvents]:
        """Get widget events by widget id."""
        widget_events = db.session.query(WidgetEvents) \
            .filter(WidgetEvents.widget_id == widget_id) \
            .order_by(WidgetEvents.sort_index.asc()) \
            .all()
        return widget_events

    @classmethod
    def update_widget_events_bulk(cls, update_mappings: list) -> list[WidgetEvents]:
        """Save widget events sorting."""
        db.session.bulk_update_mappings(WidgetEvents, update_mappings)
        db.session.commit()
        return update_mappings
