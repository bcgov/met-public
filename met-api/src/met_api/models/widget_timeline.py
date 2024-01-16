"""WidgetTimeline model class.

Manages the timeline widget
"""
from __future__ import annotations
from sqlalchemy.sql.schema import ForeignKey
from met_api.models.timeline_event import TimelineEvent
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
