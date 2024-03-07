"""SurveyTranslation model class.

Manages the Survey Translations.
"""

from __future__ import annotations

from sqlalchemy import UniqueConstraint
from sqlalchemy.dialects import postgresql

from .base_model import BaseModel
from .db import db


class SurveyTranslation(BaseModel):
    """Definition of the SurveyTranslation entity."""

    __tablename__ = 'survey_translation'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    survey_id = db.Column(
        db.Integer,
        db.ForeignKey('survey.id', ondelete='CASCADE'),
        nullable=False,
    )
    language_id = db.Column(
        db.Integer, db.ForeignKey('language.id'), nullable=False
    )
    name = db.Column(
        db.String(50), index=True, nullable=True
    )  # pre-populate it with the base Survey content is optional so can be nullable
    form_json = db.Column(
        postgresql.JSONB(astext_type=db.Text()),
        nullable=True,
        server_default='{}',
    )  # pre-populate it with the base Survey content is optional so can be nullable

    # Add a unique constraint on survey_id and language_id
    # A survey has only one version in a particular language
    __table_args__ = (
        UniqueConstraint(
            'survey_id', 'language_id', name='_survey_language_uc'
        ),
    )

    @staticmethod
    def get_survey_translation_by_survey_and_language(
        survey_id=None, language_id=None
    ):
        """Get survey translation by survey_id and language_id, or by either one."""
        query = SurveyTranslation.query
        if survey_id is not None:
            query = query.filter_by(survey_id=survey_id)
        if language_id is not None:
            query = query.filter_by(language_id=language_id)

        survey_translation_records = query.all()
        return survey_translation_records

    @staticmethod
    def create_survey_translation(data):
        """Create a new survey translation."""
        survey_translation = SurveyTranslation(
            survey_id=data['survey_id'],
            language_id=data['language_id'],
            name=data.get(
                'name'
            ),  # Returns `None` if 'name' is not in `data` as its optional
            form_json=data.get(
                'form_json'
            ),  # Returns `None` if 'form_json' is not in `data` as its optional
        )
        survey_translation.save()
        return survey_translation

    @staticmethod
    def update_survey_translation(survey_translation_id, data):
        """Update an existing survey translation."""
        survey_translation = SurveyTranslation.query.get(survey_translation_id)
        if survey_translation:
            for key, value in data.items():
                setattr(survey_translation, key, value)
            db.session.commit()
            return survey_translation
        return None

    @staticmethod
    def delete_survey_translation(survey_translation_id):
        """Delete a survey translation."""
        survey_translation = SurveyTranslation.query.get(survey_translation_id)
        if survey_translation:
            db.session.delete(survey_translation)
            db.session.commit()
            return True
        return False
