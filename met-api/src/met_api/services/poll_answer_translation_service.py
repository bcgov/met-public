"""Service for PollAnswerTranslation management with authorization checks."""

from http import HTTPStatus

from sqlalchemy.exc import SQLAlchemyError

from met_api.constants.membership_type import MembershipType
from met_api.exceptions.business_exception import BusinessException
from met_api.models.poll_answer_translation import PollAnswerTranslation as PollAnswerTranslationModel
from met_api.services import authorization
from met_api.services.poll_answers_service import PollAnswerService
from met_api.services.widget_poll_service import WidgetPollService
from met_api.utils.roles import Role


class PollAnswerTranslationService:
    """PollAnswerTranslation management service."""

    @staticmethod
    def get_by_id(translation_id: int):
        """Get poll answer translations by id."""
        return PollAnswerTranslationModel.find_by_id(translation_id)

    @staticmethod
    def get_poll_answer_translation(poll_answer_id: int = None, language_id: int = None):
        """Get poll answer translations by answer ID and language ID."""
        return PollAnswerTranslationModel.get_by_answer_and_language(
            poll_answer_id, language_id
        )

    @staticmethod
    def create_poll_answer_translation(
        poll_id: int, data: dict, pre_populate: bool = True
    ):
        """Insert a new PollAnswerTranslation with authorization check."""
        try:
            poll = WidgetPollService.get_poll_by_id(poll_id)
            one_of_roles = (
                MembershipType.TEAM_MEMBER.name,
                Role.EDIT_ENGAGEMENT.value,
            )
            authorization.check_auth(
                one_of_roles=one_of_roles,
                engagement_id=poll.engagement_id,
            )

            if pre_populate:
                poll_answer = PollAnswerService.get_poll_answer_by_id(
                    data['poll_answer_id']
                )
                if not poll_answer:
                    raise BusinessException(
                        'PollAnswer not found', HTTPStatus.NOT_FOUND
                    )
                # prepopulate translation with base language data
                data['answer_text'] = poll_answer.answer_text

            return PollAnswerTranslationModel.create_poll_answer_translation(
                data
            )
        except SQLAlchemyError as e:
            raise BusinessException(
                str(e), HTTPStatus.INTERNAL_SERVER_ERROR
            ) from e

    @staticmethod
    def update_poll_answer_translation(poll_id: int, translation_id: int, data: dict):
        """Update an existing PollAnswerTranslation with authorization check."""
        try:
            poll_answer_translation = PollAnswerTranslationModel.find_by_id(translation_id)
            if not poll_answer_translation:
                raise BusinessException(
                    'PollAnswerTranslation not found', HTTPStatus.NOT_FOUND
                )

            poll = WidgetPollService.get_poll_by_id(poll_id)
            one_of_roles = (
                MembershipType.TEAM_MEMBER.name,
                Role.EDIT_ENGAGEMENT.value,
            )
            authorization.check_auth(
                one_of_roles=one_of_roles,
                engagement_id=poll.engagement_id,
            )

            updated_translation = (
                PollAnswerTranslationModel.update_poll_answer_translation(
                    translation_id, data
                )
            )
            return updated_translation
        except SQLAlchemyError as e:
            raise BusinessException(
                str(e), HTTPStatus.INTERNAL_SERVER_ERROR
            ) from e

    @staticmethod
    def delete_poll_answer_translation(poll_id: int, translation_id: int):
        """Delete a PollAnswerTranslation with authorization check."""
        try:
            poll_answer_translation = PollAnswerTranslationModel.find_by_id(translation_id)
            if not poll_answer_translation:
                raise ValueError(
                    'PollAnswerTranslation not found', HTTPStatus.NOT_FOUND
                )

            poll = WidgetPollService.get_poll_by_id(poll_id)
            one_of_roles = (
                MembershipType.TEAM_MEMBER.name,
                Role.EDIT_ENGAGEMENT.value,
            )
            authorization.check_auth(
                one_of_roles=one_of_roles,
                engagement_id=poll.engagement_id,
            )

            return PollAnswerTranslationModel.delete_poll_answer_translation(
                translation_id
            )
        except SQLAlchemyError as e:
            raise BusinessException(
                str(e), HTTPStatus.INTERNAL_SERVER_ERROR
            ) from e
