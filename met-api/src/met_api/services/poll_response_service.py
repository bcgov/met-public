"""Service for Poll Response management."""
from http import HTTPStatus
from sqlalchemy.exc import SQLAlchemyError
from met_api.exceptions.business_exception import BusinessException
from met_api.models.poll_responses import PollResponse as PollResponseModel
from met_api.services.poll_answers_service import PollAnswerService


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
            raise BusinessException(f'Error creating poll response: {e}',
                                    HTTPStatus.INTERNAL_SERVER_ERROR) from e

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
            raise BusinessException(f'Error creating poll response: {e}',
                                    HTTPStatus.INTERNAL_SERVER_ERROR) from e
