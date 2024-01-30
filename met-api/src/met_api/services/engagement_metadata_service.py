"""Service for engagement management."""

from typing import List, Optional
from met_api.models import db
from met_api.models.db import transactional
from met_api.models.engagement import Engagement as EngagementModel
from met_api.models.engagement_metadata import EngagementMetadata, MetadataTaxon
from met_api.schemas.engagement_metadata import EngagementMetadataSchema


class EngagementMetadataService:
    """Engagement metadata management service."""

    @staticmethod
    def get(metadata_id) -> dict:
        """
        Get engagement metadata by id.

        Args:
            id: The ID of the engagement metadata.
        Returns:
            A serialized point of engagement metadata.
        Raises:
            HTTP 404 error if the engagement metadata is not found.
            Authorization error if the user does not have the required role.
        """
        engagement_metadata = EngagementMetadata.query.get(metadata_id)
        if not engagement_metadata:
            raise KeyError(f'Engagement metadata with id {metadata_id} does not exist.')
        return dict(EngagementMetadataSchema().dump(engagement_metadata))

    @staticmethod
    def get_by_engagement(engagement_id) -> List[dict]:
        """
        Get metadata by engagement id.

        Args:
            engagement_id: The ID of the engagement.
        Returns:
            A list of serialized engagement metadata points.
        Raises:
            HTTP 404 error if the engagement is not found.
        """
        engagement_model = EngagementModel.query.get(engagement_id)
        if not engagement_model:
            raise KeyError(f'Engagement with id {engagement_id} does not exist.')
        return EngagementMetadataSchema(many=True).dump(engagement_model.metadata)

    @staticmethod
    def check_association(engagement_id, metadata_id) -> bool:
        """
        Check if some metadata is actually associated with an engagement.

        Used to prevent users from accessing metadata that does not belong to
        an engagement they have access to.
        Args:
            engagement_id: The ID of the engagement.
            metadata_id: The ID of the metadata.
        Returns:
            True if the metadata is associated with the engagement, False otherwise.
        """
        engagement_metadata = EngagementMetadata.query.get(metadata_id)
        if not engagement_metadata:
            raise KeyError(f'Engagement metadata with id {metadata_id} does not exist.')
        return engagement_metadata.engagement_id == engagement_id

    @staticmethod
    @transactional(database=db)
    def create(engagement_id: int, taxon_id: int, value: str) -> dict:
        """
        Create engagement metadata.

        Args:
            engagement_id: The ID of the engagement.
            taxon_id: The ID of the metadata taxon.
            value: The value of the metadata.
        Returns:
            The created metadata.
        """
        # Ensure that the engagement exists, or else raise the appropriate error
        engagement = EngagementModel.query.get(engagement_id)
        if not engagement:
            raise KeyError(f'Engagement with id {engagement_id} does not exist.')
        taxon = MetadataTaxon.query.get(taxon_id)
        if not taxon:
            raise ValueError(f'Taxon with id {taxon_id} does not exist.')
        if engagement.tenant.id != taxon.tenant.id:
            raise ValueError(f'Taxon {taxon} does not belong to tenant {engagement.tenant}')
        metadata = {
            'engagement_id': engagement_id,
            'taxon_id': taxon_id,
            'value': value,
        }
        engagement_metadata = EngagementMetadataSchema().load(
            metadata, session=db.session
        )
        db.session.add(engagement_metadata)  # type: ignore
        engagement_metadata.save()
        return dict(EngagementMetadataSchema().dump(engagement_metadata))

    def create_for_engagement(self, engagement_id: int, metadata: dict, **kwargs) -> Optional[dict]:
        """
        Create engagement metadata.

        Args:
            engagement_id: The ID of the engagement.
            metadata: The point of engagement metadata to create.
        Returns:
            The created metadata.
        """
        metadata = metadata or {}
        metadata = self.create(metadata, engagement_id, **kwargs)

    @staticmethod
    def create_defaults(engagement_id: int, tenant_id: int) -> List[dict]:
        """Create default metadata for an engagement."""
        # Get metadata taxa for the tenant
        taxa = MetadataTaxon.query.filter_by(tenant_id=tenant_id).all()
        # Create a list of metadata to create
        metadata = []
        for taxon in taxa:
            if taxon.default_value:
                metadata.append(EngagementMetadataService.create(
                    engagement_id,
                    taxon.id,
                    taxon.default_value))
        return metadata

    @staticmethod
    @transactional()
    def update(metadata_id: int, value: str) -> dict:
        """
        Update engagement metadata.

        Args:
            id: The ID of the engagement metadata.
            metadata: The fields to update.
        Returns:
            The updated metadata.
        """
        metadata = EngagementMetadata.query.get(metadata_id)
        if not metadata:
            raise KeyError(f'Engagement metadata with id {metadata_id}'
                           ' does not exist.')
        metadata.value = value
        return dict(EngagementMetadataSchema().dump(metadata, many=False))

    @staticmethod
    @transactional()
    def delete(metadata_id: int) -> None:
        """
        Delete engagement metadata.

        Args:
            id: The ID of the engagement metadata.
        """
        metadata = EngagementMetadata.query.get(metadata_id)
        if not metadata:
            raise KeyError(f'Engagement metadata with id {metadata_id}'
                           ' does not exist.')
        db.session.delete(metadata)  # type: ignore
