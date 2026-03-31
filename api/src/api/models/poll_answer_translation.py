"""
PollAnswers translation model class.

Manages the translation of Poll answers
"""

from __future__ import annotations

from sqlalchemy.sql.schema import ForeignKey
from sqlalchemy import UniqueConstraint
from .base_model import BaseModel
from .db import db


class PollAnswerTranslation(BaseModel):
    """Definition of the PollAnswerTranslation entity."""

    __tablename__ = 'poll_answer_translation'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    poll_answer_id = db.Column(
        db.Integer,
        ForeignKey('poll_answers.id', ondelete='CASCADE'),
        nullable=False,
    )
    language_id = db.Column(
        db.Integer, ForeignKey('language.id'), nullable=False
    )
    answer_text = db.Column(db.String(255), nullable=False)

    # A poll answer has only one version in a particular language
    __table_args__ = (
        UniqueConstraint(
            'poll_answer_id', 'language_id', name='_poll_answer_language_uc'
        ),
    )

    @staticmethod
    def get_by_answer_and_language(
        poll_answer_id=None, language_id=None
    ):
        """
        Get poll answer translation by answer ID and language ID.

        :param poll_answer_id (int): ID of the poll answer
        :param language_id (int): ID of the language
        :return: list: List of PollAnswerTranslation objects
        """
        query = PollAnswerTranslation.query
        if poll_answer_id is not None:
            query = query.filter_by(poll_answer_id=poll_answer_id)
        if language_id is not None:
            query = query.filter_by(language_id=language_id)

        poll_answer_translation_records = query.all()
        return poll_answer_translation_records

    @classmethod
    def create_poll_answer_translation(cls, data):
        """
        Insert a new PollAnswerTranslation record.

        :param data: Dictionary containing the fields for PollAnswerTranslation
        :return: PollAnswerTranslation instance
        """
        poll_answer_translation = PollAnswerTranslation(
            poll_answer_id=data['poll_answer_id'],
            language_id=data['language_id'],
            answer_text=data.get(
                'answer_text'
            ),  # Returns `None` if 'answer_text' is not in `data` as its optional
        )

        poll_answer_translation.save()
        return poll_answer_translation

    @classmethod
    def update_poll_answer_translation(cls, translation_id, data):
        """
        Update an existing PollAnswerTranslation record.

        :param translation_id: ID of the PollAnswerTranslation to update
        :param data: Dictionary of fields to update
        :return: Updated PollAnswerTranslation instance
        """
        poll_answer_translation = cls.find_by_id(translation_id)
        if poll_answer_translation:
            for key, value in data.items():
                setattr(poll_answer_translation, key, value)
            poll_answer_translation.save()
        return poll_answer_translation

    @classmethod
    def delete_poll_answer_translation(cls, translation_id):
        """
        Delete a PollAnswerTranslation record.

        :param translation_id: ID of the PollAnswerTranslation to delete
        :return: None
        """
        poll_answer_translation = cls.find_by_id(translation_id)
        if poll_answer_translation:
            poll_answer_translation.delete()
            return True
        return False
