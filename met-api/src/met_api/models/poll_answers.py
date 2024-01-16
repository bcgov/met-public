"""
PollAnswers model class.

Manages the Poll answers
"""
from __future__ import annotations

from sqlalchemy.sql.schema import ForeignKey
from sqlalchemy import Enum

from .base_model import BaseModel
from .db import db

class PollAnswer(BaseModel):
    """Definition of the PollAnswer entity."""

    __tablename__ = 'poll_answers'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    answer_text = db.Column(db.String(255), nullable=False)
    poll_id = db.Column(db.Integer, ForeignKey('widget_polls.id', ondelete='CASCADE'))

    @classmethod
    def get_answers(cls, poll_id) -> list[PollAnswer]:
        """Get answers for a poll."""
        return db.session.query(PollAnswer).filter(PollAnswer.poll_id == poll_id).all()

    @classmethod
    def update_answer(cls, answer_id, answer_data: dict) -> PollAnswer:
        """Update an answer."""
        answer = PollAnswer.query.get(answer_id)
        if answer:
            for key, value in answer_data.items():
                setattr(answer, key, value)
            answer.save()
        return answer
