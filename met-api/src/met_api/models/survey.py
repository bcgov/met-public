"""Survey model class.

Manages the Survey
"""
from datetime import datetime
from typing import List
from sqlalchemy import ForeignKey
from sqlalchemy.dialects import postgresql
from met_api.constants.status import Status
from met_api.models.engagement_status import EngagementStatus
from met_api.models.engagement import Engagement
from met_api.schemas.survey import SurveySchema
from .default_method_result import DefaultMethodResult
from .db import db


class Survey(db.Model):  # pylint: disable=too-few-public-methods
    """Definition of the Survey entity."""

    __tablename__ = 'survey'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(50), index=True)
    form_json = db.Column(postgresql.JSONB(astext_type=db.Text()), nullable=False, server_default='{}')
    created_date = db.Column(db.DateTime, default=datetime.utcnow)
    updated_date = db.Column(db.DateTime, onupdate=datetime.utcnow)
    created_by = db.Column(db.String(50))
    updated_by = db.Column(db.String(50))
    engagement_id = db.Column(db.Integer, ForeignKey('engagement.id', ondelete='CASCADE'))

    @classmethod
    def get_survey(cls, survey_id) -> SurveySchema:
        """Get a survey."""
        survey_schema = SurveySchema()
        survey = db.session.query(Survey)\
            .outerjoin(Engagement)\
            .outerjoin(EngagementStatus)\
            .filter(Survey.id == survey_id)\
            .first()
        return survey_schema.dump(survey)

    @classmethod
    def get_open_survey(cls, survey_id) -> SurveySchema:
        """Get a survey."""
        survey_schema = SurveySchema()
        survey = db.session.query(Survey).filter_by(id=survey_id)\
            .join(Engagement).filter_by(status_id=Status.Published)\
            .join(EngagementStatus)\
            .first()
        return survey_schema.dump(survey)

    @classmethod
    def get_all_surveys(cls) -> List[SurveySchema]:
        """Get all surveys."""
        survey_schema = SurveySchema(many=True)
        surveys = db.session.query(Survey).join(Engagement, isouter=True).join(EngagementStatus, isouter=True).all()
        return survey_schema.dump(surveys)

    @classmethod
    def get_all_unlinked_surveys(cls) -> List[SurveySchema]:
        """Get all surveys that are unlinked to engagement."""
        survey_schema = SurveySchema(many=True)
        surveys = db.session.query(Survey).filter_by(engagement_id=None).all()
        return survey_schema.dump(surveys)

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
            engagement_id=survey.get('engagement_id', None),

        )
        db.session.add(new_survey)
        db.session.commit()
        return DefaultMethodResult(True, 'Survey Added', new_survey.id)

    @classmethod
    def update_survey(cls, survey: SurveySchema) -> DefaultMethodResult:
        """Update survey."""
        update_fields = dict(
            form_json=survey.get('form_json', None),
            updated_date=survey.get('updated_date', None),
            updated_by=survey.get('updated_by', None),
        )
        survey_id = survey.get('id', None)
        query = Survey.query.filter_by(id=survey_id)
        record = query.first()
        if not record:
            return DefaultMethodResult(False, 'Survey Not Found', survey_id)
        query.update(update_fields)
        db.session.commit()
        return DefaultMethodResult(True, 'Survey Updated', survey_id)

    @classmethod
    def link_survey(cls, survey_id, engagement_id) -> DefaultMethodResult:
        """Link survey to engagement."""
        query = Survey.query.filter_by(id=survey_id)
        survey = query.first()
        if not survey:
            return DefaultMethodResult(False, 'Survey Not Found', survey_id)
        survey.engagement_id = engagement_id
        db.session.commit()
        return DefaultMethodResult(True, 'Survey Updated', survey_id)
