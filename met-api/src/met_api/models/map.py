"""Map model class.

Manages the map widget
"""
from __future__ import annotations
from datetime import datetime
from sqlalchemy.dialects.postgresql import JSON
from .base_model import BaseModel
from .db import db
from .default_method_result import DefaultMethodResult


class Map(BaseModel):  # pylint: disable=too-few-public-methods
    """Definition of the Map entity."""

    __tablename__ = 'map'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    title = db.Column(db.String(50))
    latitutde = db.Column(db.Integer)
    longitude = db.Column(db.Integer)
    shapefile = db.Column(JSON, unique=False, nullable=True)

    @classmethod
    def get_map(cls, map_id) -> list[Map]:
        """Get map"""
        return db.session.query(Map).filter_by(id=map_id).all()

    @classmethod
    def create_map(cls, map) -> Map:
        """Create map."""
        new_map = Map(
            title=map.get('title', None),
            latitude=map.get('latitude', None),
            longitude=map.get('longitude', None),
            shapefile=map.get('shapefile', None),
            created_date=datetime.utcnow(),
            updated_date=datetime.utcnow(),
            created_by=map.get('created_by', None),
            updated_by=map.get('updated_by', None),
        )
        db.session.add(new_map)
        db.session.commit()

        return new_map

    @classmethod
    def update_map(cls, map_data: dict) -> Optional[Map or DefaultMethodResult]:
        """Update map."""
        map_id = map_data.get('id', None)
        query = Map.query.filter_by(id=map_id)
        map: Map = query.first()
        if not map:
            return DefaultMethodResult(False, 'Map Not Found', map_id)
        map_data['updated_date'] = datetime.utcnow()
        query.update(map_data)
        db.session.commit()
        return map
