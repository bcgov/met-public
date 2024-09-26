"""Widget translation model class.

Manages the widget language translation
"""
from __future__ import annotations
from typing import Optional

from sqlalchemy.sql.schema import ForeignKey

from .base_model import BaseModel
from .db import db


class WidgetTranslation(BaseModel):  # pylint: disable=too-few-public-methods
    """Definition of the Widget translation entity."""

    __tablename__ = 'widget_translation'
    __table_args__ = (
        db.UniqueConstraint('widget_id', 'language_id', name='unique_widget_language'),
    )

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    widget_id = db.Column(db.Integer, ForeignKey('widget.id', ondelete='CASCADE'), nullable=False)
    language_id = db.Column(db.Integer, ForeignKey('language.id', ondelete='CASCADE'), nullable=False)
    title = db.Column(db.String(100), comment='Custom title for the widget.')
    map_marker_label = db.Column(db.String(30))
    map_file_name = db.Column(db.Text())
    poll_title = db.Column(db.String(255))
    poll_description = db.Column(db.String(2048))
    video_url = db.Column(db.String(255))
    video_description = db.Column(db.Text())

    @classmethod
    def get_translation_by_widget_id_and_language_id(cls, widget_id=None, language_id=None):
        """Get translation by widget_id and language_id, or by either one."""
        query = WidgetTranslation.query
        if widget_id is not None:
            query = query.filter_by(widget_id=widget_id)
        if language_id is not None:
            query = query.filter_by(language_id=language_id)

        widget_translation_records = query.all()
        return widget_translation_records

    @classmethod
    def create_widget_translation(cls, translation) -> WidgetTranslation:
        """Create widget translation."""
        new_widget_translation = cls.__create_new_widget_translation_entity(translation)
        db.session.add(new_widget_translation)
        db.session.commit()
        return new_widget_translation

    @staticmethod
    def __create_new_widget_translation_entity(translation):
        """Create new widget translation entity."""
        return WidgetTranslation(
            widget_id=translation.get('widget_id'),
            language_id=translation.get('language_id'),
            title=translation.get('title', None),
            map_marker_label=translation.get('map_marker_label', None),
            map_file_name=translation.get('map_file_name', None),
            poll_title=translation.get('poll_title', None),
            poll_description=translation.get('poll_description', None),
            video_url=translation.get('video_url', None),
            video_description=translation.get('video_description', None),
        )

    @classmethod
    def remove_widget_translation(cls, widget_translation_id) -> WidgetTranslation:
        """Remove widget translation from widget."""
        widget_translation = WidgetTranslation.query.filter_by(id=widget_translation_id).delete()
        db.session.commit()
        return widget_translation

    @classmethod
    def update_widget_translation(cls, widget_translation_id, translation: dict) -> Optional[WidgetTranslation]:
        """Update widget translation."""
        query = WidgetTranslation.query.filter_by(id=widget_translation_id)
        widget_translation: WidgetTranslation = query.first()
        if not widget_translation:
            return None
        query.update(translation)
        db.session.commit()
        return widget_translation
