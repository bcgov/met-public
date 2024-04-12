"""Engagement Content translation model class.

Manages the Engagement Content Translations.
"""

from __future__ import annotations
from sqlalchemy import UniqueConstraint
from sqlalchemy.dialects.postgresql import JSON
from sqlalchemy.exc import IntegrityError
from .base_model import BaseModel
from .db import db


class EngagementContentTranslation(BaseModel):
    """Definition of the Engagement Content Translation entity."""

    __tablename__ = 'engagement_content_translation'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    language_id = db.Column(db.Integer, db.ForeignKey('language.id', ondelete='CASCADE'), nullable=False)
    engagement_content_id = db.Column(
        db.Integer, db.ForeignKey('engagement_content.id', ondelete='CASCADE'), nullable=False
    )
    content_title = db.Column(db.String(50), unique=False, nullable=False)
    custom_text_content = db.Column(db.Text, unique=False, nullable=True)
    custom_json_content = db.Column(JSON, unique=False, nullable=True)

    # Add a unique constraint on engagement_content_id and language_id
    # A engagement content has only one version in a particular language
    __table_args__ = (UniqueConstraint('engagement_content_id', 'language_id', name='_engagement_content_language_uc'),)

    @classmethod
    def get_translations_by_content_and_language(cls, engagement_content_id=None, language_id=None):
        """
        Retrieve engagement content translations by content ID and language ID.

        :param engagement_content_id: ID of the engagement content.
        :param language_id: ID of the language.
        :return: List of engagement content translations matching the criteria.
        """
        query = cls.query
        if engagement_content_id is not None:
            query = query.filter(cls.engagement_content_id == engagement_content_id)
        if language_id is not None:
            query = query.filter(cls.language_id == language_id)

        return query.all()

    @classmethod
    def create_engagement_content_translation(cls, data):
        """
        Create a new EngagementContentTranslation record.

        :param data: Dictionary containing the fields for EngagementContentTranslation.
        :return: EngagementContentTranslation instance.
        """
        try:
            new_translation = cls(
                language_id=data['language_id'],
                engagement_content_id=data['engagement_content_id'],
                content_title=data['content_title'],
                custom_text_content=data.get('custom_text_content'),
                custom_json_content=data.get('custom_json_content')
            )
            db.session.add(new_translation)
            db.session.commit()
            return new_translation
        except IntegrityError as e:
            db.session.rollback()
            raise e

    @classmethod
    def update_engagement_content_translation(cls, translation_id, data):
        """
        Update an existing EngagementContentTranslation record.

        :param translation_id: ID of the EngagementContentTranslation to update.
        :param data: Dictionary of fields to update.
        :return: Updated EngagementContentTranslation instance.
        """
        translation = cls.find_by_id(translation_id)
        if translation:
            for key, value in data.items():
                setattr(translation, key, value)
            db.session.commit()
        return translation

    @classmethod
    def delete_engagement_content_translation(cls, translation_id):
        """
        Delete an EngagementContentTranslation record.

        :param translation_id: ID of the EngagementContentTranslation to delete.
        :return: Boolean indicating successful deletion.
        """
        translation = cls.find_by_id(translation_id)
        if translation:
            db.session.delete(translation)
            db.session.commit()
            return True
        return False
