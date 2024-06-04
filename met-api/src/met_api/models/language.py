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
    code = db.Column(db.String(20), nullable=False, unique=True)  # eg. en, fr etc
    right_to_left = db.Column(db.Boolean, nullable=True)

    @staticmethod
    def get_languages():
        """Retrieve all languages."""
        return Language.query.all()

    @staticmethod
    def update_language(language_id, data):
        """Update an existing language."""
        language = Language.query.get(language_id)
        if language:
            for key, value in data.items():
                setattr(language, key, value)
            db.session.commit()
            return language
        return None

    @staticmethod
    def delete_language(language_id):
        """Delete a language."""
        language = Language.query.get(language_id)
        if language:
            db.session.delete(language)
            db.session.commit()
            return True
        return False
