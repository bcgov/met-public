"""Service for engagement content translation management."""

from http import HTTPStatus
from sqlalchemy.exc import IntegrityError
from met_api.constants.membership_type import MembershipType
from met_api.models.engagement_content_translation import EngagementContentTranslation as ECTranslationModel
from met_api.models.language import Language as LanguageModel
from met_api.schemas.engagement_content_translation import EngagementContentTranslationSchema as ECTranslationSchema
from met_api.services import authorization
from met_api.utils.roles import Role
from met_api.exceptions.business_exception import BusinessException
from met_api.services.engagement_content_service import EngagementContentService


class EngagementContentTranslationService:
    """Engagement content translation management service."""

    @staticmethod
    def get_engagement_content_translation_by_id(translation_id):
        """Get engagement content translation by id."""
        translation_schema = ECTranslationSchema(many=False)
        translation_record = ECTranslationModel.find_by_id(translation_id)
        return translation_schema.dump(translation_record)

    @staticmethod
    def get_translations_by_content_and_language(engagement_content_id=None, language_id=None):
        """Get engagement content translations by content id and/or language id."""
        translation_schema = ECTranslationSchema(many=True)
        translation_records = ECTranslationModel.get_translations_by_content_and_language(
            engagement_content_id, language_id
        )
        return translation_schema.dump(translation_records)

    @staticmethod
    def create_engagement_content_translation(translation_data, pre_populate=True):
        """Create engagement content translation."""
        try:
            language_record = LanguageModel.find_by_id(translation_data['language_id'])
            if not language_record:
                raise ValueError('Language not found')

            one_of_roles = (MembershipType.TEAM_MEMBER.name, Role.CREATE_ENGAGEMENT.value)
            authorization.check_auth(one_of_roles=one_of_roles)

            if pre_populate:
                default_content = EngagementContentService.get_content_by_content_id(
                    translation_data['engagement_content_id']
                )
                if default_content.get('id') is not None:
                    translation_data['content_title'] = default_content.get('title', None)
                    translation_data['custom_text_content'] = default_content.get('custom_text_content', None)
                    translation_data['custom_json_content'] = default_content.get('custom_json_content', None)

            created_translation = ECTranslationModel.create_engagement_content_translation(translation_data)
            return ECTranslationSchema().dump(created_translation)
        except IntegrityError as e:
            detail = str(e.orig).split('DETAIL: ')[1] if 'DETAIL: ' in str(e.orig) else 'Duplicate entry.'
            raise BusinessException(str(detail), HTTPStatus.INTERNAL_SERVER_ERROR) from e

    @staticmethod
    def update_engagement_content_translation(translation_id, translation_data):
        """Update engagement content translation."""
        EngagementContentTranslationService._verify_translation_exists(translation_id)

        one_of_roles = (MembershipType.TEAM_MEMBER.name, Role.EDIT_ENGAGEMENT.value)
        authorization.check_auth(one_of_roles=one_of_roles)

        updated_translation = ECTranslationModel.update_engagement_content_translation(translation_id, translation_data)
        return ECTranslationSchema().dump(updated_translation)

    @staticmethod
    def delete_engagement_content_translation(translation_id):
        """Delete engagement content translation."""
        EngagementContentTranslationService._verify_translation_exists(translation_id)

        one_of_roles = (Role.EDIT_ENGAGEMENT.value,)
        authorization.check_auth(one_of_roles=one_of_roles)

        return ECTranslationModel.delete_engagement_content_translation(translation_id)

    @staticmethod
    def _verify_translation_exists(translation_id):
        """Verify if the engagement content translation exists."""
        translation = ECTranslationModel.find_by_id(translation_id)
        if not translation:
            raise KeyError(f'Engagement content translation {translation_id} does not exist')
        return translation
