"""engagement model class.

Manages the engagement
"""
from datetime import datetime
from sqlalchemy.sql.expression import true


from .base_model import BaseModel
from .db import db


class Engagement(BaseModel):  # pylint: disable=too-few-public-methods
    """Definition of the Engagement entity."""

    __tablename__ = 'engagement'

    id = db.Column(db.Integer, primary_key=True, nullable=False)
    source_engagement_id = db.Column(db.Integer)
    name = db.Column(db.String(100))
    start_date = db.Column(db.DateTime, default=datetime.utcnow)
    end_date = db.Column(db.DateTime, onupdate=datetime.utcnow)
    published_date = db.Column(db.DateTime, onupdate=datetime.utcnow)
    latitude = db.Column(db.Float)
    longitude = db.Column(db.Float)
    geojson = db.Column(db.Text())
    marker_label = db.Column(db.String(30))

    @classmethod
    def find_by_source_id(cls, source_identifier: int):
        """Return model by source_identifier."""
        return cls.query.filter_by(source_engagement_id=source_identifier).all()

    @classmethod
    def deactivate_by_source_id(cls, source_identifier: int):
        """Deactivate model by source_identifier."""
        return cls.query.filter_by(source_engagement_id=source_identifier).update(
            {Engagement.is_active: False})
    
    @classmethod
    def get_engagement_map_data(
        cls,
        engagement_id
    ):
        """Get active engagement record for an engagement id."""
        map_data = (db.session.query(Engagement.geojson, Engagement.latitude,
                                     Engagement.longitude, Engagement.marker_label)
                      .filter(Engagement.source_engagement_id == engagement_id)
                      .filter(Engagement.is_active == true()))

        return map_data.first()
