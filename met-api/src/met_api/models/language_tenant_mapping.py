"""Manages which tenants have which languages selected."""
from __future__ import annotations
from sqlalchemy import UniqueConstraint

from .base_model import BaseModel
from .tenant import Tenant
from .language import Language
from .db import db


class LanguageTenantMapping(BaseModel):  # pylint: disable=too-few-public-methods, too-many-instance-attributes
    """Manage language-tenant relationships."""

    __tablename__ = 'language_tenant_mapping'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    language_id = db.Column(db.Integer, db.ForeignKey('language.id'), nullable=True)
    tenant_id = db.Column(db.Integer, db.ForeignKey('tenant.id'), nullable=True)

    # Add a unique constraint on any given combination of tenant_id and language_id
    __table_args__ = (UniqueConstraint('language_id', 'tenant_id'),)

    @classmethod
    def get_all_by_tenant_short_name(cls, tenant_short_name):
        """Get all languages selected by a given tenant."""
        tenant = Tenant.find_by_short_name(tenant_short_name)
        if not tenant:
            raise ValueError('Error finding tenant.', cls, tenant_short_name)
        language_mappings_query = db.session.query(LanguageTenantMapping.language_id)\
            .filter_by(tenant_id=tenant.id)
        return db.session.query(Language).filter(Language.id.in_(language_mappings_query)).all()

    @classmethod
    def add_language_to_tenant(cls, language_id, tenant_id):
        """Add a language to the langage tenant mapping table."""
        language_tenant_mapping = LanguageTenantMapping(language_id=language_id, tenant_id=tenant_id)
        db.session.add(language_tenant_mapping)
        db.session.commit()
        return language_tenant_mapping

    @classmethod
    def remove_language_from_tenant(cls, language_id, tenant_id):
        """Remove a language from the langage tenant mapping table."""
        language_tenant_mapping_to_delete = db.session.\
            query(LanguageTenantMapping).filter(
                LanguageTenantMapping.language_id == language_id,
                LanguageTenantMapping.tenant_id == tenant_id
            ).one_or_none()
        if language_tenant_mapping_to_delete:
            db.session.delete(language_tenant_mapping_to_delete)
            db.session.commit()
            return True
        return False
