"""Engagement model class.

Manages the engagement
"""
from datetime import datetime
from typing import List
from sqlalchemy.dialects.postgresql import JSON
from sqlalchemy.sql.schema import ForeignKey
from sqlalchemy.sql import text
from sqlalchemy import desc, asc
from met_api.constants.engagement_status import Status
from met_api.constants.user import SYSTEM_USER
from met_api.schemas.engagement import EngagementSchema
from met_api.utils.datetime import local_datetime
from .db import db
from .default_method_result import DefaultMethodResult
from .engagement_status import EngagementStatus


class Engagement(db.Model):
    """Definition of the Engagement entity."""

    __tablename__ = 'engagement'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(50))
    description = db.Column(db.Text, unique=False, nullable=False)
    rich_description = db.Column(JSON, unique=False, nullable=False)
    start_date = db.Column(db.DateTime)
    end_date = db.Column(db.DateTime)
    status_id = db.Column(db.Integer, ForeignKey('engagement_status.id', ondelete='CASCADE'))
    created_date = db.Column(db.DateTime, default=datetime.utcnow())
    created_by = db.Column(db.String(50), nullable=False)
    updated_date = db.Column(db.DateTime, onupdate=datetime.utcnow())
    updated_by = db.Column(db.String(50), nullable=False)
    published_date = db.Column(db.DateTime, nullable=True)
    content = db.Column(db.Text, unique=False, nullable=False)
    rich_content = db.Column(JSON, unique=False, nullable=False)
    banner_filename = db.Column(db.String(), unique=False, nullable=True)
    surveys = db.relationship('Survey', backref='engagement', cascade='all, delete')

    @classmethod
    def get_engagement(cls, engagement_id) -> EngagementSchema:
        """Get an engagement."""
        engagement_schema = EngagementSchema()
        data = db.session.query(Engagement).filter_by(id=engagement_id).first()
        return engagement_schema.dump(data)

    @classmethod
    def get_all_engagements(cls):
        """Get all engagements."""
        engagements_schema = EngagementSchema(many=True)
        data = db.session.query(Engagement).join(EngagementStatus).order_by(Engagement.id.asc()).all()
        return engagements_schema.dump(data)

    @classmethod
    def get_engagements_paginated(cls, page=1, size=10, sort_key='name', sort_order='asc', search_text='', statuses=None):
        """Get engagements paginated."""
        query = db.session.query(Engagement).join(EngagementStatus)

        if statuses:
            query = query.filter(Engagement.status_id.in_(statuses))

        if search_text:
            query = query.filter(Engagement.name.like('%' + search_text + '%'))

        sort = asc(text(sort_key)) if sort_order == "asc" else desc(text(sort_key))
        return query.order_by(sort).paginate(page=page, per_page=size)

    @classmethod
    def get_engagements_by_status(cls, status_id):
        """Get all engagements by a list of status."""
        engagements_schema = EngagementSchema(many=True)
        data = db.session.query(Engagement) \
            .join(EngagementStatus) \
            .filter(Engagement.status_id.in_(status_id)) \
            .order_by(Engagement.id.asc()) \
            .all()
        return engagements_schema.dump(data)

    @classmethod
    def create_engagement(cls, engagement: EngagementSchema) -> DefaultMethodResult:
        """Save engagement."""
        new_engagement = Engagement(
            name=engagement.get('name', None),
            description=engagement.get('description', None),
            rich_description=engagement.get('rich_description', None),
            start_date=engagement.get('start_date', None),
            end_date=engagement.get('end_date', None),
            status_id=Status.Draft.value,
            created_by=engagement.get('created_by', None),
            created_date=datetime.utcnow(),
            updated_by=engagement.get('updated_by', None),
            updated_date=datetime.utcnow(),
            published_date=None,
            banner_filename=engagement.get('banner_filename', None),
            content=engagement.get('content', None),
            rich_content=engagement.get('rich_content', None)
        )
        db.session.add(new_engagement)
        db.session.commit()
        return DefaultMethodResult(True, 'Engagement Added', new_engagement.id)

    @classmethod
    def update_engagement(cls, engagement: EngagementSchema) -> DefaultMethodResult:
        """Update engagement."""
        engagement_id = engagement.get('id', None)
        query = Engagement.query.filter_by(id=engagement_id)
        record: Engagement = query.first()
        if not record:
            return DefaultMethodResult(False, 'Engagement Not Found', engagement_id)

        update_fields = dict(
            name=engagement.get('name', None),
            description=engagement.get('description', None),
            rich_description=engagement.get('rich_description', None),
            start_date=engagement.get('start_date', None),
            end_date=engagement.get('end_date', None),
            status_id=engagement.get('status_id', None),
            # to fix the bug with UI not passing published date always.
            # Defaulting to existing
            published_date=engagement.get('published_date', record.published_date),
            updated_date=datetime.utcnow(),
            updated_by=engagement.get('updated_by', None),
            banner_filename=engagement.get('banner_filename', None),
            content=engagement.get('content', None),
            rich_content=engagement.get('rich_content', None),
        )
        query.update(update_fields)
        db.session.commit()
        return DefaultMethodResult(True, 'Engagement Updated', engagement_id)

    @classmethod
    def close_engagements_due(cls) -> List[EngagementSchema]:
        """Update engagement to closed."""
        now = local_datetime()
        # Strip the time off the datetime object
        date_due = datetime(now.year, now.month, now.day)
        engagements_schema = EngagementSchema(many=True)
        update_fields = dict(
            status_id=Status.Closed.value,
            updated_date=datetime.now(),
            updated_by=SYSTEM_USER
        )
        # Close published engagements where end date is prior than today
        query = Engagement.query \
            .filter(Engagement.status_id == Status.Published.value) \
            .filter(Engagement.end_date < date_due)
        records = query.all()
        if not records:
            return []
        query.update(update_fields)
        db.session.commit()
        return engagements_schema.dump(records)
