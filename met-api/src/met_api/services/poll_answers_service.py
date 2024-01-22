"""Service for PollAnswer management."""
from met_api.models.poll_answers import PollAnswer as PollAnswerModel
from met_api.services import authorization
from met_api.utils.roles import Role
from met_api.exceptions.business_exception import BusinessException
from http import HTTPStatus

class PollAnswerService:
    """PollAnswer management service."""

    @staticmethod
    def get_poll_answer(poll_id):
        """Get poll answer by poll id."""
        poll_answer = PollAnswerModel.get_answers(poll_id)
        return poll_answer

    
    @staticmethod
    def create_bulk_poll_answers(poll_id: int, answers_data: list):
        """Bulk insert of poll answers."""
        try:
            if len(answers_data) > 0:
                PollAnswerModel.bulk_insert_answers(poll_id, answers_data)
        except Exception as e:
            raise BusinessException(str(e), HTTPStatus.INTERNAL_SERVER_ERROR)


    @staticmethod
    def delete_poll_answers(poll_id: int):
        """Delete poll answers for a given poll ID."""
        PollAnswerModel.delete_answers_by_poll_id(poll_id)
