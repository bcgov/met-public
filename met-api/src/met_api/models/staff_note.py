"""Staff Note model class.

Manages the review/internal notes for a comment
"""
from __future__ import annotations

from sqlalchemy import and_
from sqlalchemy.sql.schema import ForeignKey

from .db import db
from .base_model import BaseModel


class StaffNote(BaseModel):
    """Definition of the Staff Note entity."""

    __tablename__ = 'staff_note'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    note = db.Column(db.Text, unique=False, nullable=True)
    note_type = db.Column(db.String(50), nullable=True)
    survey_id = db.Column(db.Integer, ForeignKey('survey.id', ondelete='CASCADE'), nullable=False)
    submission_id = db.Column(db.Integer, ForeignKey('submission.id', ondelete='SET NULL'), nullable=False)

    @classmethod
    def get_staff_note_by_submission(cls, submission_id):
        """Get staff note by submission id."""
        return db.session.query(StaffNote)\
            .filter(StaffNote.submission_id == submission_id)\
            .all()

    @classmethod
    def get_staff_note_by_type(cls, submission_id, note_type):
        """Get staff note by submission id and note type."""
        return db.session.query(StaffNote)\
            .filter(and_(StaffNote.submission_id == submission_id, StaffNote.note_type == note_type))\
            .all()
