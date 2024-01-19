"""Service for WidgetPoll management."""
from flask import current_app
from http import HTTPStatus
from met_api.constants.membership_type import MembershipType
from met_api.models.widget_poll import Poll as PollModel
from met_api.services import authorization
from met_api.services.poll_answers_service import PollAnswerService
from met_api.services.poll_response_service import PollResponseService
from met_api.utils.roles import Role
from met_api.exceptions.business_exception import BusinessException
from sqlalchemy.exc import IntegrityError


class WidgetPollService:
    """WidgetPoll management service."""

    @staticmethod
    def get_poll_by_widget_id(widget_id: int):
        """Get poll by widget id."""
        widget_poll = PollModel.get_polls(widget_id)
        return widget_poll

    @staticmethod
    def get_poll_by_id(poll_id: int):
        """Get poll by poll id."""
        poll = PollModel.query.get(poll_id)
        if not poll:
            raise KeyError('Poll widget not found')
        return poll

    @staticmethod
    def create_poll(widget_id: int, poll_details: dict):
        """Create poll for the widget."""
        poll_data = dict(poll_details)
        eng_id = poll_data.get('engagement_id')
        authorization.check_auth(one_of_roles=(
            MembershipType.TEAM_MEMBER.name, Role.EDIT_ENGAGEMENT.value),
            engagement_id=eng_id)

        widget_poll = WidgetPollService._create_poll_model(
            widget_id, poll_data)
        widget_poll.commit()
        return widget_poll

    @staticmethod
    def update_poll(widget_id: int, poll_widget_id: int, poll_data: dict):
        """Update poll widget."""
        widget_poll: PollModel = PollModel.query.get(poll_widget_id)
        authorization.check_auth(one_of_roles=(MembershipType.TEAM_MEMBER.name,
                                 Role.EDIT_ENGAGEMENT.value),
                                 engagement_id=widget_poll.engagement_id)
        if not widget_poll:
            raise KeyError('Poll widget not found')

        if widget_poll.widget_id != widget_id:
            raise ValueError('Invalid widget ID')

        return WidgetPollService._update_poll_model(poll_widget_id, poll_data)

    @staticmethod
    def _create_poll_model(widget_id: int, poll_data: dict):
        """
        Create poll model
        """
        # Create poll model object
        poll_model = PollModel.create_poll(widget_id, poll_data)

        answers_data = poll_data.get('answers', [])
        PollAnswerService.create_bulk_poll_answers(poll_model.id, answers_data)
        poll_model.flush()
        return poll_model

    @staticmethod
    def _update_poll_model(poll_id: int, poll_data: dict):
        PollModel.update_poll(poll_id, poll_data)
        PollAnswerService.delete_poll_answers(poll_id)
        answers_data = poll_data.get('answers', [])
        PollAnswerService.create_bulk_poll_answers(poll_id, answers_data)
        return WidgetPollService.get_poll_by_id(poll_id)

    @staticmethod
    def record_response(response_data: dict):
        """Record a response for a poll."""
        try:
            return PollResponseService.create_response(response_data)
        except IntegrityError as exc:
            current_app.logger.error(str(exc), exc)
            raise BusinessException(
                error="IntegrityError: Could not record the response",
                status_code=HTTPStatus.BAD_REQUEST)
        except ValueError as exc:
            current_app.logger.error(str(exc), exc)
            raise BusinessException(
                error="ValueError: Selected answer is not valid for the poll",
                status_code=HTTPStatus.BAD_REQUEST)
        except Exception as exc:
            current_app.logger.error(str(exc), exc)
            raise BusinessException(
                error="Could not record the response",
                status_code=HTTPStatus.BAD_REQUEST)

    @staticmethod
    def check_already_polled(poll_id: int, ip: str, count: int):
        """Check if an ip is polled for the given poll for more than the given count.
        @rtype: bool
        """
        try:
            poll = WidgetPollService.get_poll_by_id(poll_id)
            poll_count = PollResponseService.get_poll_count(poll.id, ip)
            if poll_count >= count:
                return True
            else:
                return False
        except Exception as exc:
            raise BusinessException(
                error=str(exc),
                status_code=HTTPStatus.BAD_REQUEST)

    @staticmethod
    def is_poll_active(poll_id: int) -> bool:
        """Check if the poll is active or not
        """

        try:
            poll = WidgetPollService.get_poll_by_id(poll_id)
            if poll.status == 'active':
                return True
            else:
                return False
        except Exception as exc:
            raise BusinessException(
                error=str(exc),
                status_code=HTTPStatus.BAD_REQUEST)

