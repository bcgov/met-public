"""Service for engagement management."""

from typing import List, Optional, Union

from met_api.models import db
from met_api.models.db import transactional
from met_api.models.engagement_metadata import MetadataTaxon
from met_api.models.tenant import Tenant
from met_api.schemas.engagement_metadata import MetadataTaxonSchema


class MetadataTaxonService:
    """Metadata taxon management service."""

    @staticmethod
    def get_by_id(taxon_id: int) -> Optional[dict]:
        """Get a taxon by id."""
        taxon = MetadataTaxon.query.get(taxon_id)
        if not taxon:
            return None
        return dict(MetadataTaxonSchema().dump(taxon))

    @staticmethod
    def get_by_tenant(tenant_id: int) -> List[dict]:
        """Get all taxa for a tenant."""
        tenant = Tenant.query.get(tenant_id)
        results = tenant.metadata_taxa if tenant else []
        sorted_results = sorted(results, key=lambda taxon: taxon.position)
        return MetadataTaxonSchema(many=True).dump(sorted_results)

    @staticmethod
    def create(tenant_id: int, taxon_data: dict) -> dict:
        """Create a new taxon."""
        taxon_data['tenant_id'] = tenant_id
        taxon: MetadataTaxon = MetadataTaxonSchema().load(taxon_data, session=db.session)
        taxon.position = MetadataTaxon.query.filter_by(tenant_id=tenant_id).count() + 1
        taxon.save()
        return dict(MetadataTaxonSchema().dump(taxon))

    @staticmethod
    def update(taxon_id: int, taxon_data: dict) -> Union[dict, list]:
        """Update a taxon."""
        taxon = MetadataTaxon.query.get(taxon_id)
        if not taxon:
            raise KeyError(f'Taxon with id {taxon_id} does not exist.')
        schema = MetadataTaxonSchema()
        taxon = schema.load(taxon_data, session=db.session, instance=taxon)
        taxon.save()
        return schema.dump(taxon)

    @staticmethod
    @transactional()
    def reorder_tenant(tenant_id: int, taxon_ids: List[int]) -> List[dict]:
        """
        Reorder Tenant.

        Reorder all taxa within a specific tenant based on a provided list of taxon IDs,
        setting their positions accordingly.
        """
        # get all taxa for the tenant
        tenant = Tenant.query.get(tenant_id)
        if not tenant:
            raise KeyError(f'Tenant with id {tenant_id} does not exist.')
        taxa: List[MetadataTaxon] = list(tenant.metadata_taxa)
        # create a dictionary of taxon IDs to taxon objects
        taxon_dict = {taxon.id: taxon for taxon in taxa}
        # iterate through the provided taxon IDs and update their positions
        for index, taxon_id in enumerate(taxon_ids):
            taxon = taxon_dict[taxon_id]
            taxon.position = index + 1
        # return MetadataTaxonService.get_by_tenant(tenant_id)
        # It's possible that method was called with a list of taxon IDs that is not
        # contiguous, so we need to ensure that all taxa have a valid position
        return MetadataTaxonService.auto_order_tenant(tenant_id)

    @staticmethod
    @transactional()
    def auto_order_tenant(tenant_id: int) -> List[dict]:
        """
        Automatically order all taxa within a specific tenant based on their current positions.

        This has the benefit of ensuring that the position
        indices are contiguous and that there are no gaps or duplicates. The
        new ordering will be as close to the original as possible.
        """
        tenant = Tenant.query.get(tenant_id)
        schema = MetadataTaxonSchema()
        taxon_ordered = sorted(tenant.metadata_taxa, key=lambda taxon: taxon.position)
        for index, taxon in enumerate(taxon_ordered):
            taxon.position = index + 1
        return schema.dump(taxon_ordered, many=True)

    @staticmethod
    @transactional()
    def delete(taxon_id: int) -> None:
        """Delete a taxon."""
        taxon: MetadataTaxon = MetadataTaxon.query.get(taxon_id)
        if not taxon:
            raise KeyError(f'Taxon with id {taxon_id} does not exist.')
        taxon.delete()
