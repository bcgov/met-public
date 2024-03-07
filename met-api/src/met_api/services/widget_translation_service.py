"""Service for widget translation management."""

from met_api.constants.membership_type import MembershipType
from met_api.models.widget import Widget as WidgetModel
from met_api.models.widget_map import WidgetMap as WidgetMapModel
from met_api.models.widget_poll import Poll as PollModel
from met_api.models.widget_translation import WidgetTranslation as WidgetTranslationModel
from met_api.models.widget_video import WidgetVideo as WidgetVideoModel
from met_api.schemas.widget_translation import WidgetTranslationSchema
from met_api.services import authorization
from met_api.utils.roles import Role


class WidgetTranslationService:
    """Widget translation management service."""

    @staticmethod
    def get_translation_by_widget_id_and_language_id(widget_id=None, language_id=None):
        """Get translation by widget id and language id."""
        widget_translation_schema = WidgetTranslationSchema(many=True)
        widgets_translation_records =\
            WidgetTranslationModel.get_translation_by_widget_id_and_language_id(widget_id, language_id)
        widget_translations = widget_translation_schema.dump(widgets_translation_records)
        return widget_translations

    @staticmethod
    def create_widget_translation(translation_data, engagement_id, is_default_language):
        """Create widget translation item."""
        one_of_roles = (
            MembershipType.TEAM_MEMBER.name,
            Role.EDIT_ENGAGEMENT.value
        )
        authorization.check_auth(one_of_roles=one_of_roles, engagement_id=engagement_id)

        if is_default_language:
            widget_id = translation_data.get('widget_id')
            WidgetTranslationService._get_default_language_values(widget_id, translation_data)

        created_widget_translation = WidgetTranslationModel.create_widget_translation(translation_data)
        return WidgetTranslationSchema().dump(created_widget_translation)

    @staticmethod
    def update_widget_translation(engagement_id, widget_translation_id: int, translation_data: dict):
        """Update widget translation."""
        WidgetTranslationService._verify_widget_translation(widget_translation_id)

        one_of_roles = (
            MembershipType.TEAM_MEMBER.name,
            Role.EDIT_ENGAGEMENT.value
        )
        authorization.check_auth(one_of_roles=one_of_roles, engagement_id=engagement_id)

        updated_widget_translation = WidgetTranslationModel.update_widget_translation(widget_translation_id,
                                                                                      translation_data)
        return WidgetTranslationSchema().dump(updated_widget_translation)

    @staticmethod
    def _verify_widget_translation(widget_translation_id):
        """Verify if widget translation exists."""
        widget_translation = WidgetTranslationModel.find_by_id(widget_translation_id)
        if not widget_translation:
            raise KeyError('Widget translation' + widget_translation_id + ' does not exist')
        return widget_translation

    @staticmethod
    def delete_widget_translation(engagement_id, widget_translation_id):
        """Remove widget translation."""
        one_of_roles = (
            MembershipType.TEAM_MEMBER.name,
            Role.EDIT_ENGAGEMENT.value
        )

        authorization.check_auth(one_of_roles=one_of_roles, engagement_id=engagement_id)

        widget_translation = WidgetTranslationModel.remove_widget_translation(widget_translation_id)
        if not widget_translation:
            raise ValueError('Widget translation to remove was not found')
        return widget_translation

    @staticmethod
    def _get_default_language_values(widget_id, translation_data):
        """Populate the default values."""
        default_widget = WidgetModel.find_by_id(widget_id)
        if default_widget:
            translation_data['title'] = default_widget.title

        default_widget_map = WidgetMapModel.get_map(widget_id)
        if default_widget_map:
            translation_data['map_marker_label'] = default_widget_map[0].marker_label
            translation_data['map_file_name'] = default_widget_map[0].file_name

        default_widget_poll = PollModel.get_polls(widget_id)
        if default_widget_poll:
            translation_data['poll_title'] = default_widget_poll[0].title
            translation_data['poll_description'] = default_widget_poll[0].description

        default_widget_video = WidgetVideoModel.get_video(widget_id)
        if default_widget_video:
            translation_data['video_url'] = default_widget_video[0].video_url
            translation_data['video_description'] = default_widget_video[0].description

        return translation_data
