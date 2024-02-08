"""Timeline Event model class.

Manages the timeline events
"""
from __future__ import annotations

from sqlalchemy.sql.schema import ForeignKey
from met_api.constants.timeline_event_status import TimelineEventStatus

from .base_model import BaseModel
from .db import db


class TimelineEvent(BaseModel):
    """Definition of the TimelineEvent entity."""

    __tablename__ = 'timeline_event'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    engagement_id = db.Column(db.Integer, ForeignKey('engagement.id', ondelete='CASCADE'), nullable=False)
    widget_id = db.Column(db.Integer, ForeignKey('widget.id', ondelete='CASCADE'), nullable=False)
    timeline_id = db.Column(db.Integer, ForeignKey('widget_timeline.id', ondelete='CASCADE'), nullable=False)
    status = db.Column(db.Enum(TimelineEventStatus), nullable=False)
    position = db.Column(db.Integer, nullable=False)
    description = db.Column(db.Text(), nullable=True)
    time = db.Column(db.String(255), nullable=True)

    @classmethod
    def delete_event(cls, timeline_id):
        """Delete timeline."""
        timeline_event = db.session.query(TimelineEvent) \
            .filter(TimelineEvent.timeline_id == timeline_id)
        timeline_event.delete()
        db.session.commit()

    @classmethod
    def get_timeline_events(cls, timeline_id) -> list[TimelineEvent]:
        """Get timeline event."""
        timeline_event = db.session.query(TimelineEvent) \
            .filter(TimelineEvent.timeline_id == timeline_id) \
            .all()
        return timeline_event

    @classmethod
    def update_timeline_event(cls, timeline_id, event_data: dict) -> TimelineEvent:
        """Update timeline event."""
        timeline_event: TimelineEvent = TimelineEvent.query.get(timeline_id)
        if timeline_event:
            for key, value in event_data.items():
                setattr(timeline_event, key, value)
            timeline_event.save()
        return timeline_event
