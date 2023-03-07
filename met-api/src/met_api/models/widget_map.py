"""WidgetMap model class.

Manages the map widget
"""
from __future__ import annotations

from sqlalchemy.sql.schema import ForeignKey

from .base_model import BaseModel
from .db import db


class WidgetMap(BaseModel):  # pylint: disable=too-few-public-methods
    """Definition of the Map entity."""

    __tablename__ = 'map'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    widget_id = db.Column(db.Integer, ForeignKey('widget.id', ondelete='CASCADE'), nullable=True)
    engagement_id = db.Column(db.Integer, ForeignKey('engagement.id', ondelete='CASCADE'), nullable=True)
    description = db.Column(db.String(500))
    latitutde = db.Column(db.Float, nullable=False)
    longitude = db.Column(db.Float, nullable=False)

    @classmethod
    def get_map(cls, widget_id) -> list[WidgetMap]:
        """Get map."""
        return db.session.query(WidgetMap).filter_by(WidgetMap.widget_id == widget_id)

    @classmethod
    def update_map(cls, widget_id, map_data: dict) -> WidgetMap:
        """Update map."""
        query = WidgetMap.query.filter_by(WidgetMap.widget_id == widget_id)
        widget_map: WidgetMap = query.first()
        if not widget_map:
            return map_data
        query.update(map_data)
        db.session.commit()
        return widget_map
