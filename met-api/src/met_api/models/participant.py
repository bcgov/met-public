"""Participant model class.

Manages the participant
"""
from __future__ import annotations
from flask import current_app
from itsdangerous import URLSafeSerializer

from sqlalchemy import Column
from sqlalchemy.ext.declarative import declared_attr

from .base_model import BaseModel
from .db import db


class Participant(BaseModel):  # pylint: disable=too-few-public-methods
    """Definition of the participant entity."""

    __tablename__ = 'participant'

    id = Column(db.Integer, primary_key=True, autoincrement=True)
    email_address = Column(db.String(500), nullable=True)

    @staticmethod
    def _get_secret():
        """Return email secret key for encryption."""
        return current_app.config.get('EMAIL_SECRET_KEY')

    @classmethod
    def encode_email(cls, _email_address):
        """Get a participant with the provided email address."""
        token_serializer = URLSafeSerializer(cls._get_secret())
        tokenized_email = token_serializer.dumps(_email_address.lower())
        return tokenized_email

    @classmethod
    def decode_email(cls, _encrypted_email_address):
        """Get a participant with the provided email address."""
        token_serializer = URLSafeSerializer(cls._get_secret())
        tokenized_email = token_serializer.loads(_encrypted_email_address)
        return tokenized_email

    @classmethod
    def get_by_email(cls, _email_address) -> Participant:
        """Get a participant with the provided email address."""
        return cls.query.filter(Participant.email_address == cls.encode_email(_email_address)).first()  # pylint: disable=W0143

    @classmethod
    def create(cls, participant) -> Participant:
        """Create a participant."""
        email_address = participant.get('email_address', '')
        db_participant = Participant(
            email_address=cls.encode_email(email_address),
        )
        db_participant.save()
        return db_participant
