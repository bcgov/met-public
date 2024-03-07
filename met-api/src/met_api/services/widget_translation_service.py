"""Service for widget translation management."""
from http import HTTPStatus

from sqlalchemy.exc import IntegrityError
from met_api.constants.membership_type import MembershipType
from met_api.constants.widget import WidgetType
from met_api.exceptions.business_exception import BusinessException
from met_api.models.language import Language as LanguageModel
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
    def create_widget_translation(translation_data, pre_populate=True):
        """Create widget translation item."""
        try:
            widget = WidgetModel.find_by_id(translation_data['widget_id'])
            if not widget:
                raise ValueError('Widget to translate was not found')

            one_of_roles = (
                MembershipType.TEAM_MEMBER.name,
                Role.EDIT_ENGAGEMENT.value
            )
            authorization.check_auth(one_of_roles=one_of_roles, engagement_id=widget.engagement_id)

            language_record = LanguageModel.find_by_id(translation_data['language_id'])
            if not language_record:
                raise ValueError('Language to translate was not found')

            if pre_populate:
                # prepopulate translation with base language data
                WidgetTranslationService._get_default_language_values(widget, translation_data)

            created_widget_translation = WidgetTranslationModel.create_widget_translation(translation_data)
            return WidgetTranslationSchema().dump(created_widget_translation)
        except IntegrityError as e:
            detail = (
                str(e.orig).split('DETAIL: ')[1]
                if 'DETAIL: ' in str(e.orig)
                else 'Duplicate entry.'
            )
            raise BusinessException(
                str(detail), HTTPStatus.INTERNAL_SERVER_ERROR
            ) from e

    @staticmethod
    def update_widget_translation(widget_id, widget_translation_id: int, translation_data: dict):
        """Update widget translation."""
        widget = WidgetModel.find_by_id(widget_id)
        if not widget:
            raise ValueError('Widget to translate was not found')

        WidgetTranslationService._verify_widget_translation(widget_translation_id)

        one_of_roles = (
            MembershipType.TEAM_MEMBER.name,
            Role.EDIT_ENGAGEMENT.value
        )
        authorization.check_auth(one_of_roles=one_of_roles, engagement_id=widget.engagement_id)

        updated_widget_translation = WidgetTranslationModel.update_widget_translation(widget_translation_id,
                                                                                      translation_data)
        return WidgetTranslationSchema().dump(updated_widget_translation)

    @staticmethod
    def delete_widget_translation(widget_id, widget_translation_id):
        """Remove widget translation."""
        widget = WidgetModel.find_by_id(widget_id)
        if not widget:
            raise ValueError('Widget to translate was not found')

        WidgetTranslationService._verify_widget_translation(widget_translation_id)

        one_of_roles = (
            MembershipType.TEAM_MEMBER.name,
            Role.EDIT_ENGAGEMENT.value
        )

        authorization.check_auth(one_of_roles=one_of_roles, engagement_id=widget.engagement_id)

        return WidgetTranslationModel.remove_widget_translation(widget_translation_id)

    @staticmethod
    def _verify_widget_translation(widget_translation_id):
        """Verify if widget translation exists."""
        widget_translation = WidgetTranslationModel.find_by_id(widget_translation_id)
        if not widget_translation:
            raise KeyError('Widget translation' + widget_translation_id + ' does not exist')
        return widget_translation

    @staticmethod
    def _get_default_language_values(widget, translation_data):
        """Populate the default values."""
        widget_type = widget.widget_type_id
        widget_id = widget.id
        translation_data['title'] = widget.title

        if widget_type == WidgetType.Map.value:
            widget_map = WidgetMapModel.get_map(widget_id)
            if widget_map:
                translation_data['map_marker_label'] = widget_map[0].marker_label
                translation_data['map_file_name'] = widget_map[0].file_name

        if widget_type == WidgetType.Poll.value:
            widget_poll = PollModel.get_polls(widget_id)
            if widget_poll:
                translation_data['poll_title'] = widget_poll[0].title
                translation_data['poll_description'] = widget_poll[0].description

        if widget_type == WidgetType.Video.value:
            widget_video = WidgetVideoModel.get_video(widget_id)
            if widget_video:
                translation_data['video_url'] = widget_video[0].video_url
                translation_data['video_description'] = widget_video[0].description

        return translation_data
