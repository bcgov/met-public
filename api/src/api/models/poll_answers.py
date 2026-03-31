"""
PollAnswers model class.

Manages the Poll answers
"""
from __future__ import annotations

from sqlalchemy.sql.schema import ForeignKey

from .base_model import BaseModel
from .db import db


class PollAnswer(BaseModel):
    """Definition of the PollAnswer entity."""

    __tablename__ = 'poll_answers'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    answer_text = db.Column(db.String(255), nullable=False)
    poll_id = db.Column(db.Integer, ForeignKey('widget_polls.id',
                                               ondelete='CASCADE'), nullable=False)

    @classmethod
    def get_answers(cls, poll_id) -> list[PollAnswer]:
        """Get answers for a poll."""
        session = db.session.query(PollAnswer)
        return session.filter(PollAnswer.poll_id == poll_id).all()

    @classmethod
    def update_answer(cls, answer_id, answer_data: dict) -> PollAnswer:
        """Update an answer."""
        answer = PollAnswer.query.get(answer_id)
        if answer:
            for key, value in answer_data.items():
                setattr(answer, key, value)
            answer.save()
        return answer

    @classmethod
    def delete_answers_by_poll_id(cls, poll_id):
        """Delete answers."""
        poll_answers = db.session.query(PollAnswer).filter(
            PollAnswer.poll_id == poll_id
        )
        poll_answers.delete()
        db.session.commit()

    @classmethod
    def bulk_insert_answers(cls, poll_id, answers):
        """Bulk insert answers for a poll."""
        answer_data = [
            {'poll_id': poll_id, 'answer_text': answer['answer_text']}
            for answer in answers
        ]
        db.session.bulk_insert_mappings(PollAnswer, answer_data)
        db.session.commit()
