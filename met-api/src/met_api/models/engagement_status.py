"""Engagement Status model class.

Manages the engagement status
"""
from .base_model import BaseModel
from .db import db, ma


class EngagementStatus(BaseModel):  # pylint: disable=too-few-public-methods
    """Definition of the Engagement Status entity."""

    __tablename__ = 'engagement_status'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    status_name = db.Column(db.String(50))
    description = db.Column(db.String(50))
    engagement_status_id = db.relationship('Engagement', backref='engagement_status', viewonly=True)


class EngagementStatusSchema(ma.Schema):
    """Engagement status schema."""

    class Meta:  # pylint: disable=too-few-public-methods
        """Meta class."""

        fields = ('id', 'status_name', 'description', 'created_date', 'updated_date')
