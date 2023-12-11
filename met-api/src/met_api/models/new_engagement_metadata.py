"""
The Engagement Metadata models.
"""

from sqlalchemy.dialects import postgresql
from sqlalchemy.sql.schema import ForeignKey

from .base_model import BaseModel
from .db import db

class MetadataModel(BaseModel):
    """
    Metadata for an Engagement. Can be used to store any arbitrary data.
    """
    __tablename__ = 'metadata_relationship'
    tenant_id = db.Column(
        db.Integer,
        ForeignKey('tenant.id', ondelete='CASCADE'), 
        primary_key=True
    )
    engagement_id = db.Column(
        db.Integer,
        ForeignKey('engagement.id', ondelete='CASCADE'),
        primary_key=True
    )
    category_id = db.Column(
        db.Integer, 
        ForeignKey('metadata_category.category_id', ondelete='CASCADE'),
        primary_key=True
    )
    value = db.Column(db.String(512), unique=False, nullable=True)

    category = db.relationship('MetadataTaxonomy', backref='metadata')
    engagements = db.relationship('Engagement', backref='metadata')

class MetadataTaxonomyModel(BaseModel):
    """
    Defines a category of metadata fields.
    """
    __tablename__ = 'metadata_category'
    category_id = db.Column(db.Integer, primary_key=True)
    tenant_id = db.Column(
        db.Integer,
        ForeignKey('tenant.id', ondelete='CASCADE'),
        primary_key=True
    )
    freeform = db.Column(db.Boolean, unique=False, nullable=True)
    category_type = db.Column(db.String(100), unique=False, nullable=True)
    one_per_engagement = db.Column(db.Boolean, unique=False, nullable=True)
    name = db.Column(db.String(100), unique=False, nullable=True)
    data_type = db.Column(db.String(100), unique=False, nullable=True)
    description = db.Column(db.String(100), unique=False, nullable=True)
    metadata = db.relationship(MetadataModel, backref='metadata_category')