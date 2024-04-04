"""Service for SurveyTranslation management."""

from http import HTTPStatus

from sqlalchemy.exc import IntegrityError
from met_api.constants.membership_type import MembershipType
from met_api.exceptions.business_exception import BusinessException
from met_api.models.survey_translation import SurveyTranslation
from met_api.services import authorization
from met_api.services.language_service import LanguageService
from met_api.services.survey_service import SurveyService
from met_api.utils.roles import Role


class SurveyTranslationService:
    """SurveyTranslation management service."""

    @staticmethod
    def get_survey_translation_by_id(survey_translation_id):
        """Get survey translation by id."""
        survey_translation_record = SurveyTranslation.find_by_id(
            survey_translation_id
        )
        return survey_translation_record

    @staticmethod
    def get_translation_by_survey_and_language(
        survey_id=None, language_id=None
    ):
        """Get survey translation by survey_id and/or language_id."""
        survey_translations = (
            SurveyTranslation.get_survey_translation_by_survey_and_language(
                survey_id=survey_id, language_id=language_id
            )
        )
        return survey_translations

    @staticmethod
    def create_survey_translation(translation_data, pre_populate=True):
        """Create survey translation."""
        try:
            survey = SurveyService.get(translation_data['survey_id'])

            one_of_roles = (
                MembershipType.TEAM_MEMBER.name,
                Role.CREATE_SURVEY.value,
            )
            authorization.check_auth(
                one_of_roles=one_of_roles,
                engagement_id=survey.get('engagement_id'),
            )
            if not survey:
                raise ValueError('Survey to translate was not found')
            language_record = LanguageService.get_language_by_id(
                translation_data['language_id']
            )
            if not language_record:
                raise ValueError('Language to translate was not found')
            if pre_populate:
                # prepopulate translation with base language data
                translation_data['name'] = survey.get('name')
                translation_data['form_json'] = survey.get('form_json')

            return SurveyTranslation.create_survey_translation(
                translation_data
            )
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
    def update_survey_translation(
        survey_id, survey_translation_id, data: dict
    ):
        """Update survey translation partially."""
        survey = SurveyService.get(survey_id)

        one_of_roles = (
            MembershipType.TEAM_MEMBER.name,
            Role.EDIT_SURVEY.value,
        )
        authorization.check_auth(
            one_of_roles=one_of_roles,
            engagement_id=survey.get('engagement_id'),
        )

        updated_survey_translation = (
            SurveyTranslation.update_survey_translation(
                survey_translation_id, data
            )
        )
        if not updated_survey_translation:
            raise ValueError('SurveyTranslation to update was not found')
        return updated_survey_translation

    @staticmethod
    def delete_survey_translation(survey_id, survey_translation_id):
        """Delete survey translation."""
        survey = SurveyService.get(survey_id)

        one_of_roles = (
            MembershipType.TEAM_MEMBER.name,
            Role.EDIT_SURVEY.value,
        )
        authorization.check_auth(
            one_of_roles=one_of_roles,
            engagement_id=survey.get('engagement_id'),
        )

        return SurveyTranslation.delete_survey_translation(
            survey_translation_id
        )
