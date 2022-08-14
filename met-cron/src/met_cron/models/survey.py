"""survey model class.

Manages the survey
"""
from sqlalchemy import ForeignKey

from .base_model import BaseModel
from .db import db


class Survey(BaseModel):  # pylint: disable=too-few-public-methods
    """Definition of the Survey entity."""

    __tablename__ = 'survey'

    id = db.Column(db.Integer, primary_key=True, nullable=False)
    source_survey_id = db.Column(db.Integer)
    name = db.Column(db.String(100))
    engagement_id = db.Column(db.Integer, ForeignKey('engagement.id', ondelete='CASCADE'))

    @classmethod
    def find_by_source_id(cls, source_identifier: int):
        """Return model by source_identifier."""
        return cls.query.filter_by(source_survey_id=source_identifier).all()

    @classmethod
    def deactivate_by_source_id(cls, source_identifier: int):
        """Deactivate model by source_identifier."""
        return cls.query.filter_by(source_survey_id=source_identifier).update(
            {Survey.is_active: False})