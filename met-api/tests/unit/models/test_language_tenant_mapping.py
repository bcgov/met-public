"""Tests for the Language model.

Test suite to ensure that the Language model routines are working as expected.
"""

from met_api.models.language_tenant_mapping import LanguageTenantMapping
from tests.utilities.factory_utils import factory_language_tenant_mapping_model, factory_tenant_model
from tests.utilities.factory_scenarios import TestTenantInfo


def test_get_all_by_tenant_short_name(session):
    """Assert that all languages associated with a tenant can be fetched."""
    tenant = factory_tenant_model({**TestTenantInfo.tenant1, 'short_name': 'EAO2'})

    factory_language_tenant_mapping_model({
        'language_id': 49,
        'tenant_id': tenant.id
    })
    factory_language_tenant_mapping_model({
        'language_id': 42,
        'tenant_id': tenant.id
    })
    tenant_languages = LanguageTenantMapping.get_all_by_tenant_short_name(tenant.short_name)
    assert len(tenant_languages) >= 2


def test_add_language_to_tenant(session):
    """Assert that a language can be mapped to a tenant."""
    tenant = factory_tenant_model({**TestTenantInfo.tenant1, 'short_name': 'EAO2'})

    tenant_language = LanguageTenantMapping.add_language_to_tenant(42, tenant.id)
    assert tenant_language.tenant_id == tenant.id


def test_remove_language_from_tenant(session):
    """Assert that a language mapping can be removed from a tenant."""
    tenant = factory_tenant_model({**TestTenantInfo.tenant1, 'short_name': 'EAO2'})
    deleted_tenant_language = LanguageTenantMapping.remove_language_from_tenant(42, tenant.id)
    assert deleted_tenant_language is False
