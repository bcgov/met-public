"""Service for engagement settings management."""
from met_api.constants.membership_type import MembershipType
from met_api.models.engagement_settings import EngagementSettingsModel
from met_api.schemas.engagement_settings import EngagementSettingsSchema
from met_api.services import authorization
from met_api.utils.roles import Role


class EngagementSettingsService:
    """Engagement settings management service."""

    @staticmethod
    def get(engagement_id) -> EngagementSettingsSchema:
        """Get Engagement settings by the id."""
        settings_model: EngagementSettingsModel = EngagementSettingsModel.find_by_id(engagement_id)
        settings = EngagementSettingsSchema().dump(settings_model)
        return settings

    @staticmethod
    def create_settings(request_json: dict):
        """Create engagement settings."""
        settings_model = EngagementSettingsService._create_settings_model(request_json)
        settings_model.commit()
        return settings_model.find_by_id(settings_model.engagement_id)

    @staticmethod
    def _create_settings_model(settings: dict) -> EngagementSettingsModel:
        """Save engagement settings."""
        new_settings_model = EngagementSettingsModel(
            engagement_id=settings.get('engagement_id', None),
            send_report=settings.get('send_report', False),
        )
        new_settings_model.save()
        return new_settings_model

    @staticmethod
    def update_settings(data: dict):
        """Update engagement settings partially."""
        engagement_id = data.get('engagement_id', None)
        
        authorization.check_auth(
            one_of_roles=(MembershipType.TEAM_MEMBER.name, Role.EDIT_ENGAGEMENT.value),
            engagement_id=engagement_id
        )

        saved_settings = EngagementSettingsModel.find_by_id(engagement_id)
        
        if saved_settings:
            updated_settings = EngagementSettingsModel.update(engagement_id, data)
        else:
            updated_settings = EngagementSettingsService._create_settings_model(data)

        return updated_settings
