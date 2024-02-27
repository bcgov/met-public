"""Service for engagement custom content management."""
from met_api.constants.membership_type import MembershipType
from met_api.models.engagement_custom_content import EngagementCustom as EngagementCustomModel
from met_api.services import authorization
from met_api.utils.roles import Role


class EngagementCustomContentService:
    """Engagement custom content management service."""

    @staticmethod
    def get_custom_content(content_id):
        """Get content by engagement custom content id."""
        custom_content = EngagementCustomModel.get_custom_content(content_id)
        return custom_content

    @staticmethod
    def create_custom_content(content_id, custom_content_details: dict):
        """Create engagement custom content."""
        custom_content = dict(custom_content_details)
        eng_id = custom_content.get('engagement_id')
        authorization.check_auth(one_of_roles=(MembershipType.TEAM_MEMBER.name,
                                               Role.EDIT_ENGAGEMENT.value), engagement_id=eng_id)

        engagement_custom_content = EngagementCustomContentService._create_custom_content_model(content_id,
                                                                                                custom_content)
        engagement_custom_content.commit()
        return engagement_custom_content

    @staticmethod
    def _create_custom_content_model(content_id, custom_content: dict):
        custom_content_model: EngagementCustomModel = EngagementCustomModel()
        custom_content_model.engagement_content_id = content_id
        custom_content_model.engagement_id = custom_content.get('engagement_id')
        custom_content_model.custom_text_content = custom_content.get('custom_text_content')
        custom_content_model.custom_json_content = custom_content.get('custom_json_content')
        custom_content_model.flush()
        return custom_content_model

    @staticmethod
    def update_custom_content(content_id, request_json):
        """Update engagement custom content."""
        custom_content_list: EngagementCustomModel = EngagementCustomModel.get_custom_content(content_id)
        if not custom_content_list:
            raise KeyError('Engagement custom content ' + content_id + ' does not exist')

        custom_content = custom_content_list[0]
        eng_id = custom_content.engagement_id

        authorization.check_auth(one_of_roles=(MembershipType.TEAM_MEMBER.name,
                                               Role.EDIT_ENGAGEMENT.value), engagement_id=eng_id)

        return EngagementCustomModel.update_custom_content(content_id, request_json)
