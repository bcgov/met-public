"""Service for engagement management."""
from datetime import datetime

from met_api.constants.membership_type import MembershipType
from met_api.models.engagement_metadata import EngagementMetadataModel
from met_api.schemas.engagement_metadata import EngagementMetadataSchema
from met_api.services import authorization
from met_api.utils.roles import Role


class EngagementMetadataService:
    """Engagement metadata management service."""

    @staticmethod
    def get_metadata(engagement_id) -> EngagementMetadataSchema:
        """Get Engagement metadata by the id."""
        metadata_model: EngagementMetadataModel = EngagementMetadataModel.find_by_id(engagement_id)
        metadata = EngagementMetadataSchema().dump(metadata_model)
        return metadata

    @staticmethod
    def create_metadata(request_json: dict):
        """Create engagement metadata."""
        metadata_model = EngagementMetadataService._create_metadata_model(request_json)
        metadata_model.commit()
        return metadata_model.find_by_id(metadata_model.engagement_id)

    @staticmethod
    def _create_metadata_model(metadata: dict) -> EngagementMetadataModel:
        """Save engagement metadata."""
        new_metadata_model = EngagementMetadataModel(
            engagement_id=metadata.get('engagement_id', None),
            project_id=metadata.get('project_id', None),
            project_metadata=metadata.get('project_metadata', None),
            created_date=datetime.utcnow(),
            updated_date=None,
        )
        new_metadata_model.save()
        return new_metadata_model

    @staticmethod
    def update_metadata(data: dict):
        """Update engagement metadata partially."""
        engagement_id = data.get('engagement_id', None)
        authorization.check_auth(one_of_roles=(MembershipType.TEAM_MEMBER.name,
                                               Role.EDIT_ENGAGEMENT.value), engagement_id=engagement_id)
        if data:
            updated_metadata = EngagementMetadataModel.update(data)
            if not updated_metadata:
                updated_metadata = EngagementMetadataService._create_metadata_model(data)
        return EngagementMetadataModel.find_by_id(engagement_id)
