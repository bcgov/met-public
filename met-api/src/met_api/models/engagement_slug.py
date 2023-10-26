"""Engagement slug model class.

Manages the engagement slug
"""
from sqlalchemy import ForeignKey, Index, or_
from sqlalchemy.orm import relationship

from .base_model import BaseModel
from .db import db


class EngagementSlug(BaseModel):
    """Definition of the EngagementSlug entity."""

    __tablename__ = 'engagement_slug'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    engagement_id = db.Column(db.Integer, ForeignKey('engagement.id', ondelete='CASCADE'), nullable=False, unique=True)
    slug = db.Column(db.String(200), nullable=False, unique=True)

    engagement = relationship('Engagement', backref='engagement_slugs')

    __table_args__ = (
        Index('idx_slug', slug),
    )

    @classmethod
    def find_by_slug(cls, slug):
        """Return engagement slug by slug."""
        return cls.query.filter(cls.slug.ilike(slug)).first()

    @classmethod
    def find_by_engagement_id(cls, engagement_id):
        """Return engagement slug by engagement id."""
        return cls.query.filter_by(engagement_id=engagement_id).first()

    @classmethod
    def find_similar_slugs(cls, target_slug: str):
        """Find already saved slugs with similar name and pattern."""
        similar_slugs = EngagementSlug.query.filter(
            or_(
                EngagementSlug.slug == target_slug,
                EngagementSlug.slug.ilike(target_slug + '-%')
            )
        ).all()
        return similar_slugs
