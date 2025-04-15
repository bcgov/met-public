"""Service for Widget Listening management."""
from http import HTTPStatus
from typing import Optional

from met_api.constants.membership_type import MembershipType
from met_api.exceptions.business_exception import BusinessException
from met_api.models.widget_listening import WidgetListening as WidgetListeningModel
from met_api.services import authorization
from met_api.utils.roles import Role


class WidgetListeningService:
    """Widget Listening management service."""

    @staticmethod
    def get_listening_by_id(listening_id: int):
        """Get listening by id."""
        widget_listening = WidgetListeningModel.find_by_id(listening_id)
        return widget_listening

    @staticmethod
    def get_listening(widget_id: int):
        """Get listening by widget id."""
        widget_listening = WidgetListeningModel.get_listening(widget_id)
        return widget_listening

    @staticmethod
    def create_listening(widget_id: int, listening_details: dict):
        """Create listening for the widget."""
        listening_data = dict(listening_details)
        eng_id = listening_data.get('engagement_id')
        authorization.check_auth(one_of_roles=(MembershipType.TEAM_MEMBER.name,
                                               Role.EDIT_ENGAGEMENT.value), engagement_id=eng_id)

        widget_listening = WidgetListeningService._create_listening_model(widget_id, listening_data)
        widget_listening.commit()
        return widget_listening

    @staticmethod
    def update_listening(widget_id: int, listening_id: int, listening_data: dict) -> Optional[WidgetListeningModel]:
        """Update listening widget."""
        engagement_id = listening_data.get('engagement_id')

        WidgetListeningService._check_update_listening_auth(engagement_id)

        widget_listening: WidgetListeningModel = WidgetListeningModel.find_by_id(listening_id)

        if not widget_listening:
            raise BusinessException(
                error='Who is Listening widget not found',
                status_code=HTTPStatus.BAD_REQUEST)

        if widget_listening.widget_id != widget_id:
            raise BusinessException(
                error='Invalid widget ID',
                status_code=HTTPStatus.BAD_REQUEST)

        if widget_listening.id != listening_id:
            raise BusinessException(
                error='Invalid Who is Listening widget ID',
                status_code=HTTPStatus.BAD_REQUEST)

        WidgetListeningService._update_widget_listening(widget_listening, listening_data)

        return widget_listening

    @staticmethod
    def _check_update_listening_auth(engagement_id):
        authorization.check_auth(one_of_roles=(MembershipType.TEAM_MEMBER.name,
                                               Role.EDIT_ENGAGEMENT.value), engagement_id=engagement_id)

    @staticmethod
    def _update_widget_listening(widget_listening: WidgetListeningModel, listening_data: dict):
        widget_listening.description = listening_data.get('description')
        widget_listening.save()

    @staticmethod
    def _create_listening_model(widget_id: int, listening_data: dict):
        listening_model: WidgetListeningModel = WidgetListeningModel()
        listening_model.widget_id = widget_id
        listening_model.engagement_id = listening_data.get('engagement_id')
        listening_model.description = listening_data.get('description')
        listening_model.flush()
        return listening_model
