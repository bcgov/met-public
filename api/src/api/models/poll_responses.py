"""
PollResponse model class.

Manages the Poll Responses
"""
from __future__ import annotations

from sqlalchemy.sql.expression import false
from sqlalchemy.sql.schema import ForeignKey

from .base_model import BaseModel
from .db import db


class PollResponse(BaseModel):
    """Definition of the PollResponse entity."""

    __tablename__ = 'poll_responses'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    participant_id = db.Column(db.String(255), nullable=False)
    selected_answer_id = db.Column(db.Integer, ForeignKey('poll_answers.id', ondelete='CASCADE'), nullable=False)
    poll_id = db.Column(db.Integer, ForeignKey('widget_polls.id', ondelete='CASCADE'), nullable=False)
    widget_id = db.Column(db.Integer, ForeignKey('widget.id', ondelete='CASCADE'), nullable=False)
    is_deleted = db.Column(db.Boolean, default=False)

    @classmethod
    def get_responses(cls, poll_id) -> list[PollResponse]:
        """Get responses for a poll."""
        return db.session.query(PollResponse).filter(PollResponse.poll_id == poll_id).all()

    @classmethod
    def get_responses_by_participant_id(cls, poll_id, participant_id) -> list[PollResponse]:
        """Get responses for a poll."""
        return db.session.query(PollResponse).filter(PollResponse.poll_id == poll_id,
                                                     PollResponse.participant_id == participant_id,
                                                     PollResponse.is_deleted == false()).all()

    @classmethod
    def update_response(cls, response_id, response_data: dict) -> PollResponse:
        """Update a poll response."""
        response = PollResponse.query.get(response_id)
        if response:
            for key, value in response_data.items():
                setattr(response, key, value)
            response.save()
        return response
