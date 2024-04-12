"""Service for engagement content management."""
from http import HTTPStatus
from flask import current_app

from met_api.constants.engagement_content_type import EngagementContentType
from met_api.constants.membership_type import MembershipType
from met_api.exceptions.business_exception import BusinessException
from met_api.models.engagement_content import EngagementContent as EngagementContentModel
from met_api.schemas.engagement_content import EngagementContentSchema
from met_api.services.engagement_custom_content_service import EngagementCustomContentService
from met_api.services import authorization
from met_api.utils.roles import Role


class EngagementContentService:
    """Engagement content management service."""

    @staticmethod
    def get_content_by_content_id(engagement_content_id):
        """Get content by content id."""
        content_data = {}
        engagement_content_record = EngagementContentModel.find_by_id(engagement_content_id)
        if not engagement_content_record:
            raise BusinessException(
                error='Engagement Content not found',
                status_code=HTTPStatus.NOT_FOUND
            )
        content_data['id'] = engagement_content_record.id
        content_data['title'] = engagement_content_record.title
        if engagement_content_record.content_type == EngagementContentType.Custom.name:
            custom_content_records = EngagementCustomContentService.get_custom_content(engagement_content_id)
            if custom_content_records:
                custom_record = custom_content_records[0]
                content_data['title'] = custom_record.get('title')
                content_data['custom_text_content'] = custom_record.get('custom_text_content')
                content_data['custom_json_content'] = custom_record.get('custom_json_content')
        return content_data

    @staticmethod
    def get_contents_by_engagement_id(engagement_id):
        """Get contents by engagement id."""
        engagement_content_schema = EngagementContentSchema(many=True)
        engagement_content_records = EngagementContentModel.get_contents_by_engagement_id(engagement_id)
        engagement_contents = engagement_content_schema.dump(engagement_content_records)
        return engagement_contents

    @staticmethod
    def create_engagement_content(engagement_content_data, engagement_id):
        """Create engagement content item."""
        one_of_roles = (
            MembershipType.TEAM_MEMBER.name,
            Role.EDIT_ENGAGEMENT.value
        )
        authorization.check_auth(one_of_roles=one_of_roles, engagement_id=engagement_id)

        if engagement_content_data.get('engagement_id', None) != int(engagement_id):
            raise ValueError('engagement content data has engagement id for a different engagement')

        sort_index = EngagementContentService._find_higest_sort_index(engagement_id)

        engagement_content_data['sort_index'] = sort_index + 1

        created_content = EngagementContentService._create_content(engagement_id, engagement_content_data)
        created_content.commit()

        if engagement_content_data.get('content_type') == EngagementContentType.Custom.name:
            EngagementContentService.create_default_custom_content(engagement_id, created_content.id)

        return EngagementContentSchema().dump(created_content)

    @staticmethod
    def create_default_custom_content(eng_id: int, eng_content_id: int):
        """Create default engagement custom content."""
        default_summary_content = {
            'engagement_id': eng_id
        }
        try:
            EngagementCustomContentService.create_custom_content(eng_content_id, default_summary_content)
        except Exception as exc:  # noqa: B902
            current_app.logger.error('Failed to create default engagement summary content', exc)
            raise BusinessException(
                error='Failed to create default engagement summary content.',
                status_code=HTTPStatus.INTERNAL_SERVER_ERROR) from exc

    @staticmethod
    def _find_higest_sort_index(engagement_id):
        # find the highest sort order of the engagement content
        sort_index = 0
        contents = EngagementContentModel.get_contents_by_engagement_id(engagement_id)
        if contents:
            # Find the largest in the existing engagement contents
            sort_index = max(content.sort_index for content in contents)
        return sort_index

    @staticmethod
    def _create_content(engagement_id, engagement_content_data: dict):
        engagement_content_model: EngagementContentModel = EngagementContentModel()
        engagement_content_model.engagement_id = engagement_id
        engagement_content_model.title = engagement_content_data.get('title')
        engagement_content_model.icon_name = engagement_content_data.get('icon_name')
        engagement_content_model.content_type = EngagementContentType[engagement_content_data.get('content_type')]
        engagement_content_model.sort_index = engagement_content_data.get('sort_index')
        engagement_content_model.is_internal = engagement_content_data.get('is_internal', False)
        engagement_content_model.flush()
        return engagement_content_model

    @staticmethod
    def sort_engagement_content(engagement_id, engagement_contents: list, user_id=None):
        """Sort engagement contents."""
        EngagementContentService._validate_engagement_content_ids(engagement_id, engagement_contents)

        one_of_roles = (
            MembershipType.TEAM_MEMBER.name,
            Role.EDIT_ENGAGEMENT.value
        )
        authorization.check_auth(one_of_roles=one_of_roles, engagement_id=engagement_id)

        engagement_content_sort_mappings = [{
            'id': engagement_content.get('id'),
            'sort_index': index + 1,
            'updated_by': user_id
        } for index, engagement_content in enumerate(engagement_contents)
        ]

        EngagementContentModel.update_engagement_contents(engagement_content_sort_mappings)

    @staticmethod
    def _validate_engagement_content_ids(engagement_id, engagement_contents):
        """Validate if engagement content ids belong to the engagement."""
        eng_contents = EngagementContentModel.get_contents_by_engagement_id(engagement_id)
        content_ids = [content.id for content in eng_contents]
        input_content_ids = [engagement_content.get('id') for engagement_content in engagement_contents]
        if len(set(content_ids) - set(input_content_ids)) > 0:
            raise BusinessException(
                error='Invalid engagement contents.',
                status_code=HTTPStatus.BAD_REQUEST)

    @staticmethod
    def delete_engagement_content(engagement_id, engagement_content_id):
        """Remove engagement content from engagement."""
        one_of_roles = (
            MembershipType.TEAM_MEMBER.name,
            Role.EDIT_ENGAGEMENT.value
        )

        authorization.check_auth(one_of_roles=one_of_roles, engagement_id=engagement_id)

        engagement_contents = EngagementContentModel.remove_engagement_content(engagement_id, engagement_content_id)
        if not engagement_contents:
            raise ValueError('Engagement content to remove was not found')
        return engagement_contents

    @staticmethod
    def update_engagement_content(engagement_id, engagement_content_id: list,
                                  engagement_content_data: dict, user_id=None):
        """Sort engagement contents."""
        EngagementContentService._verify_engagement_content(engagement_content_id)

        engagement_content_data['updated_by'] = user_id

        one_of_roles = (
            MembershipType.TEAM_MEMBER.name,
            Role.EDIT_ENGAGEMENT.value
        )
        authorization.check_auth(one_of_roles=one_of_roles, engagement_id=engagement_id)

        updated_engagement_content = EngagementContentModel.update_engagement_content(engagement_id,
                                                                                      engagement_content_id,
                                                                                      engagement_content_data)
        return EngagementContentSchema().dump(updated_engagement_content)

    @staticmethod
    def _verify_engagement_content(engagement_content_id):
        """Verify if engagement content exists."""
        engagement_content = EngagementContentModel.find_by_id(engagement_content_id)
        if not engagement_content:
            raise KeyError('Engagement content ' + engagement_content_id + ' does not exist')
        return engagement_content
