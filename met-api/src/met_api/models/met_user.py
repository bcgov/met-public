"""Staff user model class.

Manages the staff user
"""
from __future__ import annotations
from flask import current_app

from sqlalchemy import Column, String
from sqlalchemy.ext.declarative import declared_attr
from sqlalchemy_utils.types.encrypted.encrypted_type import AesEngine, StringEncryptedType

from .base_model import BaseModel
from .db import db


class MetUser(BaseModel):  # pylint: disable=too-few-public-methods
    """Definition of the Met User entity."""

    __tablename__ = 'met_users'

    id = Column(db.Integer, primary_key=True, autoincrement=True)
    
    @declared_attr
    def email_address(cls):
        """Declare attribute for bank account number."""
        return db.Column('email_address', StringEncryptedType(String, cls._get_secret, AesEngine, 'pkcs5'),
                         nullable=True, index=True)

    @staticmethod
    def _get_secret():
        """Return email secret key for encryption."""
        return current_app.config.get('EMAIL_SECRET_KEY')
        
    @classmethod
    def get_user_by_email(cls, _email_address) -> MetUser:
        """Get a met user with the provided external id."""
        return cls.query.filter(MetUser.email_address == _email_address.lower()).first()

    @classmethod
    def create_user(cls, user) -> MetUser:

        email_address = user.get('email_address', '')
        """Create a met user."""
        user = MetUser(
            email_address=email_address.lower(),
        )
        user.save()

        return user
