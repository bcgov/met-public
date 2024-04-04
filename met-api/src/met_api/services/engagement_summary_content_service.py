"""Service for engagement summary content management."""
from met_api.constants.membership_type import MembershipType
from met_api.models.engagement_summary_content import EngagementSummary as EngagementSummaryModel
from met_api.services import authorization
from met_api.utils.roles import Role


class EngagementSummaryContentService:
    """Engagement summary content management service."""

    @staticmethod
    def get_summary_content(content_id):
        """Get content by engagement summary content id."""
        summary_content = EngagementSummaryModel.get_summary_content(content_id)
        return summary_content

    @staticmethod
    def create_summary_content(content_id, summary_content_details: dict):
        """Create engagement summary content."""
        summary_content = dict(summary_content_details)
        eng_id = summary_content.get('engagement_id')
        authorization.check_auth(one_of_roles=(MembershipType.TEAM_MEMBER.name,
                                               Role.EDIT_ENGAGEMENT.value), engagement_id=eng_id)

        engagement_summary_content = EngagementSummaryContentService._create_summary_content_model(content_id,
                                                                                                   summary_content)
        engagement_summary_content.commit()
        return engagement_summary_content

    @staticmethod
    def _create_summary_content_model(content_id, summary_content: dict):
        summary_content_model: EngagementSummaryModel = EngagementSummaryModel()
        summary_content_model.engagement_content_id = content_id
        summary_content_model.engagement_id = summary_content.get('engagement_id')
        summary_content_model.content = summary_content.get('content')
        summary_content_model.rich_content = summary_content.get('rich_content')
        summary_content_model.flush()
        return summary_content_model

    @staticmethod
    def update_summary_content(content_id, request_json):
        """Update engagement summary content."""
        summary_content_list: EngagementSummaryModel = EngagementSummaryModel.get_summary_content(content_id)
        if not summary_content_list:
            raise KeyError('Engagement summary content ' + content_id + ' does not exist')

        summary_content = summary_content_list[0]
        eng_id = summary_content.engagement_id

        authorization.check_auth(one_of_roles=(MembershipType.TEAM_MEMBER.name,
                                               Role.EDIT_ENGAGEMENT.value), engagement_id=eng_id)

        return EngagementSummaryModel.update_summary_content(content_id, request_json)
