"""WidgetImage model class.

Manages the image widget
"""

from __future__ import annotations

from sqlalchemy.sql.schema import ForeignKey

from .base_model import BaseModel
from .db import db


class WidgetImage(
    BaseModel
):  # pylint: disable=too-few-public-methods, too-many-instance-attributes
    """Definition of the Image entity."""

    __tablename__ = 'widget_image'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    widget_id = db.Column(
        db.Integer, ForeignKey('widget.id', ondelete='CASCADE'), nullable=True
    )
    engagement_id = db.Column(
        db.Integer, ForeignKey('engagement.id', ondelete='CASCADE'), nullable=True
    )
    image_url = db.Column(db.String(255), nullable=False)
    alt_text = db.Column(db.String(255))
    description = db.Column(db.Text())

    @classmethod
    def get_image(cls, widget_id) -> list[WidgetImage]:
        """Get an image by widget_id."""
        return WidgetImage.query.filter(WidgetImage.widget_id == widget_id).all()

    @classmethod
    def update_image(cls, widget_id, widget_data) -> WidgetImage:
        """Update an image by widget_id."""
        image = WidgetImage.get_image(widget_id)[0]
        for key, value in widget_data.items():
            setattr(image, key, value)
        image.save()
        return image
