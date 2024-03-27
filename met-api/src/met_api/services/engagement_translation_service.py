"""Service for engagement translation management."""
from http import HTTPStatus

from sqlalchemy.exc import IntegrityError
from met_api.constants.engagement_status import SubmissionStatus
from met_api.constants.membership_type import MembershipType
from met_api.exceptions.business_exception import BusinessException
from met_api.models.engagement import Engagement as EngagementModel
from met_api.models.engagement_slug import EngagementSlug as EngagementSlugModel
from met_api.models.engagement_status_block import EngagementStatusBlock as EngagementStatusBlockModel
from met_api.models.engagement_summary_content import EngagementSummary as EngagementSummaryModel
from met_api.models.engagement_translation import EngagementTranslation as EngagementTranslationModel
from met_api.models.language import Language as LanguageModel
from met_api.schemas.engagement_translation import EngagementTranslationSchema
from met_api.services import authorization
from met_api.utils.roles import Role


class EngagementTranslationService:
    """Engagement translation management service."""

    @staticmethod
    def get_engagement_translation_by_id(engagement_translation_id):
        """Get engagement translation by id."""
        engagement_translation_record = EngagementTranslationModel.find_by_id(
            engagement_translation_id
        )
        return engagement_translation_record

    @staticmethod
    def get_translation_by_engagement_and_language(engagement_id=None, language_id=None):
        """Get engagement translation by engagement id and/or language id."""
        engagement_translation_schema = EngagementTranslationSchema(many=True)
        engagement_translation_records =\
            EngagementTranslationModel.get_engagement_translation_by_engagement_and_language(engagement_id,
                                                                                             language_id)
        engagement_translations = engagement_translation_schema.dump(engagement_translation_records)
        return engagement_translations

    @staticmethod
    def create_engagement_translation(translation_data, pre_populate=True):
        """Create engagement translation."""
        try:
            engagement = EngagementModel.find_by_id(translation_data['engagement_id'])
            summary_content = EngagementSummaryModel.get_summary_content_by_engagement_id(
                translation_data['engagement_id'])
            if not engagement:
                raise ValueError('Engagement to translate was not found')

            one_of_roles = (
                MembershipType.TEAM_MEMBER.name,
                Role.EDIT_ENGAGEMENT.value
            )
            authorization.check_auth(one_of_roles=one_of_roles, engagement_id=engagement.id)

            language_record = LanguageModel.find_by_id(translation_data['language_id'])
            if not language_record:
                raise ValueError('Language to translate was not found')

            if pre_populate:
                # prepopulate translation with base language data
                EngagementTranslationService._get_default_language_values(engagement,
                                                                          summary_content,
                                                                          translation_data)

            created_engagement_translation = EngagementTranslationModel.create_engagement_translation(
                translation_data)
            return EngagementTranslationSchema().dump(created_engagement_translation)
        except IntegrityError as e:
            detail = (
                str(e.orig).split('DETAIL: ')[1]
                if 'DETAIL: ' in str(e.orig)
                else 'Duplicate entry.'
            )
            raise BusinessException(
                str(detail), HTTPStatus.INTERNAL_SERVER_ERROR
            ) from e

    @staticmethod
    def update_engagement_translation(engagement_id, engagement_translation_id: int, translation_data: dict):
        """Update engagement translation."""
        engagement = EngagementModel.find_by_id(engagement_id)
        if not engagement:
            raise ValueError('Engagement to translate was not found')

        EngagementTranslationService._verify_engagement_translation(engagement_translation_id)

        one_of_roles = (
            MembershipType.TEAM_MEMBER.name,
            Role.EDIT_ENGAGEMENT.value
        )
        authorization.check_auth(one_of_roles=one_of_roles, engagement_id=engagement.id)

        updated_engagement_translation = EngagementTranslationModel.update_engagement_translation(
            engagement_translation_id, translation_data)
        return EngagementTranslationSchema().dump(updated_engagement_translation)

    @staticmethod
    def delete_engagement_translation(engagement_id, engagement_translation_id):
        """Remove engagement translation."""
        engagement = EngagementModel.find_by_id(engagement_id)
        if not engagement:
            raise ValueError('Engagement to translate was not found')

        EngagementTranslationService._verify_engagement_translation(engagement_translation_id)

        one_of_roles = (
            MembershipType.TEAM_MEMBER.name,
            Role.EDIT_ENGAGEMENT.value
        )

        authorization.check_auth(one_of_roles=one_of_roles, engagement_id=engagement.id)

        return EngagementTranslationModel.delete_engagement_translation(engagement_translation_id)

    @staticmethod
    def _verify_engagement_translation(engagement_translation_id):
        """Verify if engagement translation exists."""
        engagement_translation = EngagementTranslationModel.find_by_id(engagement_translation_id)
        if not engagement_translation:
            raise KeyError('Engagement translation' + engagement_translation_id + ' does not exist')
        return engagement_translation

    @staticmethod
    def _get_default_language_values(engagement, summary_content, translation_data):
        """Populate the default values."""
        engagement_id = engagement.id
        translation_data['name'] = engagement.name
        translation_data['description'] = engagement.description
        translation_data['rich_description'] = engagement.rich_description
        translation_data['content'] = summary_content.content
        translation_data['rich_content'] = summary_content.rich_content
        translation_data['consent_message'] = engagement.consent_message

        engagement_slug = EngagementSlugModel.find_by_engagement_id(engagement_id)
        if engagement_slug:
            translation_data['slug'] = engagement_slug.slug

        upcoming_status_block = EngagementStatusBlockModel.get_by_status(engagement_id,
                                                                         SubmissionStatus.Upcoming.name)
        if upcoming_status_block:
            translation_data['upcoming_status_block_text'] = upcoming_status_block.block_text

        open_status_block = EngagementStatusBlockModel.get_by_status(engagement_id,
                                                                     SubmissionStatus.Open.name)
        if open_status_block:
            translation_data['open_status_block_text'] = open_status_block.block_text

        closed_status_block = EngagementStatusBlockModel.get_by_status(engagement_id,
                                                                       SubmissionStatus.Closed.name)
        if closed_status_block:
            translation_data['closed_status_block_text'] = closed_status_block.block_text

        return translation_data
