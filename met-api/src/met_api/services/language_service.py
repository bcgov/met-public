"""Service for Language management."""

from sqlalchemy.exc import SQLAlchemyError

from met_api.models.language import Language
from met_api.models.language_tenant_mapping import LanguageTenantMapping
from met_api.schemas.language import LanguageSchema
from met_api.schemas.language_tenant_mapping import LanguageTenantMappingSchema


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

    @staticmethod
    def map_language_to_tenant(language_id: int, tenant_id: int):
        """Create an entry in the language tenant mapping table to associated a language with a tenant."""
        language_mapping = LanguageTenantMapping()
        try:
            language_mapping.add_language_to_tenant(language_id, tenant_id)
        except SQLAlchemyError as e:
            raise ValueError('Error adding language to tenant.') from e
        return LanguageTenantMappingSchema().dump(language_mapping)

    @staticmethod
    def remove_language_mapping_from_tenant(language_mapping_id: int):
        """Remove the DB entry that maps the language to the tenant."""
        return LanguageTenantMapping.remove_language_from_tenant(language_mapping_id)

    @staticmethod
    def get_languages_by_tenant(tenant_id: int):
        """Get all languages associated with a given tenant."""
        return LanguageTenantMapping.get_all_by_tenant_id(tenant_id)
