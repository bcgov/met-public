"""Service for engagement management."""
from datetime import datetime

from met_api.constants.engagement_status import Status
from met_api.constants.membership_type import MembershipType
from met_api.models.engagement import Engagement as EngagementModel
from met_api.models.engagement_metadata import EngagementMetadataModel
from met_api.schemas.engagement_metadata import EngagementMetadataSchema
from met_api.services import authorization
from met_api.services.project_service import ProjectService
from met_api.utils.roles import Role


class EngagementMetadataService:
    """Engagement metadata management service."""

    @staticmethod
    def get_metadata(engagement_id) -> EngagementMetadataSchema:
        """Get Engagement metadata by the id."""
        engagement_model: EngagementModel = EngagementModel.find_by_id(engagement_id)
        if engagement_model.status_id in (Status.Draft.value, Status.Scheduled.value):
            one_of_roles = (
                MembershipType.TEAM_MEMBER.name,
                Role.VIEW_ALL_ENGAGEMENTS.value
            )
            authorization.check_auth(one_of_roles=one_of_roles, engagement_id=engagement_id)

        metadata_model: EngagementMetadataModel = EngagementMetadataModel.find_by_id(engagement_id)
        metadata = EngagementMetadataSchema().dump(metadata_model)
        return metadata

    @staticmethod
    def create_metadata(request_json: dict):
        """Create engagement metadata."""
        if engagement_id := request_json.get('engagement_id', None):
            one_of_roles = (
                MembershipType.TEAM_MEMBER.name,
                Role.CREATE_ENGAGEMENT.value
            )
            authorization.check_auth(one_of_roles=one_of_roles, engagement_id=engagement_id)

        metadata_model = EngagementMetadataService._create_metadata_model(request_json)
        metadata_model.commit()
        updated_metadata: EngagementMetadataModel = metadata_model.find_by_id(metadata_model.engagement_id)
        # publish changes to EPIC
        ProjectService.update_project_info(updated_metadata.project_id, updated_metadata.engagement_id)
        return updated_metadata

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
        if not engagement_id:
            raise KeyError('Engagement id is required.')

        authorization.check_auth(
            one_of_roles=(MembershipType.TEAM_MEMBER.name, Role.EDIT_ENGAGEMENT.value),
            engagement_id=engagement_id
        )

        saved_metadata = EngagementMetadataModel.find_by_id(engagement_id)

        if saved_metadata:
            updated_metadata = EngagementMetadataModel.update(data)
        else:
            updated_metadata = EngagementMetadataService._create_metadata_model(data)

        # publish changes to EPIC
        ProjectService.update_project_info(updated_metadata.project_id, updated_metadata.engagement_id)

        return updated_metadata
