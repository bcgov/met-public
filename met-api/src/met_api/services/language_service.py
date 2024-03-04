"""Service for Language management."""

from http import HTTPStatus

from sqlalchemy.exc import IntegrityError

from met_api.exceptions.business_exception import BusinessException
from met_api.models.language import Language
from met_api.schemas.language import LanguageSchema


class LanguageService:
    """Language management service."""

    @staticmethod
    def get_language_by_id(language_id):
        """Get language by id."""
        language_record = Language.find_by_id(language_id)
        return LanguageSchema().dump(language_record)

    @staticmethod
    def get_languages():
        """Get languages."""
        languages_records = Language.get_languages()
        return LanguageSchema(many=True).dump(languages_records)

    @staticmethod
    def create_language(language_data):
        """Create language."""
        try:
            return Language.create_language(language_data)
        except IntegrityError as e:
            # Catching language code already exists error
            detail = (
                str(e.orig).split('DETAIL: ')[1]
                if 'DETAIL: ' in str(e.orig)
                else 'Duplicate entry.'
            )
            raise BusinessException(
                str(detail), HTTPStatus.INTERNAL_SERVER_ERROR
            ) from e

    @staticmethod
    def update_language(language_id, data: dict):
        """Update language partially."""
        updated_language = Language.update_language(language_id, data)
        if not updated_language:
            raise ValueError('Language to update was not found')
        return updated_language

    @staticmethod
    def delete_language(language_id):
        """Delete language."""
        return Language.delete_language(language_id)
