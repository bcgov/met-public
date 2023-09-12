"""CAC Form model class.

Manages the cac form submission
"""
from __future__ import annotations

from sqlalchemy.sql.schema import ForeignKey

from .base_model import BaseModel
from .db import db


class CACForm(BaseModel):  # pylint: disable=too-few-public-methods, too-many-instance-attributes
    """Definition of the CAC form entity."""

    __tablename__ = 'cac_form'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    engagement_id = db.Column(db.Integer, ForeignKey('engagement.id', ondelete='CASCADE'), nullable=False)
    tenant_id = db.Column(db.Integer, db.ForeignKey('tenant.id'), nullable=True)
    understand = db.Column(db.Boolean, nullable=False)
    terms_of_reference = db.Column(db.Boolean, nullable=False)
    first_name = db.Column(db.String(50), nullable=False)
    last_name = db.Column(db.String(50), nullable=False)
    city = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(50), nullable=False)

    @classmethod
    def get_all_by_engagement_id(cls, engagement_id):
        """Get cac form by engagement id."""
        return db.session.query(CACForm).filter(CACForm.engagement_id == engagement_id).all()