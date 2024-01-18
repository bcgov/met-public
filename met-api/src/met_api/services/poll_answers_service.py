"""Service for PollAnswer management."""
from met_api.models.poll_answers import PollAnswer as PollAnswerModel
from met_api.services import authorization
from met_api.utils.roles import Role

class PollAnswerService:
    """PollAnswer management service."""

    @staticmethod
    def get_poll_answer(poll_id):
        """Get poll answer by poll id."""
        poll_answer = PollAnswerModel.get_answers(poll_id)
        return poll_answer

    @staticmethod
    def create_poll_answer(poll_id, answer_details: dict):
        """Create poll answer for a poll."""
        answer_data = dict(answer_details)
        # Assume engagement_id is associated with the poll or answer for authorization
        eng_id = answer_data.get('engagement_id') 
        authorization.check_auth(one_of_roles=(Role.EDIT_ENGAGEMENT.value), engagement_id=eng_id)

        poll_answer = PollAnswerService.create_bulk_poll_answers(poll_id, answer_data)
        poll_answer.commit()
        return poll_answer
    
    @staticmethod
    def create_bulk_poll_answers(poll_id, answers_data):
        """Create multiple poll answers using bulk insert."""
        if answers_data:
            PollAnswerModel.bulk_insert_answers(poll_id, answers_data)

    @staticmethod
    def update_poll_answer(poll_id, answer_id, answer_data: dict):
        """Update poll answer."""
        poll_answer: PollAnswerModel = PollAnswerModel.query.get(answer_id)

        if not poll_answer:
            raise KeyError('Answer not found')

        if poll_answer.poll_id != poll_id:
            raise ValueError('Invalid poll and answer')

        for key, value in answer_data.items():
            setattr(poll_answer, key, value)
        poll_answer.save()
        return poll_answer

    @staticmethod
    def _create_poll_answer_model(poll_id, answer_data: dict):
        poll_answer_model: PollAnswerModel = PollAnswerModel()
        poll_answer_model.poll_id = poll_id
        poll_answer_model.answer_text = answer_data.get('answer_text')
        poll_answer_model.flush()
        return poll_answer_model
    
    @staticmethod
    def delete_poll_answers(poll_id: int):
        """Delete poll answers for a given poll ID."""
        PollAnswerModel.delete_answers_by_poll_id(poll_id)
