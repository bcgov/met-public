"""
The EngagementMetadata model represents a unit of metadata for an Engagement.
Metadata is stored as a key-value pair, where the key is a MetadataTaxon and
the value is a string. MetadataTaxa are used to group metadata by type, and
determine how it is displayed in the UI.
"""
from __future__ import annotations
import enum
from sqlalchemy.orm import relationship

from .base_model import BaseModel
from .db import db, transactional


class EngagementMetadata(BaseModel):
    """
    A unit of metadata for an Engagement. Can be used to store arbitrary data.
    """
    __tablename__ = 'engagement_metadata'
    id = db.Column(db.Integer, primary_key=True, nullable=False, autoincrement=True)
    # tenant_id = db.Column(db.Integer,
    #     db.ForeignKey('tenant.id', ondelete='CASCADE'), index=True)
    # tenant = relationship('Tenant', backref='engagement_metadata')
    engagement_id = db.Column(db.Integer,
        db.ForeignKey('engagement.id', ondelete='CASCADE'), nullable=True, index=True)
    engagement = db.relationship('Engagement', backref='metadata')
    taxon_id = db.Column(db.Integer, 
        db.ForeignKey('engagement_metadata_taxa.id', ondelete='CASCADE'), nullable=False, index=True)
    taxon = db.relationship('MetadataTaxon', backref='entries')
    value = db.Column(db.Text, index=True, nullable=False)

    @property
    def tenant(self):
        return self.taxon.tenant if self.taxon else None

    def __repr__(self) -> str:
        if not self:
            return '<EngagementMetadata: None>'
        if (not self.engagement and not self.taxon):
            return f'<EngagementMetadata: {self.value}>'
        if not self.taxon:
            return f'<EngagementMetadata for e#{self.engagement_id}: ???={self.value}>'
        if not self.engagement:
            return f'<EngagementMetadata for taxon #{self.taxon_id}: {self.taxon.name} = {self.value}'
        return (f'<EngagementMetadata for eng#{self.engagement_id}: '
                f'{self.taxon.name} = {self.value}>')

class MetadataTaxonDataType(str, enum.Enum):
    """
    The data types that can be stored in a metadata property.
    """
    TEXT = 'string'
    LONG_TEXT = 'long-text'
    NUMBER = 'number'
    DATE = 'date'
    DATETIME = 'datetime'
    BOOLEAN = 'boolean'
    SELECT = 'select'
    IMAGE = 'image'
    VIDEO = 'video'
    AUDIO = 'audio'
    FILE = 'other_file'
    URL = 'url'
    EMAIL = 'email'
    PHONE = 'phone'
    ADDRESS = 'address'
    OTHER = 'other'

    @classmethod
    def has_value(cls, value: str) -> bool:
        """Return True if the value is a valid data type."""
        return value in cls._value2member_map_

class MetadataTaxon(BaseModel):
    """
    A taxon to group metadata by. Taxa determine the type of data
    that can be stored in a property, and how it is displayed.
    """

    __tablename__ = 'engagement_metadata_taxa'

    id = db.Column(db.Integer, primary_key=True, unique=True, autoincrement=True)
    tenant_id = db.Column(db.Integer,
        db.ForeignKey('tenant.id', ondelete='CASCADE'),
        nullable=False, index=True)
    tenant = relationship('Tenant', backref='metadata_taxa')
    name = db.Column(db.String(64), nullable=True)
    description = db.Column(db.String(256), nullable=True)
    freeform = db.Column(db.Boolean, nullable=False, default=False)
    data_type = db.Column(db.String(64), nullable=True, default='text')
    default_value = db.Column(db.Text, nullable=True)
    one_per_engagement = db.Column(db.Boolean)
    position = db.Column(db.Integer, nullable=False, index=True)

    def __init__(self, **kwargs) -> None:
        super().__init__(**kwargs)
        if not self.data_type:
            self.data_type = 'text'
        if not self.position:
            # find other taxa in this tenant and set position to the next highest
            max_position = MetadataTaxon.query.filter_by(tenant_id=self.tenant_id).count()
            self.position = max_position + 1

    def __repr__(self) -> str:
        if not self:
            return '<MetadataTaxon: None>'
        return f'<MetadataTaxon #{self.id}: {self.name}>'


    @transactional()
    def move_to_position(self, new_position: int) -> None:
        """
        Move this taxon to a specific position within the same tenant,
        updating positions of other taxa accordingly.
        """
        tenant_id = self.tenant_id
        current_position = self.position
        # the affected range of positions
        start, end = sorted([current_position, new_position])
        # Create a query that selects the affected taxa in the tenant
        affected_taxa = MetadataTaxon.query.filter(
            MetadataTaxon.tenant_id == tenant_id,
            MetadataTaxon.position.between(start, end)
        ).all()
        print(affected_taxa)
        print([taxon.position for taxon in affected_taxa])
        # Determine the direction of the position update
        position_delta = -1 if new_position > current_position else 1
        # Update positions for each affected taxon
        for taxon in affected_taxa:
            if taxon.id != self.id:
                taxon.position += position_delta

        # Finally, update the position of the current taxon
        self.position = new_position
        db.session.commit()
        print(affected_taxa)
        print([taxon.position for taxon in affected_taxa])

    @transactional()
    def delete(self) -> None:
        """
        Remove the taxon, updating the positions of subsequent taxa within the same tenant.
        """
        if self is not None:
            subsequent_taxa = MetadataTaxon.query.filter(
                MetadataTaxon.tenant_id == self.tenant_id,
                MetadataTaxon.position > self.position).all()

            for taxon in subsequent_taxa:
                taxon.position -= 1

            super().delete()

    @classmethod
    @transactional()
    def reorder_taxa(cls, tenant_id: int, taxon_order: list[int]) -> None:
        """
        Reorder all taxa within a specific tenant based on a provided list
        of taxon IDs, setting their positions accordingly.
        """
        for index, taxon_id in enumerate(taxon_order):
            taxon = cls.query.filter_by(tenant_id=tenant_id, taxon_id=taxon_id).first()
            if taxon:
                taxon.position = index