"""Survey model class.

Manages the Survey
"""
from datetime import datetime
from .db import db, ma
from sqlalchemy.dialects import postgresql
import uuid 


class Survey(db.Model):  # pylint: disable=too-few-public-methods
    """Definition of the Survey entity."""

    __tablename__ = 'survey'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(50))
    formJSON = db.Column(postgresql.JSON(astext_type=sa.Text()), nullable=False, server_default="{}")
    created_date = db.Column(db.DateTime, default=datetime.utcnow)
    updated_date = db.Column(db.DateTime, onupdate=datetime.utcnow)
    created_by = db.Column(db.String(50))
    updated_by = db.Column(db.String(50))
    
    @classmethod
    def get_survey(cls, survey_id):
        """Get a survey."""
        survey_schema = SurveySchema()
        data = db.session.query(Survey).filter_by(id=survey_id).first()
        return survey_schema.dump(data)

    @classmethod
    def create_survey(cls, survey: SurveySchema) -> DefaultMethodResult:
        """Save Survey."""
        new_survey = Survey(
            name=survey.get('name', None),
            formJSON=survey.get('formJSON', None),
            created_date=survey.get('created_date', None),
            updated_date=survey.get('updated_date', None),
            created_by=survey.get('created_by', None),
            updated_by=survey.get('updated_by', None),
        )
        db.session.add(new_survey)
        db.session.commit()
        return DefaultMethodResult(True, 'Survey Added', new_survey.id)

    @classmethod
    def update_survey(cls, survey: SurveySchema) -> DefaultMethodResult:
        """Update engagement."""
        update_fields = dict(
            name=survey.get('name', None),
            formJSON=survey.get('formJSON', None),
            created_date=survey.get('created_date', None),
            updated_date=survey.get('updated_date', None),
            created_by=survey.get('created_by', None),
            updated_by=survey.get('updated_by', None),
        )
        Survey.query.filter_by(id=survey.get('id', None)).update(update_fields)
        db.session.commit()
        return DefaultMethodResult(True, 'Engagement Updated', survey['id'])

class SurveySchema(ma.Schema):
    """survey schema."""

    class Meta:  # pylint: disable=too-few-public-methods
        """Meta class."""

        fields = ('id', 'name','formJSON', 'created_date', 'updated_date', 'created_by', 'updated_by')
