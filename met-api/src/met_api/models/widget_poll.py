"""
WidgetPoll model class.

Manages the Poll widget
"""
from __future__ import annotations

from sqlalchemy.sql.schema import ForeignKey
from sqlalchemy import Enum

from .base_model import BaseModel
from .db import db



class Poll(BaseModel):
    """Definition of the Poll entity."""

    __tablename__ = 'widget_polls'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    title = db.Column(db.String(255), nullable=False)
    description = db.Column(db.String(2048), nullable=True)
    status = db.Column(Enum('active', 'inactive', name='poll_status'), default='inactive')
    widget_id = db.Column(db.Integer, ForeignKey('widget.id', ondelete='CASCADE'))
    engagement_id = db.Column(db.Integer, ForeignKey('engagement.id', ondelete='CASCADE'), nullable=True)

    @classmethod
    def get_polls(cls, widget_id) -> list[Poll]:
        """Get polls for a widget."""
        return db.session.query(Poll).filter(Poll.widget_id == widget_id).all()

    @classmethod
    def update_poll(cls, poll_id, poll_data: dict) -> Poll:
        """Update a poll."""
        poll = Poll.query.get(poll_id)
        if poll:
            for key, value in poll_data.items():
                setattr(poll, key, value)
            poll.save()
        return poll
