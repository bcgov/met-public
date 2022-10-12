"""Contact model class.

Manages the contact
"""
from __future__ import annotations

from datetime import datetime

from .db import db


class Contact(db.Model):  # pylint: disable=too-few-public-methods
    """Definition of the Contact entity."""

    __tablename__ = 'contact'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(50))
    role = db.Column(db.String(50))
    email = db.Column(db.String(50))
    phone_number = db.Column(db.String(50), nullable=True)
    address = db.Column(db.String(50))
    bio = db.Column(db.String(50))
    created_date = db.Column(db.DateTime, default=datetime.utcnow)
    updated_date = db.Column(db.DateTime, onupdate=datetime.utcnow)
