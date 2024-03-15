"""Subscribe Item Translatiion model class.

Manages the translation for Subscribe items
"""

from __future__ import annotations
from sqlalchemy.sql.schema import ForeignKey
from sqlalchemy import UniqueConstraint
from .base_model import BaseModel
from .db import db


class SubscribeItemTranslation(BaseModel):
    """Subscribe Item Translation table."""

    __tablename__ = 'subscribe_item_translation'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    language_id = db.Column(
        db.Integer, ForeignKey('language.id'), nullable=False
    )
    subscribe_item_id = db.Column(
        db.Integer,
        ForeignKey('subscribe_item.id', ondelete='CASCADE'),
        nullable=False,
    )
    description = db.Column(db.String(500))
    rich_description = db.Column(db.Text)
    call_to_action_text = db.Column(db.String(25))

    # A Subscribe item has only one version in a particular language
    __table_args__ = (
        UniqueConstraint(
            'subscribe_item_id',
            'language_id',
            name='_subscribe_item_language_uc',
        ),
    )

    @staticmethod
    def get_by_item_and_language(
        subscribe_item_id=None, language_id=None
    ):
        """
        Get subscribe item translation by item ID and language ID.

        :param data:
            subscribe_item_id (int): ID of the subscribe item
            language_id (int): ID of the language

        :return:
            list: List of SubscribeItemTranslation objects
        """
        query = SubscribeItemTranslation.query
        if subscribe_item_id is not None:
            query = query.filter_by(subscribe_item_id=subscribe_item_id)
        if language_id is not None:
            query = query.filter_by(language_id=language_id)

        subscribe_item_translation_records = query.all()
        return subscribe_item_translation_records

    @classmethod
    def create_sub_item_translation(cls, data):
        """
        Insert a new SubscribeItemTranslation record.

        :param data: Dictionary containing the fields for SubscribeItemTranslation
        :return: SubscribeItemTranslation instance
        """
        subscribe_item_translation = SubscribeItemTranslation(
            subscribe_item_id=data['subscribe_item_id'],
            language_id=data['language_id'],
            description=data.get(
                'description'
            ),
            rich_description=data.get(
                'rich_description'
            ),
            call_to_action_text=data.get(
                'call_to_action_text'
            )
        )
        subscribe_item_translation.save()
        return subscribe_item_translation

    @classmethod
    def update_sub_item_translation(cls, translation_id, data):
        """
        Update an existing SubscribeItemTranslation record.

        :param translation_id: ID of the SubscribeItemTranslation to update
        :param data: Dictionary of fields to update
        :return: Updated SubscribeItemTranslation instance
        """
        subscribe_item_translation = cls.find_by_id(translation_id)
        if subscribe_item_translation:
            for key, value in data.items():
                setattr(subscribe_item_translation, key, value)
            subscribe_item_translation.save()
        return subscribe_item_translation

    @classmethod
    def delete_sub_item_translation(cls, translation_id):
        """
        Delete a SubscribeItemTranslation record.

        :param translation_id: ID of the SubscribeItemTranslation to delete
        :return: None
        """
        subscribe_item_translation = cls.find_by_id(translation_id)
        if subscribe_item_translation:
            subscribe_item_translation.delete()
            return True
        return False
