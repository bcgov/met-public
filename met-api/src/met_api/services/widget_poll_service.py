"""Service for WidgetPoll management."""
from met_api.constants.membership_type import MembershipType
from met_api.models.widget_poll import Poll as PollModel
from met_api.services import authorization
from met_api.services.poll_answers_service import PollAnswerService
from met_api.utils.roles import Role


class WidgetPollService:
    """WidgetPoll management service."""

    @staticmethod
    def get_poll(widget_id: int):
        """Get poll by widget id."""
        widget_poll = PollModel.get_polls(widget_id)
        return widget_poll

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
    def update_poll(widget_id: int, poll_id: int, poll_data: dict):
        """Update poll widget."""
        widget_poll: PollModel = PollModel.find_by_id(poll_id)
        authorization.check_auth(one_of_roles=(MembershipType.TEAM_MEMBER.name,
                                 Role.EDIT_ENGAGEMENT.value),
                                 engagement_id=widget_poll.engagement_id)
        if not widget_poll:
            raise KeyError('Poll widget not found')

        if widget_poll.widget_id != widget_id:
            raise ValueError('Invalid widget ID')

        return WidgetPollService._update_poll_model(poll_id, poll_data)

    @staticmethod
    def _create_poll_model(widget_id: int, poll_data: dict):
        """
        Sample data format.

        {
        "title": "Favorite Programming Language",
        "description": "A poll to determine the most popular programming
                        language among our users.",
        "status": "active",
        "widget_id": 123,
        "engagement_id": 456,
        "answers": [
            {
            "answer_text": "Python"
            },
            {
            "answer_text": "Java"
            },
            {
            "answer_text": "JavaScript"
            },
            {
            "answer_text": "C#"
            }
        ]
        }
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
