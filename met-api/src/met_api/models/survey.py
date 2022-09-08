"""Survey model class.

Manages the Survey
"""
from datetime import datetime
from typing import List
from sqlalchemy import ForeignKey, and_, desc, asc
from sqlalchemy.dialects import postgresql
from sqlalchemy.sql import text
from met_api.constants.engagement_status import Status
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
    comments = db.relationship('Comment', backref='survey', cascade='all, delete')
    submissions = db.relationship('Submission', backref='survey', cascade='all, delete')

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
    def get_open(cls, survey_id) -> SurveySchema:
        """Get an open survey."""
        now = datetime.now()
        survey_schema = SurveySchema()
        survey = db.session.query(Survey).filter_by(id=survey_id)\
            .join(Engagement)\
            .filter_by(status_id=Status.Published.value)\
            .filter(and_(Engagement.start_date <= now, Engagement.end_date >= now))\
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
    def get_surveys_paginated(cls, page=1, size=10, sort_key='name', sort_order='asc', search_text='', unlinked=False):
        """Get surveys paginated."""
        query = db.session.query(Survey).join(Engagement, isouter=True).join(EngagementStatus, isouter=True)

        if unlinked:
            query = query.filter(Survey.engagement_id is None)

        if search_text:
            query = query.filter(Survey.name.like('%' + search_text + '%'))

        sort = asc(text(sort_key)) if sort_order == "asc" else desc(text(sort_key))
        return query.order_by(sort).paginate(page=page, per_page=size)

    @classmethod
    def create_survey(cls, survey: SurveySchema) -> DefaultMethodResult:
        """Save Survey."""
        new_survey = Survey(
            name=survey.get('name', None),
            form_json=survey.get('form_json', None),
            created_date=datetime.now(),
            updated_date=datetime.now(),
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
        survey_id = survey.get('id', None)
        query = Survey.query.filter_by(id=survey_id)
        record = query.first()
        if not record:
            return DefaultMethodResult(False, 'Survey Not Found', survey_id)
        update_fields = dict(
            form_json=survey.get('form_json', record.form_json),
            updated_date=datetime.now(),
            updated_by=survey.get('updated_by', record.updated_by),
            name=survey.get('name', record.name),
        )
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
        return DefaultMethodResult(True, 'Survey Linked', survey_id)

    @classmethod
    def unlink_survey(cls, survey_id) -> DefaultMethodResult:
        """Unlink survey from engagement."""
        query = Survey.query.filter_by(id=survey_id)
        survey = query.first()
        if not survey:
            return DefaultMethodResult(False, 'Survey to unlink was not found', survey_id)
        survey.engagement_id = None
        db.session.commit()
        return DefaultMethodResult(True, 'Survey Unlinked', survey_id)
