"""Email queue model class.

Manages the Email queue
"""
from __future__ import annotations
from datetime import datetime
from sqlalchemy import ForeignKey

from met_api.schemas.email_queue import EmailQueueSchema

from .base_model import BaseModel
from .db import db


class EmailQueue(BaseModel):  # pylint: disable=too-few-public-methods
    """Definition of the email queue entity."""

    __tablename__ = 'email_queue'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    source_id = db.Column(db.Integer, nullable=False)
    source_type = db.Column(db.String(100), nullable=False)
    event_type = db.Column(db.String(100))
    status = db.Column(db.String(50), nullable=False)
    email_date = db.Column(db.DateTime, nullable=True)

    @classmethod
    def create(cls, email_queue: EmailQueueSchema, session=None) -> EmailQueue:
        """Create a email notification."""
        new_email_queue = EmailQueue(
            source_id=email_queue.get('source_id', None),
            source_type=email_queue.get('source_type', None),
            event_type=email_queue.get('event_type', None),
            status='Pending',
            created_date=datetime.utcnow(),
            created_by=email_queue.get('created_by', None),
        )
        db.session.add(new_email_queue)
        if session is None:
            db.session.commit()
        else:
            session.flush()
        return new_email_queue
