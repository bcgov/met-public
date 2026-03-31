"""WidgetListening model class.

Manages the who is listening widget
"""
from __future__ import annotations

from sqlalchemy.sql.schema import ForeignKey

from .base_model import BaseModel
from .db import db


class WidgetListening(BaseModel):  # pylint: disable=too-few-public-methods, too-many-instance-attributes
    """Definition of the who is listening widget."""

    __tablename__ = 'widget_listening'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    widget_id = db.Column(db.Integer, ForeignKey('widget.id', ondelete='CASCADE'), nullable=True)
    engagement_id = db.Column(db.Integer, ForeignKey('engagement.id', ondelete='CASCADE'), nullable=True)
    description = db.Column(db.Text())

    @classmethod
    def get_listening(cls, widget_id) -> list[WidgetListening]:
        """Get who is listening widget."""
        widget_listening = db.session.query(WidgetListening) \
            .filter(WidgetListening.widget_id == widget_id) \
            .all()
        return widget_listening

    @classmethod
    def update_listening(cls, listening_widget_id, listening_data: dict) -> WidgetListening:
        """Update who is listening widget."""
        widget_listening: WidgetListening = WidgetListening.query.get(listening_widget_id)
        if widget_listening:
            for key, value in listening_data.items():
                setattr(widget_listening, key, value)
            widget_listening.save()
        return widget_listening
