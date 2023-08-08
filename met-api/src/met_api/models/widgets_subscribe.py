"""Widget Subscribe model class.

Manages the Widget Subscribe
"""
from __future__ import annotations

from typing import List

from sqlalchemy.sql.schema import ForeignKey

from .base_model import BaseModel
from .db import db
from ..constants.subscribe_types import SubscribeTypes


class WidgetSubscribe(BaseModel):  # pylint: disable=too-few-public-methods
    """Widget Subscribe table."""

    __tablename__ = 'widget_subscribe'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    type = db.Column(db.Enum(SubscribeTypes), nullable=False)
    sort_index = db.Column(db.Integer, nullable=True, default=1)
    widget_id = db.Column(db.Integer, ForeignKey(
        'widget.id', ondelete='CASCADE'), nullable=True)
    subscribe_items = db.relationship(
        'SubscribeItem', backref='widget_subscribe', cascade='all,delete,delete-orphan')

    @classmethod
    def get_all_by_widget_id(cls, widget_id) -> List[WidgetSubscribe]:
        """Get widget subscribe by widget id."""
        widget_subscribe_forms = db.session.query(WidgetSubscribe) \
            .filter(WidgetSubscribe.widget_id == widget_id) \
            .order_by(WidgetSubscribe.sort_index.asc()) \
            .all()
        return widget_subscribe_forms

    @classmethod
    def get_all_by_type(cls, type_, widget_id):
        """Get widget subscribe by type."""
        return db.session.query(cls).filter_by(type=type_, widget_id=widget_id).all()

    @classmethod
    def update_widget_subscribes_bulk(cls, update_mappings: list) -> list[WidgetSubscribe]:
        """Save widget subscribe sorting."""
        db.session.bulk_update_mappings(WidgetSubscribe, update_mappings)
        db.session.commit()
        return update_mappings
