"""
WidgetPoll model class.

Manages the Poll widget
"""
from __future__ import annotations

from sqlalchemy import Enum
from sqlalchemy.sql.schema import ForeignKey

from met_api.models.poll_answers import PollAnswer

from .base_model import BaseModel
from .db import db


class Poll(BaseModel):
    """Definition of the Poll entity."""

    __tablename__ = 'widget_polls'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    title = db.Column(db.String(255), nullable=False)
    description = db.Column(db.String(2048), nullable=True)
    status = db.Column(
        Enum('active', 'inactive', name='poll_status'), default='inactive')
    widget_id = db.Column(db.Integer, ForeignKey(
        'widget.id', ondelete='CASCADE'), nullable=False)
    engagement_id = db.Column(db.Integer, ForeignKey(
        'engagement.id', ondelete='CASCADE'), nullable=False)

    # Relationship to timeline_event
    answers = db.relationship(PollAnswer, backref='widget_poll', lazy=True)

    @classmethod
    def create_poll(cls, widget_id: int, poll_data: dict) -> Poll:
        """Create a new poll."""
        poll = cls()
        poll.widget_id = widget_id
        poll.title = poll_data.get('title')
        poll.description = poll_data.get('description')
        poll.status = poll_data.get('status', 'inactive')
        poll.engagement_id = poll_data.get('engagement_id')
        db.session.add(poll)
        db.session.commit()
        return poll

    @classmethod
    def get_polls(cls, widget_id) -> list[Poll]:
        """Get polls for a widget."""
        return db.session.query(Poll).filter(Poll.widget_id == widget_id).all()

    @classmethod
    def update_poll(cls, poll_id, poll_data: dict) -> Poll:
        """Update a poll and its answers."""
        poll: Poll = Poll.query.get(poll_id)
        if poll:
            # Update poll fields
            for key in ['title', 'description', 'status', 'widget_id',
                        'engagement_id']:
                if key in poll_data:
                    setattr(poll, key, poll_data[key])

            db.session.commit()

        return poll
