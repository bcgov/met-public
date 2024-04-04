"""Service for EventItemTranslation management with authorization checks."""

from http import HTTPStatus

from sqlalchemy.exc import SQLAlchemyError

from met_api.constants.membership_type import MembershipType
from met_api.exceptions.business_exception import BusinessException
from met_api.models.event_item_translation import EventItemTranslation as EventItemTranslationModel
from met_api.services import authorization
from met_api.services.widget_events_service import WidgetEventsService
from met_api.services.widget_service import WidgetService
from met_api.utils.roles import Role


class EventItemTranslationService:
    """EventItemTranslation management service."""

    @staticmethod
    def get_by_id(translation_id: int):
        """Get event item translation by ID."""
        return EventItemTranslationModel.find_by_id(translation_id)

    @staticmethod
    def get_engagement_id(event_id):
        """Get engagement id using event id."""
        widget_event = WidgetEventsService.get_by_id(event_id)
        if not widget_event:
            raise BusinessException(
                status_code=HTTPStatus.NOT_FOUND,
                error='Event not found',
            )
        widget = WidgetService.get_widget_by_id(widget_event.widget_id)
        return widget.engagement_id

    @staticmethod
    def get_event_item_translation(event_item_id=None, language_id=None):
        """Get event item translations by item ID and language ID."""
        return EventItemTranslationModel.get_by_item_and_language(
            event_item_id, language_id
        )

    @staticmethod
    def create_event_item_translation(event_id: int, data: dict, pre_populate: bool = True):
        """Insert a new EventItemTranslation with authorization check."""
        try:
            one_of_roles = (
                MembershipType.TEAM_MEMBER.name,
                Role.EDIT_ENGAGEMENT.value,
            )
            engagement_id = EventItemTranslationService.get_engagement_id(
                event_id
            )
            authorization.check_auth(
                one_of_roles=one_of_roles, engagement_id=engagement_id
            )
            # Pre populating with event item base langauge data
            if pre_populate:
                event_item = WidgetEventsService.get_event_item_by_id(data['event_item_id'])
                if not event_item:
                    raise BusinessException(
                        'EventItem not found', HTTPStatus.NOT_FOUND
                    )
                data['description'] = event_item.description
                data['location_name'] = event_item.location_name
                data['location_address'] = event_item.location_address
                data['url'] = event_item.url
                data['url_label'] = event_item.url_label

            return EventItemTranslationModel.create_event_item_translation(
                data
            )
        except SQLAlchemyError as e:
            raise BusinessException(
                str(e), HTTPStatus.INTERNAL_SERVER_ERROR
            ) from e

    @staticmethod
    def update_event_item_translation(event_id: int, translation_id: int, data: dict):
        """Update an existing EventItemTranslation with authorization check."""
        try:
            event_item_translation = EventItemTranslationModel.find_by_id(translation_id)
            if not event_item_translation:
                raise BusinessException(
                    'EventItemTranslation not found', HTTPStatus.NOT_FOUND
                )

            one_of_roles = (
                MembershipType.TEAM_MEMBER.name,
                Role.EDIT_ENGAGEMENT.value,
            )
            engagement_id = EventItemTranslationService.get_engagement_id(
                event_id
            )
            authorization.check_auth(
                one_of_roles=one_of_roles, engagement_id=engagement_id
            )

            updated_translation = (
                EventItemTranslationModel.update_event_item_translation(
                    translation_id, data
                )
            )
            return updated_translation
        except SQLAlchemyError as e:
            raise BusinessException(
                str(e), HTTPStatus.INTERNAL_SERVER_ERROR
            ) from e

    @staticmethod
    def delete_event_item_translation(event_id: int, translation_id: int):
        """Delete an EventItemTranslation with authorization check."""
        try:
            event_item_translation = EventItemTranslationModel.find_by_id(translation_id)
            if not event_item_translation:
                raise BusinessException(
                    'EventItemTranslation not found', HTTPStatus.NOT_FOUND
                )

            one_of_roles = (
                MembershipType.TEAM_MEMBER.name,
                Role.EDIT_ENGAGEMENT.value,
            )
            engagement_id = EventItemTranslationService.get_engagement_id(
                event_id
            )
            authorization.check_auth(
                one_of_roles=one_of_roles,
                engagement_id=engagement_id,
            )

            return EventItemTranslationModel.delete_event_item_translation(translation_id)
        except SQLAlchemyError as e:
            raise BusinessException(
                str(e), HTTPStatus.INTERNAL_SERVER_ERROR
            ) from e
