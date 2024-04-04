"""WidgetMap model class.

Manages the map widget
"""
from __future__ import annotations

from sqlalchemy.sql.schema import ForeignKey

from .base_model import BaseModel
from .db import db


class WidgetMap(BaseModel):  # pylint: disable=too-few-public-methods, too-many-instance-attributes
    """Definition of the Map entity."""

    __tablename__ = 'widget_map'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    widget_id = db.Column(db.Integer, ForeignKey('widget.id', ondelete='CASCADE'), nullable=True)
    engagement_id = db.Column(db.Integer, ForeignKey('engagement.id', ondelete='CASCADE'), nullable=True)
    marker_label = db.Column(db.String(30))
    latitude = db.Column(db.Float, nullable=False)
    longitude = db.Column(db.Float, nullable=False)
    geojson = db.Column(db.Text())
    file_name = db.Column(db.Text())

    @classmethod
    def get_map(cls, widget_id) -> list[WidgetMap]:
        """Get map."""
        widget_map = db.session.query(WidgetMap) \
            .filter(WidgetMap.widget_id == widget_id) \
            .all()
        return widget_map

    @classmethod
    def update_map(cls, widget_id, map_data: dict) -> WidgetMap:
        """Update map."""
        query = WidgetMap.query.filter_by(widget_id=widget_id)
        widget_map: WidgetMap = query.first()
        if not widget_map:
            return map_data
        query.update(map_data)
        db.session.commit()
        return widget_map
