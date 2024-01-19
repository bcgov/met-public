"""Service for PollResponse management."""
from met_api.models.poll_responses import PollResponse as PollResponseModel
from met_api.services.poll_answers_service import PollAnswerService


class PollResponseService:
    """PollResponse management service."""

    @staticmethod
    def create_response(response_data: dict):
        """Create a poll response."""

        poll_answers = PollAnswerService.get_poll_answer(response_data['poll_id'])

        # Check if selected_answer_id exists in the returned PollAnswer objects
        if not any(poll_answer.id == response_data['selected_answer_id'] for poll_answer in poll_answers):
            raise ValueError('Poll is not valid for the selected answer.')

        # Create poll response object
        poll_response = PollResponseModel()
        for key, value in response_data.items():
            setattr(poll_response, key, value)

        poll_response.save()
        return poll_response

    @staticmethod
    def get_poll_count(poll_id: int, ip: str = None) -> int:
        """Get poll count"""
        poll_response = PollResponseModel.get_responses_by_participant_id(poll_id, ip)
        return len(poll_response)
