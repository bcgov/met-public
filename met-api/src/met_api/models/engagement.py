"""Engagement model class.

Manages the engagement
"""
from datetime import datetime

from sqlalchemy.dialects.postgresql import JSON
from sqlalchemy.sql.schema import ForeignKey

from met_api.constants.status import Status
from met_api.schemas.engagement import EngagementSchema

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
    def get_engagements_by_status(cls, status_id):
        """Get all engagements by a list of status."""
        engagements_schema = EngagementSchema(many=True)
        data = db.session.query(Engagement)\
            .join(EngagementStatus)\
            .filter(Engagement.status_id.in_(status_id))\
            .order_by(Engagement.id.asc())\
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
            status_id=Status.Draft,
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
        update_fields = dict(
            name=engagement.get('name', None),
            description=engagement.get('description', None),
            rich_description=engagement.get('rich_description', None),
            start_date=engagement.get('start_date', None),
            end_date=engagement.get('end_date', None),
            status_id=engagement.get('status_id', None),
            published_date=engagement.get('published_date', None),
            updated_date=datetime.utcnow(),
            updated_by=engagement.get('updated_by', None),
            banner_filename=engagement.get('banner_filename', None),
            content=engagement.get('content', None),
            rich_content=engagement.get('rich_content', None),
        )
        engagement_id = engagement.get('id', None)
        query = Engagement.query.filter_by(id=engagement_id)
        record = query.first()
        if not record:
            return DefaultMethodResult(False, 'Engagement Not Found', engagement_id)
        query.update(update_fields)
        db.session.commit()
        return DefaultMethodResult(True, 'Engagement Updated', engagement_id)
