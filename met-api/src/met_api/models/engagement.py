"""Engagement model class

Manages the engagement
"""

from datetime import datetime

from sqlalchemy.sql.schema import ForeignKey

from .db import db, ma
from .default_method_result import DefaultMethodResult
from sqlalchemy.dialects.postgresql import JSON, UUID

class Engagement(db.Model):
    """Definition of the Engagement entity"""
    __tablename__ = 'engagement'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(50))
    description = db.Column(db.Text, unique=False, nullable=False)
    rich_text_state = db.Column(JSON, unique=False, nullable=False)
    start_date = db.Column(db.DateTime)
    end_date = db.Column(db.DateTime)
    status_id = db.Column(db.Integer, ForeignKey('engagement_status.id', ondelete='CASCADE'))
    created_date = db.Column(db.DateTime, default=datetime.utcnow())
    updated_date = db.Column(db.DateTime, onupdate=datetime.utcnow())
    published_date = db.Column(db.DateTime, nullable=True)
    user_id = db.Column(db.Integer, ForeignKey('user.id', ondelete='CASCADE'))

    @classmethod
    def get_engagement(cls, engagement_id):
        """Get an engagement."""
        engagement_schema = EngagementSchema()
        request = db.session.query(Engagement).filter_by(id=engagement_id).first()
        return engagement_schema.dump(request)

    @classmethod
    def get_all_engagements(cls):
        """Get all engagements."""
        engagements_schema = EngagementSchema(many=True)
        query = db.session.query(Engagement).order_by(Engagement.id.asc()).all()
        return engagements_schema.dump(query)

    @classmethod
    def create_engagement(cls, engagement) -> DefaultMethodResult:
        """Save engagement."""
        new_engagement = Engagement(
            name=engagement["name"],
            description=engagement['description'],
            start_date=engagement['start_date'],
            end_date=engagement['end_date'],
            status_id=1,
            user_id=1,
            created_date=datetime.utcnow(),
            updated_date=datetime.utcnow(),
            published_date=None
        )
        db.session.add(new_engagement)
        db.session.commit()

        return DefaultMethodResult(True, 'Engagement Added', new_engagement.id)
    
    @classmethod
    def update_engagement(cls, engagement) -> DefaultMethodResult:
        """Update engagement."""
        update_fields = dict(
            name=engagement["name"],
            description=engagement['description'],
            start_date=engagement['start_date'],
            end_date=engagement['end_date'],
            updated_date= datetime.utcnow()
        )
        Engagement.query.filter_by(id=engagement['id']).update(update_fields)
        db.session.commit()
        return DefaultMethodResult(True, 'Engagement Updated', engagement['id'])


class EngagementSchema(ma.Schema):
    class Meta:
        fields = (
            'id', 'name', 'description','rich_text_state', 'start_date', 'end_date', 'status_id', 'user_id', 'updated_date',
            'published_date')
