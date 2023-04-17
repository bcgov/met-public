"""Survey model class.

Manages the Survey
"""

from __future__ import annotations
from datetime import datetime
from sqlalchemy import ForeignKey, and_, asc, desc
from sqlalchemy.dialects import postgresql
from sqlalchemy.sql import text
from met_api.constants.engagement_status import Status
from met_api.models.pagination_options import PaginationOptions
from met_api.models.engagement_status import EngagementStatus
from met_api.models.engagement import Engagement
from met_api.models.survey_exclusion_option import SurveyExclusionOptions
from met_api.schemas.survey import SurveySchema
from .base_model import BaseModel
from .db import db
from .default_method_result import DefaultMethodResult


class Survey(BaseModel):  # pylint: disable=too-few-public-methods
    """Definition of the Survey entity."""

    __tablename__ = 'survey'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(50), index=True)
    form_json = db.Column(postgresql.JSONB(astext_type=db.Text()), nullable=False, server_default='{}')
    engagement_id = db.Column(db.Integer, ForeignKey('engagement.id', ondelete='CASCADE'))
    comments = db.relationship('Comment', backref='survey', cascade='all, delete')
    submissions = db.relationship('Submission', backref='survey', cascade='all, delete')
    # Survey templates might not need tenant id
    tenant_id = db.Column(db.Integer, db.ForeignKey('tenant.id'), nullable=True)
    is_hidden = db.Column(db.Boolean, nullable=False)
    is_template = db.Column(db.Boolean, nullable=False)

    @classmethod
    def get_open(cls, survey_id) -> Survey:
        """Get an open survey."""
        now = datetime.now()
        survey: Survey = db.session.query(Survey).filter_by(id=survey_id) \
            .join(Engagement) \
            .filter_by(status_id=Status.Published.value) \
            .filter(and_(Engagement.start_date <= now, Engagement.end_date >= now)) \
            .join(EngagementStatus) \
            .first()
        return survey

    @classmethod
    def get_surveys_paginated(cls, pagination_options: PaginationOptions,
                              survey_exclusion_options: SurveyExclusionOptions,
                              search_text='', unlinked=False):
        """Get surveys paginated."""
        query = db.session.query(Survey).join(Engagement, isouter=True).join(EngagementStatus, isouter=True)

        if survey_exclusion_options.exclude_hidden:
            query = query.filter(Survey.is_hidden.is_(False))

        if survey_exclusion_options.exclude_template:
            query = query.filter(Survey.is_template.is_(False))

        if unlinked:
            query = query.filter(Survey.engagement_id.is_(None))

        if search_text:
            query = query.filter(Survey.name.ilike('%' + search_text + '%'))

        sort = asc(text(pagination_options.sort_key)) if pagination_options.sort_order == 'asc'\
            else desc(text(pagination_options.sort_key))

        query = query.order_by(sort)

        no_pagination_options = not pagination_options.page or not pagination_options.size
        if no_pagination_options:
            items = query.all()
            return items, len(items)

        page = query.paginate(page=pagination_options.page, per_page=pagination_options.size)

        return page.items, page.total

    @classmethod
    def create_survey(cls, survey: SurveySchema) -> DefaultMethodResult:
        """Save Survey."""
        new_survey = Survey(
            name=survey.get('name', None),
            form_json=survey.get('form_json', None),
            created_date=datetime.utcnow(),
            updated_date=None,
            created_by=survey.get('created_by', None),
            updated_by=survey.get('updated_by', None),
            engagement_id=survey.get('engagement_id', None),
            is_hidden=survey.get('is_hidden', False),
            is_template=survey.get('is_template', False),

        )
        new_survey.save()
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
            updated_date=datetime.utcnow(),
            updated_by=survey.get('updated_by', record.updated_by),
            name=survey.get('name', record.name),
            is_hidden=survey.get('is_hidden', record.is_hidden),
            is_template=survey.get('is_template', record.is_template),
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
