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
"""Tests for the Org model.

Test suite to ensure that the Engagement model routines are working as expected.
"""

from faker import Faker

from met_api.models.engagement_metadata import EngagementMetadata, MetadataTaxon
from tests.utilities.factory_utils import factory_engagement_metadata_model, factory_metadata_requirements


fake = Faker()


def test_create_basic_engagement_metadata(session):
    """Assert that new engagement metadata can be created."""
    taxon, engagement, tenant, _ = factory_metadata_requirements()
    engagement_metadata = factory_engagement_metadata_model({
        'tenant_id': tenant.id,
        'engagement_id': engagement.id,
        'taxon_id': taxon.id,
        'value': fake.text(max_nb_chars=256)
    })
    assert engagement_metadata.id is not None, (
        'Engagement Metadata ID is missing')
    engagement_metadata_existing = EngagementMetadata.find_by_id(engagement_metadata.id)
    assert engagement_metadata.value == engagement_metadata_existing.value, (
        'Engagement Metadata value is missing or incorrect')


def test_engagement_metadata_relationships(session):
    """Assert that engagement metadata relationships are working."""
    taxon, engagement, tenant, _ = factory_metadata_requirements()
    assert tenant.id is not None, 'Tenant ID is missing'
    assert engagement.id is not None, 'Engagement ID is missing'
    assert taxon.id is not None, 'Taxon ID is missing'
    engagement_metadata: MetadataTaxon = factory_engagement_metadata_model(
        {
            'tenant_id': tenant.id,
            'engagement_id': engagement.id,
            'taxon_id': taxon.id,
            'value': fake.text(max_nb_chars=256)
        }
    )
    assert taxon == engagement_metadata.taxon, 'Taxon missing relation with engagement metadata'
    assert engagement == engagement_metadata.engagement, 'Engagement missing relation with metadata'
    assert tenant == engagement_metadata.tenant, 'Tenant missing relation with engagement metadata'
    assert tenant == taxon.tenant, 'Tenant missing relation with taxon'
    assert taxon in tenant.metadata_taxa, 'Taxon missing relation with tenant'
    assert engagement_metadata in taxon.entries, 'Engagement metadata missing relation with taxon'


def test_create_engagement_metadata(session):
    """Assert that metadata can be added to an engagement."""
    taxon, engagement, tenant, _ = factory_metadata_requirements()
    assert tenant.id is not None, 'Tenant ID is missing'
    assert engagement.id is not None, 'Engagement ID is missing'
    assert taxon.id is not None, 'Taxon ID is missing'
    engagement_metadata = factory_engagement_metadata_model({
        'tenant_id': tenant.id,
        'engagement_id': engagement.id,
        'taxon_id': taxon.id,
        'value': fake.text(max_nb_chars=256)
    })
    assert engagement_metadata.id is not None, 'Engagement Metadata ID is missing'
    engagement_metadata_existing = EngagementMetadata.find_by_id(engagement_metadata.id)
    assert engagement_metadata.value == engagement_metadata_existing.value, (
            'Engagement Metadata value is missing or incorrect')
    assert engagement_metadata.taxon_id == engagement_metadata_existing.taxon_id, (
            'Engagement Metadata taxon ID is missing or incorrect')
    assert engagement_metadata.engagement_id == engagement_metadata_existing.engagement_id, (
            'Engagement Metadata engagement ID is missing or incorrect')
