"""Survey model class.

Manages the Survey
"""
from datetime import datetime
from met_api.models.engagement import Engagement
from met_api.schemas.survey import SurveySchema
from sqlalchemy import ForeignKey
from sqlalchemy.dialects import postgresql
from sqlalchemy.dialects.postgresql import UUID
from .default_method_result import DefaultMethodResult
from .db import db, ma


class Survey(db.Model):  # pylint: disable=too-few-public-methods
    """Definition of the Survey entity."""

    __tablename__ = 'survey'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(50))
    form_json = db.Column(postgresql.JSON(astext_type=db.Text()), nullable=False, server_default='{}')
    engagement_id = db.Column(db.Integer, ForeignKey('engagement.id', ondelete='CASCADE'))
    created_date = db.Column(db.DateTime, default=datetime.utcnow)
    updated_date = db.Column(db.DateTime, onupdate=datetime.utcnow)
    created_by = db.Column(db.String(50))
    updated_by = db.Column(db.String(50))

    @classmethod
    def get_survey(cls, survey_id):
        """Get a survey."""
        survey_schema = SurveySchema()
        data = db.session.query(Survey).join(Engagement, isouter=True).filter_by(id=survey_id).first()
        return survey_schema.dump(data)

    @classmethod
    def get_all_surveys(cls):
        """Get all engagements."""
        survey_schema = SurveySchema(many=True)
        data = db.session.query(Survey).join(Engagement, isouter=True).all()
        return survey_schema.dump(data)

    @classmethod
    def create_survey(cls, survey: SurveySchema) -> DefaultMethodResult:
        """Save Survey."""
        new_survey = Survey(
            name=survey.get('name', None),
            form_json=survey.get('form_json', None),
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
            form_json=survey.get('form_json', None),
            created_date=survey.get('created_date', None),
            updated_date=survey.get('updated_date', None),
            created_by=survey.get('created_by', None),
            updated_by=survey.get('updated_by', None),
        )
        Survey.query.filter_by(id=survey.get('id', None)).update(update_fields)
        db.session.commit()
        return DefaultMethodResult(True, 'Survey Updated', survey['id'])
