"""Email queue model class.

Manages the Email queue
"""
from __future__ import annotations

from typing import List

from sqlalchemy import null, or_

from met_api.constants.notification_status import NotificationStatus
from .base_model import BaseModel
from .db import db


class EmailQueue(BaseModel):  # pylint: disable=too-few-public-methods
    """Definition of the email queue entity."""

    __tablename__ = 'email_queue'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    entity_id = db.Column(db.Integer, nullable=False)  # id of the entity which triggers notificatio
    entity_type = db.Column(db.String(100),
                            nullable=False)  # type of the entity which triggers email ,like engagement , user
    action = db.Column(db.String(100))  # created , deleted etc
    notification_status = db.Column(db.Enum(NotificationStatus), nullable=True)

    @staticmethod
    def get_unprocessed_mails(max_size: int) -> List[EmailQueue]:
        """Return a list of unprocessed emails."""
        query = EmailQueue.query.filter(
            or_(EmailQueue.notification_status.is_(null()), EmailQueue.notification_status == ''))
        if max_size != 0:
            query = query.limit(max_size)
        return query.all()
