"""Widget model class.

Manages the widget
"""
from __future__ import annotations

from sqlalchemy.sql.schema import ForeignKey

from datetime import datetime

from .db import db


class Widget(db.Model):  # pylint: disable=too-few-public-methods
    """Definition of the Widget entity."""

    __tablename__ = 'widget'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    widget_type_id = db.Column(db.Integer, ForeignKey('widget_type.id', ondelete='SET NULL'))
    engagement_id = db.Column(db.Integer, ForeignKey('engagement.id', ondelete='CASCADE'))
    widget_data_id = db.Column(db.Integer, nullable= False)
    created_date = db.Column(db.DateTime, default=datetime.utcnow, nullable= False)
    updated_date = db.Column(db.DateTime, onupdate=datetime.utcnow, nullable= False)
    created_by = db.Column(db.String(50), nullable= False)
    updated_by = db.Column(db.String(50), nullable= False)


    @classmethod
    def get_widgets_by_engagement_id(cls, engagement_id):
        """Get widgets by engagement_id."""
        return db.session.query(Widget).filter(Widget.engagement_id == engagement_id).order_by(Widget.id.desc()).all()

    @classmethod
    def create_widget(cls, widget) -> Widget:
        """Create widget."""
        new_widget = Widget(
            widget_type_id=widget.get('widget_type_id', None),
            engagement_id=widget.get('engagement_id', None),
            widget_data_id=widget.get('widget_data_id', None),
            created_date=datetime.utcnow(),
            updated_date=datetime.utcnow(),
            created_by=widget.get('created_by', None),
            updated_by=widget.get('updated_by', None),
        )
        db.session.add(new_widget)
        db.session.commit()

        return new_widget

    @staticmethod
    def __create_new_widget_entity(widget):
        """Create new widget entity."""
        return Widget(
            widget_type_id=widget.get('widget_type_id', None),
            engagement_id=widget.get('engagement_id', None),
            widget_data_id=widget.get('widget_data_id', None),
            created_date=datetime.utcnow(),
            updated_date=datetime.utcnow(),
            created_by=widget.get('created_by', None),
            updated_by=widget.get('updated_by', None),
        )

    @classmethod
    def creat_all_widgets(cls, widgets: list) -> list[Widget]:
        """Save widgets."""
        new_widgets = [cls.__create_new_widget_entity(widget) for widget in widgets]
        db.session.add_all(new_widgets)
        db.session.commit()
        return new_widgets
