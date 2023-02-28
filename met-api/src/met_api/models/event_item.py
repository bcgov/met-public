"""Widget Documents model class.

Manages the Widget Documents
"""
from __future__ import annotations

from sqlalchemy.sql.schema import ForeignKey
from datetime import datetime
from .base_model import BaseModel
from .db import db
from .default_method_result import DefaultMethodResult
from typing import Optional


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
        
    
    @classmethod
    def update_event_item(cls, event_data: dict) -> Optional[EventItem or DefaultMethodResult]:
        """Update Event Item."""
        event_id = event_data.get('widget_events_id', None)
        query = EventItem.query.filter_by(id=event_id)
        event: EventItem = query.first()
        if not event:
            return DefaultMethodResult(False, 'Event Not Found', event_id)
        event_data['updated_date'] = datetime.utcnow()
        query.update(event_data)
        db.session.commit()
        return event
    
    @classmethod
    def delete_event_item(cls, event_id: dict) -> Optional[EventItem or DefaultMethodResult]:
        """Delete Event Item."""
        query = EventItem.query.filter_by(id=event_id)
        event: EventItem = query.first()
        if not event:
            return DefaultMethodResult(False, 'Event Not Found', event_id)
        query.delete()
        db.session.commit()
        return event
