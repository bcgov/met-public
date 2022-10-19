"""WidgetItem model class.

Manages the widget_item
"""
from __future__ import annotations
from datetime import datetime

from sqlalchemy.sql.schema import ForeignKey


from .db import db


class WidgetItem(db.Model):  # pylint: disable=too-few-public-methods
    """Definition of the WidgetItem entity."""

    __tablename__ = 'widget_item'
    __table_args__ = (
        db.UniqueConstraint('widget_data_id', 'widget_id', name='unique_widget_data'),
    )

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    widget_data_id = db.Column(db.Integer, nullable=False)
    widget_id = db.Column(db.Integer, ForeignKey('widget.id', ondelete='CASCADE'))
    created_date = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_date = db.Column(db.DateTime, onupdate=datetime.utcnow, nullable=False)
    created_by = db.Column(db.String(50), nullable=False)
    updated_by = db.Column(db.String(50), nullable=False)

    @classmethod
    def get_widget_items_by_widget_id(cls, widget_id):
        """Get widgets by widget_id."""
        return db.session.query(WidgetItem).filter(WidgetItem.widget_id ==
                                                   widget_id).order_by(WidgetItem.id.desc()).all()

    @classmethod
    def create_widget_item(cls, widget_item) -> WidgetItem:
        """Create widget_item."""
        new_widget = cls.__create_new_widget_item_entity(widget_item)
        db.session.add(new_widget)
        db.session.commit()
        return new_widget

    @staticmethod
    def __create_new_widget_item_entity(widget_item):
        """Create new widget_item entity."""
        return WidgetItem(
            widget_id=widget_item.get('widget_id', None),
            widget_data_id=widget_item.get('widget_data_id', None),
            created_date=datetime.utcnow(),
            updated_date=datetime.utcnow(),
            created_by=widget_item.get('created_by', None),
            updated_by=widget_item.get('updated_by', None),
        )

    @classmethod
    def creat_all_widget_items(cls, widgets: list) -> list[WidgetItem]:
        """Save widgets."""
        new_widgets = [cls.__create_new_widget_item_entity(widget_item) for widget_item in widgets]
        db.session.add_all(new_widgets)
        db.session.commit()
        return new_widgets
