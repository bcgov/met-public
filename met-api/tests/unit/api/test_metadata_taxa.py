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

"""Tests for Metadata Taxon related endpoints."""

import json
from http import HTTPStatus
from met_api.utils.enums import ContentType
from met_api.models.engagement_metadata import MetadataTaxon
from met_api.services.engagement_metadata_service import EngagementMetadataService
from met_api.services.metadata_taxon_service import MetadataTaxonService
from tests.utilities.factory_scenarios import TestEngagementMetadataTaxonInfo
from tests.utilities.factory_utils import factory_metadata_taxon_model, factory_taxon_requirements

engagement_metadata_service = EngagementMetadataService()
metatada_taxon_service = MetadataTaxonService()


def test_get_tenant_metadata_taxa(client, jwt, session):
    """Test that metadata taxon can be retrieved by tenant id."""
    tenant, headers = factory_taxon_requirements(jwt)
    metadata_taxon = factory_metadata_taxon_model(tenant.id)
    assert metatada_taxon_service.get_by_tenant(tenant.id) is not None
    response = client.get(f'/api/tenants/{tenant.short_name}/metadata/taxa',
                          headers=headers, content_type=ContentType.JSON.value)
    assert response.status_code == HTTPStatus.OK
    metadata_taxon_list = response.json
    assert len(metadata_taxon_list) == 1, metadata_taxon_list
    assert metadata_taxon_list[0]['id'] == metadata_taxon.id
    assert metadata_taxon_list[0]['tenant_id'] == metadata_taxon.tenant_id


def test_get_taxon_by_id(client, jwt, session):
    """Test that metadata taxon can be retrieved by id."""
    tenant, headers = factory_taxon_requirements(jwt)
    metadata_taxon = factory_metadata_taxon_model(tenant.id)
    assert metatada_taxon_service.get_by_id(metadata_taxon.id) is not None
    response = client.get(f'/api/tenants/{tenant.short_name}/metadata/taxon/{metadata_taxon.id}',
                          headers=headers, content_type=ContentType.JSON.value)
    assert response.status_code == HTTPStatus.OK
    metadata_taxon = response.json
    assert metadata_taxon['id'] is not None
    assert metadata_taxon['tenant_id'] == tenant.id


def test_add_metadata_taxon(client, jwt, session):
    """Test that metadata taxon can be added to a tenant."""
    tenant, headers = factory_taxon_requirements(jwt)
    response = client.post(f'/api/tenants/{tenant.short_name}/metadata/taxa',
                           headers=headers,
                           data=json.dumps(TestEngagementMetadataTaxonInfo.taxon1),
                           content_type=ContentType.JSON.value)
    assert response.status_code == HTTPStatus.CREATED
    assert response.json.get('id') is not None
    assert response.json.get('name') == TestEngagementMetadataTaxonInfo.taxon1['name']
    assert MetadataTaxonService.get_by_id(response.json.get('id')) is not None


def test_update_metadata_taxon(client, jwt, session):
    """Test that metadata taxon can be updated."""
    tenant, headers = factory_taxon_requirements(jwt)
    taxon = factory_metadata_taxon_model(tenant.id)
    data = TestEngagementMetadataTaxonInfo.taxon2
    del data['tenant_id']
    del data['position']
    response = client.patch(f'/api/tenants/{tenant.short_name}/metadata/taxon/{taxon.id}',
                            headers=headers,
                            data=json.dumps(data),
                            content_type=ContentType.JSON.value)
    assert response.status_code == HTTPStatus.OK
    assert response.json.get('id') is not None, response.json
    assert response.json.get('name') == TestEngagementMetadataTaxonInfo.taxon2['name']
    assert MetadataTaxonService.get_by_id(response.json.get('id')) is not None


def test_reorder_tenant_metadata_taxa(client, jwt, session):
    """Test that metadata taxa can be reordered."""
    tenant, headers = factory_taxon_requirements(jwt)
    taxon1 = factory_metadata_taxon_model(tenant.id, TestEngagementMetadataTaxonInfo.taxon1)
    taxon2 = factory_metadata_taxon_model(tenant.id, TestEngagementMetadataTaxonInfo.taxon2)
    taxon3 = factory_metadata_taxon_model(tenant.id, TestEngagementMetadataTaxonInfo.taxon3)
    assert all([taxon1 is not None, taxon2 is not None, taxon3 is not None])
    response = client.patch(f'/api/tenants/{tenant.short_name}/metadata/taxa',
                            headers=headers,
                            data=json.dumps({'taxon_ids': [
                                taxon3.id, taxon1.id, taxon2.id
                            ]}),
                            content_type=ContentType.JSON.value)
    assert response.status_code == HTTPStatus.OK, response.json
    assert len(response.json) == 3
    assert response.json[0].get('id') == taxon3.id
    assert response.json[1].get('id') == taxon1.id
    assert response.json[2].get('id') == taxon2.id
    assert MetadataTaxon.query.get(taxon3.id).position == 1
    assert MetadataTaxon.query.get(taxon1.id).position == 2
    assert MetadataTaxon.query.get(taxon2.id).position == 3


def test_delete_taxon(client, jwt, session):
    """Test that a metadata taxon can be deleted."""
    tenant, headers = factory_taxon_requirements(jwt)
    taxon = factory_metadata_taxon_model(tenant.id)
    assert metatada_taxon_service.get_by_id(taxon.id) is not None
    response = client.delete(f'/api/tenants/{tenant.short_name}/metadata/taxon/{taxon.id}',
                             headers=headers,
                             content_type=ContentType.JSON.value)
    assert response.status_code == HTTPStatus.NO_CONTENT
    assert metatada_taxon_service.get_by_id(taxon.id) is None
