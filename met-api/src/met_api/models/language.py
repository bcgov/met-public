"""Language model class.

Manages the Language
"""
from __future__ import annotations
from .base_model import BaseModel
from .db import db


class Language(BaseModel):
    """Definition of the Language entity."""

    __tablename__ = 'language'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(50), nullable=False)  # eg. English, French etc
    code = db.Column(db.String(2), nullable=False)  # eg. en, fr etc
    right_to_left = db.Column(db.Boolean, nullable=False, default=False)
