"""Participant model class.

Manages the participant
"""
from __future__ import annotations
from flask import current_app
from itsdangerous import URLSafeSerializer

from sqlalchemy import Column, String
from sqlalchemy.ext.declarative import declared_attr

from .base_model import BaseModel
from .db import db


class Participant(BaseModel):  # pylint: disable=too-few-public-methods
    """Definition of the participant entity."""

    __tablename__ = 'participant'

    id = Column(db.Integer, primary_key=True, autoincrement=True)

    @staticmethod
    def _get_secret():
        """Return email secret key for encryption."""
        return current_app.config.get('EMAIL_SECRET_KEY')
    
    @declared_attr
    def email_address(self):
        """Declare attribute for bank account number."""
        return Column(db.String(500), nullable=True)

    @classmethod
    def get_by_email(cls, _email_address) -> Participant:
        """Get a participant with the provided email address."""
        token_serializer = URLSafeSerializer(cls._get_secret())
        tokenized_email = token_serializer.dumps(_email_address.lower())
        return cls.query.filter(Participant.email_address == tokenized_email).first()  # pylint: disable=W0143

    @classmethod
    def create(cls, participant) -> Participant:
        """Create a participant."""
        token_serializer = URLSafeSerializer(cls._get_secret())
        email_address = participant.get('email_address', '')
        tokenized_email = token_serializer.dumps(email_address.lower())
        db_participant = Participant(
            email_address=tokenized_email,
        )
        db_participant.save()
        return db_participant
