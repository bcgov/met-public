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

"""Tests for the metadata taxon service."""

from faker import Faker
from met_api.services.metadata_taxon_service import MetadataTaxonService
from met_api.services.engagement_metadata_service import EngagementMetadataService
from tests.utilities.factory_scenarios import TestEngagementMetadataTaxonInfo
from tests.utilities.factory_utils import factory_metadata_taxon_model, factory_taxon_requirements

fake = Faker()
engagement_metadata_service = EngagementMetadataService()


def test_create_taxon(session):
    """Assert that taxa can be created and retrieved by id."""
    tenant, _ = factory_taxon_requirements()
    taxon_service = MetadataTaxonService()
    taxon = taxon_service.create(tenant.id,
                                 TestEngagementMetadataTaxonInfo.taxon1)
    assert taxon.get('id') is not None
    taxon_existing = taxon_service.get_by_id(taxon['id'])
    assert taxon_existing is not None
    assert taxon['name'] == taxon_existing['name']


def test_insert_taxon(session):
    """Assert that created taxa are positioned correctly by inserting 2 taxa."""
    tenant, _ = factory_taxon_requirements()
    taxon_service = MetadataTaxonService()
    taxon1 = taxon_service.create(tenant.id,
                                  TestEngagementMetadataTaxonInfo.taxon1)
    assert taxon1.get('id') is not None
    taxon2 = taxon_service.create(tenant.id,
                                  TestEngagementMetadataTaxonInfo.taxon3)
    assert taxon2.get('id') is not None
    taxon2_existing = taxon_service.get_by_id(taxon2['id'])
    assert taxon2_existing is not None
    assert taxon2['name'] == taxon2_existing['name']
    taxon1_existing = taxon_service.get_by_id(taxon1['id'])
    assert taxon1_existing is not None
    assert taxon1['name'] == taxon1_existing['name']
    assert taxon1['position'] == 1
    assert taxon2['position'] == 2


def test_get_by_tenant(session):
    """Assert that all taxa for a tenant can be retrieved."""
    tenant, _ = factory_taxon_requirements()
    taxon_service = MetadataTaxonService()
    # Create multiple taxa for the tenant
    taxon1 = taxon_service.create(tenant.id, TestEngagementMetadataTaxonInfo.taxon1)
    taxon2 = taxon_service.create(tenant.id, TestEngagementMetadataTaxonInfo.taxon2)
    # Retrieve taxa for tenant and assert
    tenant_taxa = taxon_service.get_by_tenant(tenant.id)
    assert taxon1 in tenant_taxa and taxon2 in tenant_taxa


def test_get_by_id(session):
    """Assert that taxa can be retrieved by id."""
    tenant, _ = factory_taxon_requirements()
    taxon_service = MetadataTaxonService()
    taxon = factory_metadata_taxon_model(tenant.id)
    assert taxon.id is not None
    taxon_existing = taxon_service.get_by_id(taxon.id)
    assert taxon_existing is not None
    assert taxon.name == taxon_existing['name']


def test_update_taxon(session):
    """Assert that taxa can be updated."""
    taxon_service = MetadataTaxonService()
    tenant, _ = factory_taxon_requirements()
    taxon = taxon_service.create(tenant.id,
                                 TestEngagementMetadataTaxonInfo.taxon1)
    assert taxon.get('id') is not None
    taxon_existing = taxon_service.get_by_id(taxon['id'])
    assert taxon_existing is not None
    assert taxon['name'] == taxon_existing['name']
    taxon['name'] = 'Updated Taxon'
    taxon_updated = taxon_service.update(taxon['id'], taxon)
    assert taxon_updated['name'] == 'Updated Taxon'


def test_delete_taxon(session):
    """Assert that taxa can be deleted."""
    taxon_service = MetadataTaxonService()
    tenant, _ = factory_taxon_requirements()
    taxon = factory_metadata_taxon_model(tenant.id)
    assert taxon.id is not None
    taxon_service.delete(taxon.id)
    taxon_existing = taxon_service.get_by_id(taxon.id)
    assert taxon_existing is None


def test_reorder_tenant(session):
    """Assert that taxa can be reordered within a tenant."""
    tenant, _ = factory_taxon_requirements()
    taxon_service = MetadataTaxonService()
    # Create multiple taxa
    taxon1 = taxon_service.create(tenant.id, TestEngagementMetadataTaxonInfo.taxon2)
    taxon2 = taxon_service.create(tenant.id, TestEngagementMetadataTaxonInfo.taxon1)
    assert taxon1['position'] == 1 and taxon2['position'] == 2
    # Reorder taxa
    new_order = [taxon2['id'], taxon1['id']]
    updated_taxa = taxon_service.reorder_tenant(tenant.id, new_order)
    # Assert new order
    assert updated_taxa[0]['id'] == taxon2['id'] and updated_taxa[0]['position'] == 1
    assert updated_taxa[1]['id'] == taxon1['id'] and updated_taxa[1]['position'] == 2


def test_auto_order_tenant(session):
    """Assert that taxa positions are automatically ordered correctly."""
    tenant, _ = factory_taxon_requirements()
    taxon_service = MetadataTaxonService()
    # Create multiple taxa
    for i in range(10):
        gap_position = fake.random_int(min=2, max=9)
        taxon = factory_metadata_taxon_model(tenant.id)
        position = fake.random_int(min=1, max=9)
        # hacky way to guarantee at least 1 duplicate position, and a random gap
        # the idea is to generate invalid data for the auto_order_tenant function to fix
        if position == gap_position:
            position = 10
        taxon.position = position
    tenant_taxa = taxon_service.auto_order_tenant(tenant.id)
    # Assert new order
    for i in range(10):
        # Every number appears once
        assert tenant_taxa[i]['position'] == i + 1
