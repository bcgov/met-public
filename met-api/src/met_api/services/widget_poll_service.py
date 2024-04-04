"""Service for Widget Poll management."""
from http import HTTPStatus

from sqlalchemy.exc import SQLAlchemyError

from met_api.constants.engagement_status import Status as EngagementStatus
from met_api.constants.membership_type import MembershipType
from met_api.exceptions.business_exception import BusinessException
from met_api.models.widget_poll import Poll as PollModel
from met_api.services import authorization
from met_api.services.engagement_service import EngagementService
from met_api.services.poll_answers_service import PollAnswerService
from met_api.services.poll_response_service import PollResponseService
from met_api.utils.roles import Role


class WidgetPollService:
    """Service for managing WidgetPolls."""

    @staticmethod
    def get_polls_by_widget_id(widget_id: int):
        """Get polls by widget ID."""
        return PollModel.get_polls(widget_id)

    @staticmethod
    def get_poll_by_id(poll_id: int):
        """Get poll by poll ID."""
        poll = PollModel.query.get(poll_id)
        if not poll:
            raise BusinessException(
                'Poll widget not found', HTTPStatus.NOT_FOUND
            )
        return poll

    @staticmethod
    def create_poll(widget_id: int, poll_details: dict):
        """Create poll for the widget."""
        try:
            eng_id = poll_details.get('engagement_id')
            WidgetPollService._check_authorization(eng_id)
            return WidgetPollService._create_poll_model(
                widget_id, poll_details
            )
        except SQLAlchemyError as exc:
            raise BusinessException(str(exc), HTTPStatus.BAD_REQUEST) from exc

    @staticmethod
    def update_poll(widget_id: int, poll_widget_id: int, poll_data: dict):
        """Update poll widget."""
        try:
            widget_poll = WidgetPollService.get_poll_by_id(poll_widget_id)
            WidgetPollService._check_authorization(widget_poll.engagement_id)

            if widget_poll.widget_id != widget_id:
                raise BusinessException(
                    'Invalid widget ID', HTTPStatus.BAD_REQUEST
                )

            return WidgetPollService._update_poll_model(
                poll_widget_id, poll_data
            )
        except SQLAlchemyError as exc:
            raise BusinessException(str(exc), HTTPStatus.BAD_REQUEST) from exc

    @staticmethod
    def record_response(response_data: dict):
        """Record a response for a poll."""
        try:
            return PollResponseService.create_response(response_data)
        except SQLAlchemyError as exc:
            raise BusinessException(str(exc), HTTPStatus.BAD_REQUEST) from exc

    @staticmethod
    def check_already_polled(poll_id: int, ip_addr: str, count: int) -> bool:
        """Check if an IP has already polled more than the given count."""
        try:
            poll_count = PollResponseService.get_poll_count(poll_id, ip_addr)
            return poll_count >= count
        except SQLAlchemyError as exc:
            raise BusinessException(str(exc), HTTPStatus.BAD_REQUEST) from exc

    @staticmethod
    def is_poll_active(poll_id: int) -> bool:
        """Check if the poll is active."""
        try:
            poll = WidgetPollService.get_poll_by_id(poll_id)
            return poll.status == 'active'
        except SQLAlchemyError as exc:
            raise BusinessException(str(exc), HTTPStatus.BAD_REQUEST) from exc

    @staticmethod
    def is_poll_engagement_published(poll_id: int) -> bool:
        """Check if the poll is published."""
        try:
            poll = WidgetPollService.get_poll_by_id(poll_id)
            engagement = EngagementService().get_engagement(poll.engagement_id)
            pub_val = EngagementStatus.Published.value
            # Return False immediately if engagement is None
            if engagement is None:
                return False
            # Check if the engagement's status matches the published value
            return engagement.get('status_id') == pub_val
        except SQLAlchemyError as exc:
            raise BusinessException(str(exc), HTTPStatus.BAD_REQUEST) from exc

    @staticmethod
    def _create_poll_model(widget_id: int, poll_data: dict):
        """Private method to create poll model."""
        poll_model = PollModel.create_poll(widget_id, poll_data)
        WidgetPollService._handle_poll_answers(poll_model.id, poll_data)
        return poll_model

    @staticmethod
    def _update_poll_model(poll_id: int, poll_data: dict):
        """Private method to update poll model."""
        PollModel.update_poll(poll_id, poll_data)
        WidgetPollService._handle_poll_answers(poll_id, poll_data)
        return WidgetPollService.get_poll_by_id(poll_id)

    @staticmethod
    def _check_authorization(engagement_id):
        """Check user authorization."""
        authorization.check_auth(
            one_of_roles=(
                MembershipType.TEAM_MEMBER.name,
                Role.EDIT_ENGAGEMENT.value,
            ),
            engagement_id=engagement_id,
        )

    @staticmethod
    def _handle_poll_answers(poll_id: int, poll_data: dict):
        """Handle poll answers creation and deletion."""
        try:
            if 'answers' in poll_data and len(poll_data['answers']) > 0:
                PollAnswerService.delete_poll_answers(poll_id)
                answers_data = poll_data.get('answers', [])
                PollAnswerService.create_bulk_poll_answers(
                    poll_id, answers_data
                )
        except SQLAlchemyError as exc:
            raise BusinessException(str(exc), HTTPStatus.BAD_REQUEST) from exc
