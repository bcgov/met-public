"""Service for PollAnswer management."""
from http import HTTPStatus

from sqlalchemy.exc import SQLAlchemyError

from met_api.exceptions.business_exception import BusinessException
from met_api.models.poll_answers import PollAnswer as PollAnswerModel


class PollAnswerService:
    """PollAnswer management service."""

    @staticmethod
    def get_poll_answer_by_id(answer_id: int):
        """Get poll answer by id."""
        poll_answer = PollAnswerModel.find_by_id(answer_id)
        if not poll_answer:
            raise BusinessException('Poll answer not found', HTTPStatus.NOT_FOUND)
        return poll_answer

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
        except SQLAlchemyError as e:
            raise BusinessException(str(e), HTTPStatus.INTERNAL_SERVER_ERROR) from e

    @staticmethod
    def delete_poll_answers(poll_id: int):
        """Delete poll answers for a given poll ID."""
        PollAnswerModel.delete_answers_by_poll_id(poll_id)
