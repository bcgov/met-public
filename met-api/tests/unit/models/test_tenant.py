# Copyright © 2019 Province of British Columbia
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
"""Tests for the Tenant model.

Test suite to ensure that the Tenant model routines are working as expected.
"""
import pytest
from faker import Faker

from met_api.models.tenant import Tenant as TenantModel
from tests.utilities.factory_utils import factory_tenant_model

fake = Faker()


def test_tenant_creation(session):
    """Assert that a tenant can be created and fetched."""
    tenant = factory_tenant_model()
    assert tenant.id is not None
    tenant_existing = TenantModel.find_by_id(tenant.id)
    assert tenant.short_name == tenant_existing.short_name


def test_find_tenant_by_short_name(session):
    """Assert that a tenant can be found by short name."""
    tenant = factory_tenant_model()
    tenant_existing = TenantModel.find_by_short_name(tenant.short_name)
    assert tenant_existing is not None
    assert tenant.short_name == tenant_existing.short_name


def test_find_all_tenants(session):
    """Assert that all tenants can be fetched."""
    factory_tenant_model()
    factory_tenant_model()
    tenants = TenantModel.find_all()
    assert len(tenants) >= 2


def test_update_tenant(session):
    """Assert that a tenant can be updated."""
    tenant = factory_tenant_model()
    new_name = fake.company()
    tenant_data = {'name': new_name}
    tenant.update(tenant_data)
    updated_tenant = TenantModel.find_by_id(tenant.id)
    assert updated_tenant.name == new_name


def test_delete_tenant(session):
    """Assert that a tenant can be deleted."""
    tenant = factory_tenant_model()
    tenant_id = tenant.id
    tenant.delete()
    deleted_tenant = TenantModel.find_by_id(tenant_id)
    assert deleted_tenant is None


def test_find_tenant_by_nonexistent_id(session):
    """Assert that finding a tenant by a nonexistent ID returns None."""
    tenant = TenantModel.find_by_id(99999)
    assert tenant is None


def test_update_nonexistent_tenant(session):
    """Assert that updating a nonexistent tenant raises an error."""
    tenant_data = {'name': fake.company()}
    tenant = TenantModel()
    with pytest.raises(ValueError):
        tenant.update(tenant_data)


def test_delete_nonexistent_tenant(session):
    """Assert that deleting a nonexistent tenant raises an error."""
    tenant = TenantModel()
    with pytest.raises(ValueError) as excinfo:
        tenant.delete()
    assert str(excinfo.value) == 'Tenant not found.'
