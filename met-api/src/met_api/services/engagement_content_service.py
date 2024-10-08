"""Service for engagement content management."""
from http import HTTPStatus

from met_api.constants.membership_type import MembershipType
from met_api.exceptions.business_exception import BusinessException
from met_api.models.engagement_content import EngagementContent as EngagementContentModel
from met_api.schemas.engagement_content import EngagementContentSchema
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
        return content_data

    @staticmethod
    def get_contents_by_engagement_id(engagement_id):
        """Get content by engagement id."""
        engagement_content_schema = EngagementContentSchema(many=True)
        engagement_content_records = EngagementContentModel.find_by_engagement_id(engagement_id)
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

        return EngagementContentSchema().dump(created_content)

    @staticmethod
    def _find_higest_sort_index(engagement_id):
        # find the highest sort order of the engagement content
        sort_index = 0
        contents = EngagementContentModel.find_by_engagement_id(engagement_id)
        if contents:
            # Find the largest in the existing engagement contents
            sort_index = max(content.sort_index for content in contents)
        return sort_index

    @staticmethod
    def _create_content(engagement_id, engagement_content_data: dict):
        engagement_content_model: EngagementContentModel = EngagementContentModel()
        engagement_content_model.engagement_id = engagement_id
        engagement_content_model.title = engagement_content_data.get('title')
        engagement_content_model.text_content = engagement_content_data.get('text_content')
        engagement_content_model.json_content = engagement_content_data.get('json_content')
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

        EngagementContentModel.bulk_update_engagement_content(engagement_content_sort_mappings)

    @staticmethod
    def _validate_engagement_content_ids(engagement_id, engagement_contents):
        """Validate if engagement content ids belong to the engagement."""
        eng_contents = EngagementContentModel.find_by_engagement_id(engagement_id)
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
