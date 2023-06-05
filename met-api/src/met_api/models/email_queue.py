"""Email queue model class.

Manages the Email queue
"""
from __future__ import annotations

from .base_model import BaseModel
from .db import db


class EmailQueue(BaseModel):  # pylint: disable=too-few-public-methods
    """Definition of the email queue entity."""

    __tablename__ = 'email_queue'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    entity_id = db.Column(db.Integer, nullable=False)  # id of the entity which triggers email
    entity_type = db.Column(db.String(100),
                            nullable=False)  # type of the entity which triggers email ,like engagement , user
    action = db.Column(db.String(100))  # created , deleted etc
    notification_status = db.Column(db.String(50))
