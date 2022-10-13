"""Widget type model class.

Manages the widget type status
"""
from .db import db


class WidgetType(db.Model):  # pylint: disable=too-few-public-methods
    """Definition of the Widget Type entity."""

    __tablename__ = 'widget_type'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), unique=True, nullable=False)
    description = db.Column(db.String(200))
    widget = db.relationship('Widget', backref='widget_type', cascade='all, delete')

    @classmethod
    def get_widget_types(cls):
        """Get all widget types."""
        return db.session.query(WidgetType).all()
