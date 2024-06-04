""" mapping model class.

Manages which tenants have which languages selected.
"""
from __future__ import annotations

from .base_model import BaseModel
from .language import Language
from sqlalchemy import UniqueConstraint
from .db import db
from flask import current_app



class LanguageTenantMapping(BaseModel):  # pylint: disable=too-few-public-methods, too-many-instance-attributes
    
    __tablename__ = 'language_tenant_mapping'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    language_id = db.Column(db.Integer, db.ForeignKey('language.id'), nullable=True)
    tenant_id = db.Column(db.Integer, db.ForeignKey('tenant.id'), nullable=True)

    # Add a unique constraint on any given combination of tenant_id and language_id
    __table_args__ = (UniqueConstraint('language_id', 'tenant_id'),)

    @classmethod
    def get_all_by_tenant_id(cls, tenant_id):
        """Get all languages selected by a given tenant."""
        language_mappings_query = db.session.query(LanguageTenantMapping.language_id)\
            .filter_by(tenant_id = tenant_id)
        return db.session.query(Language).filter(Language.id.in_(language_mappings_query)).all()


    @classmethod
    def add_language_to_tenant(cls, language_id, tenant_id):
        """Add a language to the langage tenant mapping table."""
        language_tenant_mapping = LanguageTenantMapping(language_id=language_id, tenant_id=tenant_id)
        db.session.add(language_tenant_mapping)
        db.session.commit()
        current_app.logger.debug('hello')
        current_app.logger.debug(language_tenant_mapping)
        current_app.logger.debug(language_tenant_mapping.language_id)
        return language_tenant_mapping
    
    @classmethod
    def remove_language_from_tenant(cls, language_mapping_id):
        """Remove a language from the langage tenant mapping table."""
        languageMapping = LanguageTenantMapping.query.get(language_mapping_id)
        if languageMapping:
            db.session.delete(languageMapping)
            db.session.commit()
            return True
        return False