"""Service for Poll Response management."""

from http import HTTPStatus
from typing import Callable
from sqlalchemy import func
from sqlalchemy.exc import SQLAlchemyError
from met_api.exceptions.business_exception import BusinessException
from met_api.models.poll_responses import PollResponse as PollResponseModel
from met_api.services.poll_answers_service import PollAnswerService
from met_api.models import Poll, PollAnswer, db
from met_api.services import authorization
from met_api.constants.membership_type import MembershipType
from met_api.utils.roles import Role

func: Callable


class PollResponseService:
    """Service for managing PollResponses."""

    @staticmethod
    def create_response(response_data: dict) -> PollResponseModel:
        """
        Create a poll response.

        Raises ValueError if the selected answer is not valid for the poll.
        """
        try:
            poll_id = response_data.get('poll_id')
            selected_answer_id = response_data.get('selected_answer_id')

            # Validate if the poll and answer are valid
            valid_answers = PollAnswerService.get_poll_answer(poll_id)
            if not any(answer.id == selected_answer_id for answer in valid_answers):
                raise BusinessException('Invalid selected answer for the poll.', HTTPStatus.BAD_REQUEST)

            # Create and save the poll response
            poll_response = PollResponseModel(**response_data)
            poll_response.save()
            return poll_response
        except SQLAlchemyError as e:
            # Log the exception or handle it as needed
            raise BusinessException(f'Error creating poll response: {e}', HTTPStatus.INTERNAL_SERVER_ERROR) from e

    @staticmethod
    def get_poll_count(poll_id: int, ip_addr: str = None) -> int:
        """
        Get the count of responses for a given poll.

        Optionally filters by participant IP.
        """
        try:
            responses = PollResponseModel.get_responses_by_participant_id(poll_id, ip_addr)
            return len(responses)
        except SQLAlchemyError as e:
            # Log the exception or handle it as needed
            raise BusinessException(f'Error creating poll response: {e}', HTTPStatus.INTERNAL_SERVER_ERROR) from e

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
    def get_poll_details_with_response_counts(poll_id):
        """
        Get poll details along with response counts for each answer for a specific poll.

        :param poll_id: The ID of the poll.
        :return: Poll details and response counts for each answer in a structured format.
        """
        poll = Poll.query.get(poll_id)
        if not poll:
            raise BusinessException('Poll not found', HTTPStatus.NOT_FOUND)
        # Check authorization
        PollResponseService._check_authorization(poll.engagement_id)

        # Query to join PollAnswer and PollResponse and count responses for each answer
        poll_data = (
            db.session.query(
                PollAnswer.id.label('answer_id'),
                PollAnswer.answer_text,
                func.count(PollResponseModel.selected_answer_id).label('response_count')
            )
            .select_from(PollAnswer)
            .outerjoin(PollResponseModel, PollAnswer.id == PollResponseModel.selected_answer_id)
            .filter(PollAnswer.poll_id == poll_id)
            .group_by(PollAnswer.id, PollAnswer.answer_text)
            .all()
        )

        # Calculate total responses
        total_responses = sum(response_count for _, _, response_count in poll_data)

        # Construct response dictionary
        response = {
            'poll_id': poll_id,
            'title': poll.title,
            'description': poll.description,
            'total_response': total_responses,
            'answers': [
                {
                    'answer_id': answer_id,
                    'answer_text': answer_text,
                    'total_response': response_count,
                    'percentage': (response_count / total_responses * 100) if total_responses > 0 else 0
                } for answer_id, answer_text, response_count in poll_data
            ]
        }

        return response
