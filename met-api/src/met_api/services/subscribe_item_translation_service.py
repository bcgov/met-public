"""Service for SubscribeItemTranslation management with authorization checks."""

from http import HTTPStatus

from sqlalchemy.exc import SQLAlchemyError

from met_api.constants.membership_type import MembershipType
from met_api.exceptions.business_exception import BusinessException
from met_api.models.subscribe_item_translation import SubscribeItemTranslation as SubscribeItemTranslationModel
from met_api.services import authorization
from met_api.services.widget_service import WidgetService
from met_api.services.widget_subscribe_service import WidgetSubscribeService
from met_api.utils.roles import Role


class SubscribeItemTranslationService:
    """SubscribeItemTranslation management service."""

    @staticmethod
    def get_by_id(translation_id: int):
        """Get subscribe item translation by ID."""
        return SubscribeItemTranslationModel.find_by_id(translation_id)

    @staticmethod
    def get_subscribe_item_translation(subscribe_item_id=None, language_id=None):
        """Get subscribe item translations by item ID and language ID."""
        return SubscribeItemTranslationModel.get_by_item_and_language(subscribe_item_id, language_id)

    @staticmethod
    def get_engagement_id(widget_subscribe_id):
        """Get engagement id widget_subscribe_id."""
        widget_subscribe = WidgetSubscribeService.get_by_id(widget_subscribe_id)
        if not widget_subscribe:
            raise BusinessException(
                status_code=HTTPStatus.NOT_FOUND,
                error='Subscribe widget not found',
            )
        widget = WidgetService.get_widget_by_id(widget_subscribe.widget_id)
        return widget.engagement_id

    @staticmethod
    def create_subscribe_item_translation(widget_subscribe_id: int, data: dict, pre_populate: bool = True):
        """Insert a new SubscribeItemTranslation with authorization check."""
        try:
            one_of_roles = (
                MembershipType.TEAM_MEMBER.name,
                Role.EDIT_ENGAGEMENT.value,
            )
            engagement_id = SubscribeItemTranslationService.get_engagement_id(widget_subscribe_id)
            authorization.check_auth(one_of_roles=one_of_roles, engagement_id=engagement_id)

            # Pre populating with Subscribe item base langauge data
            if pre_populate:
                subscribe_item = WidgetSubscribeService.get_subscribe_item_by_id(data['subscribe_item_id'])
                if not subscribe_item:
                    raise BusinessException('Subscribe item not found', HTTPStatus.NOT_FOUND)
                data['description'] = subscribe_item.description
                data['rich_description'] = subscribe_item.rich_description
                data['call_to_action_text'] = subscribe_item.call_to_action_text

            return SubscribeItemTranslationModel.create_sub_item_translation(data)
        except SQLAlchemyError as e:
            raise BusinessException(str(e), HTTPStatus.INTERNAL_SERVER_ERROR) from e

    @staticmethod
    def update_subscribe_item_translation(widget_subscribe_id: int, translation_id: int, data: dict):
        """Update an existing SubscribeItemTranslation with authorization check."""
        try:
            subscribe_item_translation = SubscribeItemTranslationModel.find_by_id(translation_id)
            if not subscribe_item_translation:
                raise BusinessException('SubscribeItemTranslation not found', HTTPStatus.NOT_FOUND)

            one_of_roles = (
                MembershipType.TEAM_MEMBER.name,
                Role.EDIT_ENGAGEMENT.value,
            )
            engagement_id = SubscribeItemTranslationService.get_engagement_id(widget_subscribe_id)
            authorization.check_auth(one_of_roles=one_of_roles, engagement_id=engagement_id)

            updated_translation = SubscribeItemTranslationModel.update_sub_item_translation(translation_id, data)
            return updated_translation
        except SQLAlchemyError as e:
            raise BusinessException(str(e), HTTPStatus.INTERNAL_SERVER_ERROR) from e

    @staticmethod
    def delete_subscribe_item_translation(widget_subscribe_id: int, translation_id: int):
        """Delete a SubscribeItemTranslation with authorization check."""
        try:
            subscribe_item_translation = SubscribeItemTranslationModel.find_by_id(translation_id)
            if not subscribe_item_translation:
                raise BusinessException('SubscribeItemTranslation not found', HTTPStatus.NOT_FOUND)

            one_of_roles = (
                MembershipType.TEAM_MEMBER.name,
                Role.EDIT_ENGAGEMENT.value,
            )
            engagement_id = SubscribeItemTranslationService.get_engagement_id(widget_subscribe_id)
            authorization.check_auth(
                one_of_roles=one_of_roles,
                engagement_id=engagement_id,
            )

            return SubscribeItemTranslationModel.delete_sub_item_translation(translation_id)
        except SQLAlchemyError as e:
            raise BusinessException(str(e), HTTPStatus.INTERNAL_SERVER_ERROR) from e
