"""WidgetTimeline model class.

Manages the timeline widget
"""
from __future__ import annotations
from typing import Optional
from sqlalchemy.sql.schema import ForeignKey
from met_api.models.timeline_event import TimelineEvent
from met_api.services.timeline_event_service import TimelineEventService
from .base_model import BaseModel
from .db import db

class WidgetTimeline(BaseModel):  # pylint: disable=too-few-public-methods, too-many-instance-attributes
    """Definition of the Timeline entity."""

    __tablename__ = 'widget_timeline'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    engagement_id = db.Column(db.Integer, ForeignKey('engagement.id', ondelete='CASCADE'), nullable=True)
    widget_id = db.Column(db.Integer, ForeignKey('widget.id', ondelete='CASCADE'), nullable=True)
    title = db.Column(db.String(255), nullable=True)
    description = db.Column(db.Text(), nullable=True)

    # Relationship to timeline_event
    events = db.relationship(TimelineEvent, backref='widget_timeline', lazy=True)

    @classmethod
    def get_timeline(cls, timeline_id) -> list[WidgetTimeline]:
        """Get timeline."""
        widget_timeline = db.session.query(WidgetTimeline) \
            .filter(WidgetTimeline.widget_id == timeline_id) \
            .all()
        return widget_timeline

    @classmethod
    def update_timeline(cls, timeline_id, timeline_data: dict) -> Optional[WidgetTimeline or None]:
        """Update timeline."""
        TimelineEvent.delete_event(timeline_id)
        widget_timeline: WidgetTimeline = WidgetTimeline.query.get(timeline_id)
        if widget_timeline:
            widget_timeline.title = timeline_data.get('title')
            widget_timeline.description = timeline_data.get('description')
            for event in timeline_data.get('events', []):
                TimelineEventService.create_timeline_event(timeline_id, event)
            widget_timeline.save()
        return widget_timeline
