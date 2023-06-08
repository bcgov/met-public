"""Engagement model class.

Manages the engagement
"""

from __future__ import annotations

from datetime import datetime
from typing import List, Optional

from sqlalchemy import and_, asc, desc, or_
from sqlalchemy.dialects.postgresql import JSON
from sqlalchemy.sql import text
from sqlalchemy.sql.schema import ForeignKey

from met_api.constants.engagement_status import EngagementDisplayStatus, Status
from met_api.constants.user import SYSTEM_USER
from met_api.models.engagement_metadata import EngagementMetadataModel
from met_api.models.membership import Membership as MembershipModel
from met_api.models.pagination_options import PaginationOptions
from met_api.schemas.engagement import EngagementSchema
from met_api.utils.datetime import local_datetime
from .base_model import BaseModel
from .db import db
from .engagement_status import EngagementStatus


class Engagement(BaseModel):
    """Definition of the Engagement entity."""

    __tablename__ = 'engagement'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(50))
    description = db.Column(db.Text, unique=False, nullable=False)
    rich_description = db.Column(JSON, unique=False, nullable=False)
    start_date = db.Column(db.DateTime)
    end_date = db.Column(db.DateTime)
    status_id = db.Column(db.Integer, ForeignKey('engagement_status.id', ondelete='CASCADE'))
    published_date = db.Column(db.DateTime, nullable=True)
    scheduled_date = db.Column(db.DateTime, nullable=True)
    content = db.Column(db.Text, unique=False, nullable=False)
    rich_content = db.Column(JSON, unique=False, nullable=False)
    banner_filename = db.Column(db.String(), unique=False, nullable=True)
    surveys = db.relationship('Survey', backref='engagement', cascade='all, delete')
    status_block = db.relationship('EngagementStatusBlock', backref='engagement')
    tenant_id = db.Column(db.Integer, db.ForeignKey('tenant.id'), nullable=True)
    is_internal = db.Column(db.Boolean, nullable=False)

    @classmethod
    def get_engagements_paginated(
            cls,
            pagination_options: PaginationOptions,
            search_options=None,
            statuses=None,
            assigned_engagements: list[int] | None = None,
    ):
        """Get engagements paginated."""
        query = db.session.query(Engagement).join(EngagementStatus)

        query = cls._add_tenant_filter(query)

        if statuses:
            query = cls._filter_by_statuses(query, statuses)

        if search_options:
            query = cls._filter_by_search_text(query, search_options)

            query = cls._filter_by_created_date(query, search_options)

            query = cls._filter_by_published_date(query, search_options)

            query = cls._filter_by_engagement_status(query, search_options)

            query = cls._filter_by_project_metadata(query, search_options)

        query = cls._filter_by_internal(query, search_options)

        if assigned_engagements is not None:
            query = cls._filter_by_assigned_engagements(query, assigned_engagements)

        sort = cls._get_sort_order(pagination_options)

        query = query.order_by(sort)

        no_pagination_options = not pagination_options.page or not pagination_options.size
        if no_pagination_options:
            items = query.all()
            return items, len(items)

        page = query.paginate(page=pagination_options.page, per_page=pagination_options.size)
        return page.items, page.total

    @classmethod
    def update_engagement(cls, engagement: EngagementSchema) -> Engagement:
        """Update engagement."""
        engagement_id = engagement.get('id', None)
        query = Engagement.query.filter_by(id=engagement_id)
        record: Engagement = query.first()
        if not record:
            return None

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
            scheduled_date=engagement.get('scheduled_date', record.scheduled_date),
            updated_date=datetime.utcnow(),
            updated_by=engagement.get('updated_by', None),
            banner_filename=engagement.get('banner_filename', None),
            content=engagement.get('content', None),
            rich_content=engagement.get('rich_content', None),
            is_internal=engagement.get('is_internal', record.is_internal),
        )
        query.update(update_fields)
        db.session.commit()
        return record

    @classmethod
    def edit_engagement(cls, engagement_data: dict) -> Optional[Engagement]:
        """Update engagement."""
        engagement_id = engagement_data.get('id', None)
        query = Engagement.query.filter_by(id=engagement_id)
        engagement: Engagement = query.first()
        if not engagement:
            return None
        engagement_data['updated_date'] = datetime.utcnow()
        query.update(engagement_data)
        db.session.commit()
        return engagement

    @classmethod
    def close_engagements_due(cls) -> List[Engagement]:
        """Update engagement to closed."""
        now = local_datetime()
        # Strip the time off the datetime object
        date_due = datetime(now.year, now.month, now.day)
        update_fields = dict(
            status_id=Status.Closed.value,
            updated_date=datetime.utcnow(),
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
        return records

    @classmethod
    def publish_scheduled_engagements_due(cls) -> List[EngagementSchema]:
        """Update scheduled engagements to published."""
        datetime_due = datetime.now()
        print('Publish due date ------------------------', datetime_due)
        update_fields = dict(
            status_id=Status.Published.value,
            published_date=datetime.utcnow(),
            updated_date=datetime.utcnow(),
            updated_by=SYSTEM_USER
        )
        # Publish scheduled engagements where scheduled datetime is prior than now
        query = Engagement.query \
            .filter(Engagement.status_id == Status.Scheduled.value) \
            .filter(Engagement.scheduled_date <= datetime_due)
        records = query.all()
        if not records:
            return None
        query.update(update_fields)
        db.session.commit()
        return records

    @staticmethod
    def _get_sort_order(pagination_options):
        sort = asc(text(pagination_options.sort_key)) if pagination_options.sort_order == 'asc' \
            else desc(text(pagination_options.sort_key))
        return sort

    @staticmethod
    def _filter_by_engagement_status(query, search_options):
        if engagement_status := search_options.get('engagement_status'):
            status_filter_conditions = [Engagement.status_id.in_(engagement_status)]
            if str(EngagementDisplayStatus.Upcoming.value) in engagement_status:
                status_filter_conditions.append(and_(Engagement.status_id == Status.Published.value,
                                                     Engagement.start_date > datetime.now()))
            if str(EngagementDisplayStatus.Open.value) in engagement_status:
                status_filter_conditions.append(and_(Engagement.status_id == Status.Published.value,
                                                     Engagement.start_date <= datetime.now()))
            query = query.filter(or_(*status_filter_conditions))
        return query

    @classmethod
    def _filter_by_published_date(cls, query, search_options):
        if published_from_date := search_options.get('published_from_date'):
            query = query.filter(Engagement.published_date >= published_from_date)
        if published_to_date := search_options.get('published_to_date'):
            query = query.filter(Engagement.published_date <= published_to_date)
        return query

    @staticmethod
    def _filter_by_created_date(query, search_options):
        if created_from_date := search_options.get('created_from_date'):
            query = query.filter(Engagement.created_date >= created_from_date)
        if created_to_date := search_options.get('created_to_date'):
            query = query.filter(Engagement.created_date <= created_to_date)
        return query

    @staticmethod
    def _filter_by_search_text(query, search_options):
        if search_text := search_options.get('search_text'):
            query = query.filter(Engagement.name.ilike('%' + search_text + '%'))
        return query

    @staticmethod
    def _filter_by_internal(query, search_options):
        if exclude_internal := search_options.get('exclude_internal'):
            if exclude_internal:
                query = query.filter(Engagement.is_internal.is_(False))
        return query

    @staticmethod
    def _filter_by_project_metadata(query, search_options):
        query = query.outerjoin(EngagementMetadataModel, EngagementMetadataModel.engagement_id == Engagement.id)

        if project_type := search_options.get('project_type'):
            query = query.filter(EngagementMetadataModel.project_metadata['type'].astext.ilike(f'%{project_type}%')) \
                .params(val=project_type)

        if project_name := search_options.get('project_name'):
            query = query.filter(EngagementMetadataModel.project_metadata['project_name']
                                 .astext.ilike(f'%{project_name}%')) \
                .params(val=project_name)

        if project_id := search_options.get('project_id'):
            query = query.filter(EngagementMetadataModel.project_id == project_id) \
                .params(val=project_id)

        if application_number := search_options.get('application_number'):
            query = query.filter(EngagementMetadataModel.project_metadata['application_number']
                                 .astext.ilike(f'%{application_number}%')) \
                .params(val=application_number)

        if client_name := search_options.get('client_name'):
            query = query.filter(EngagementMetadataModel.project_metadata['client_name']
                                 .astext.ilike(f'%{client_name}%')) \
                .params(val=client_name)

        return query

    @staticmethod
    def _filter_by_statuses(query, statuses):
        return query.filter(Engagement.status_id.in_(statuses))

    @staticmethod
    def _filter_by_assigned_engagements(query, assigned_engagements: list[int]):
        query = query.filter(or_(
            Engagement.status_id != Status.Draft.value,
            Engagement.id.in_(assigned_engagements)
        ))
        return query

    @staticmethod
    def get_assigned_engagements(user_id: int) -> List[Engagement]:
        """Get engagements assigned to the given user id."""
        engagements = db.session.query(Engagement).join(MembershipModel).filter(
            MembershipModel.user_id == user_id).all()
        return engagements
