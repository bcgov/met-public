"""WidgetVideo model class.

Manages the video widget
"""
from __future__ import annotations

from sqlalchemy.sql.schema import ForeignKey

from .base_model import BaseModel
from .db import db


class WidgetVideo(BaseModel):  # pylint: disable=too-few-public-methods, too-many-instance-attributes
    """Definition of the Video entity."""

    __tablename__ = 'widget_video'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    widget_id = db.Column(db.Integer, ForeignKey('widget.id', ondelete='CASCADE'), nullable=True)
    engagement_id = db.Column(db.Integer, ForeignKey('engagement.id', ondelete='CASCADE'), nullable=True)
    video_url = db.Column(db.String(), nullable=False)
    description = db.Column(db.Text())

    @classmethod
    def get_video(cls, widget_id) -> list[WidgetVideo]:
        """Get video."""
        widget_video = db.session.query(WidgetVideo) \
            .filter(WidgetVideo.widget_id == widget_id) \
            .first()
        return widget_video

    @classmethod
    def update_video(cls, widget_id, video_data: dict) -> WidgetVideo:
        """Update video."""
        query = WidgetVideo.query.filter_by(WidgetVideo.widget_id == widget_id)
        widget_video: WidgetVideo = query.first()
        if not widget_video:
            return video_data
        query.update(video_data)
        db.session.commit()
        return widget_video
