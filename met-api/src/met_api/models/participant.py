"""Participant model class.

Manages the participant
"""
from __future__ import annotations
from flask import current_app

from sqlalchemy import Column, String
from sqlalchemy.ext.declarative import declared_attr
from sqlalchemy_utils.types.encrypted.encrypted_type import AesEngine, StringEncryptedType

from .base_model import BaseModel
from .db import db


class Participant(BaseModel):  # pylint: disable=too-few-public-methods
    """Definition of the participant entity."""

    __tablename__ = 'participant'

    id = Column(db.Integer, primary_key=True, autoincrement=True)

    @declared_attr
    def email_address(self):
        """Declare attribute for bank account number."""
        return db.Column('email_address', StringEncryptedType(String, self._get_secret, AesEngine, 'pkcs5'),
                         nullable=True, index=True)

    @staticmethod
    def _get_secret():
        """Return email secret key for encryption."""
        return current_app.config.get('EMAIL_SECRET_KEY')

    @classmethod
    def get_by_email(cls, _email_address) -> Participant:
        """Get a participant with the provided email address."""
        return cls.query.filter(Participant.email_address == _email_address.lower()).first()  # pylint: disable=W0143

    @classmethod
    def create(cls, participant) -> Participant:
        """Create a participant."""
        email_address = participant.get('email_address', '')
        db_participant = Participant(
            email_address=email_address.lower(),
        )
        db_participant.save()
        return db_participant
