"""WidgetMap model class.

Manages the map widget
"""
from __future__ import annotations
from datetime import datetime
from sqlalchemy.dialects.postgresql import JSON
from sqlalchemy.sql.schema import ForeignKey
from .base_model import BaseModel
from .db import db
from .default_method_result import DefaultMethodResult


class WidgetMap(BaseModel):  # pylint: disable=too-few-public-methods
    """Definition of the Map entity."""

    __tablename__ = 'map'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    widget_id = db.Column(db.Integer, ForeignKey('widget.id', ondelete='CASCADE'), nullable=True)
    engagement_id = db.Column(db.Integer, ForeignKey('engagement.id', ondelete='CASCADE'), nullable=True)
    title = db.Column(db.String(50))
    latitutde = db.Column(db.Float)
    longitude = db.Column(db.Float)
    shapefile = db.Column(JSON, unique=False, nullable=True)

    @classmethod
    def get_map(cls, widget_id) -> list[WidgetMap]:
        """Get map"""
        return db.session.query(WidgetMap).filter_by(WidgetMap.widget_id == widget_id)

    @classmethod
    def create_map(cls, map_data) -> WidgetMap:
        """Create map."""
        new_map = WidgetMap(
            title=map_data.get('title', None),
            latitude=map_data.get('latitude', None),
            longitude=map_data.get('longitude', None),
            shapefile=map_data.get('shapefile', None),
            created_date=datetime.utcnow(),
            updated_date=datetime.utcnow(),
            created_by=map_data.get('created_by', None),
            updated_by=map_data.get('updated_by', None),
        )
        db.session.add(new_map)
        db.session.commit()

        return new_map

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
