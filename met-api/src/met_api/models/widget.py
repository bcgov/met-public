"""Widget model class.

Manages the widget
"""
from __future__ import annotations

from sqlalchemy.sql.schema import ForeignKey

from .db import db


class Widget(db.Model):  # pylint: disable=too-few-public-methods
    """Definition of the Widget entity."""

    __tablename__ = 'widget'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    widget_type_id = db.Column(db.Integer, ForeignKey('widget_type.id', ondelete='SET NULL'))
    engagement_id = db.Column(db.Integer, ForeignKey('engagement.id', ondelete='CASCADE'))
    widget_data_id = db.Column(db.Integer, ForeignKey('widget_data.id', ondelete='SET NULL'))

    @classmethod
    def get_widgets_by_engagement_id(cls, engagement_id):
        """Get widgets by engagement_id."""
        return db.session.query(Widget).filter(Widget.engagement_id == engagement_id).order_by(Widget.id.desc()).all()
