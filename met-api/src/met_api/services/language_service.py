"""Service for Language management."""

from sqlalchemy.exc import SQLAlchemyError
from flask import current_app

from met_api.models.tenant import Tenant
from met_api.models.language import Language
from met_api.models.language_tenant_mapping import LanguageTenantMapping
from met_api.schemas.language import LanguageSchema
from met_api.schemas.language_tenant_mapping import LanguageTenantMappingSchema
from met_api.services import authorization
from met_api.utils.roles import Role


class LanguageService:
    """Language management service."""

    @staticmethod
    def get_language_by_id(language_id):
        """Get language by id."""
        language_record = Language.find_by_id(language_id)
        return LanguageSchema().dump(language_record)

    @staticmethod
    def get_languages():
        """Get languages."""
        languages_records = Language.get_languages()
        return LanguageSchema(many=True).dump(languages_records)

    @staticmethod
    def update_language(language_id, data: dict):
        """Update language partially."""
        updated_language = Language.update_language(language_id, data)
        if not updated_language:
            raise ValueError('Language to update was not found')
        return updated_language

    @classmethod
    def map_language_to_tenant(cls, language_id, tenant_short_name):
        """Create an entry in the language tenant mapping table to associated a language with a tenant."""
        language_mapping = LanguageTenantMapping()
        authorization.check_auth(one_of_roles=(
            Role.EDIT_LANGUAGES.value,
        ))
        tenant = Tenant.find_by_short_name(tenant_short_name)
        if not tenant:
            raise ValueError('Error finding tenant.', cls, tenant_short_name)
        try:
            language_mapping.add_language_to_tenant(language_id, tenant.id)
        except SQLAlchemyError as e:
            raise ValueError('Error adding language to tenant.') from e
        return LanguageTenantMappingSchema().dump(language_mapping)

    @classmethod
    def remove_language_mapping_from_tenant(cls, language_id, tenant_short_name):
        """Remove the DB entry that maps the language to the tenant."""
        authorization.check_auth(one_of_roles=(
            Role.EDIT_LANGUAGES.value,
        ))
        tenant = Tenant.find_by_short_name(tenant_short_name)
        if not tenant:
            raise ValueError('Tenant not found.', cls, tenant_short_name)
        try:
            LanguageTenantMapping.remove_language_from_tenant(language_id, tenant.id)
        except SQLAlchemyError as e:
            current_app.logger.error('Error deleting tenant {}', e)
            raise ValueError('Error deleting tenant.') from e
        return {'status': 'success', 'message': 'Tenant deleted successfully'}

    @staticmethod
    def get_languages_by_tenant(tenant_short_name: str):
        """Get all languages associated with a given tenant."""
        return LanguageTenantMapping.get_all_by_tenant_short_name(tenant_short_name)
