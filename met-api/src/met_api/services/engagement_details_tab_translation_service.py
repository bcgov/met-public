"""Service for engagement details tab translation management."""

from datetime import datetime
from http import HTTPStatus

from met_api.constants.membership_type import MembershipType
from met_api.exceptions.business_exception import BusinessException
from met_api.models.engagement_details_tab_translation import EngagementDetailsTabTranslation as EDTTranslationModel
from met_api.schemas.engagement_details_tab_translation import \
    EngagementDetailsTabTranslationSchema as EDTTranslationSchema
from met_api.services import authorization
from met_api.utils.roles import Role


class EngagementDetailsTabTranslationService:
    """Engagement details tab translation management service."""

    @staticmethod
    def get_translations_by_engagement_and_language(engagement_id: int, language_id: int):
        """List all details tab translations for an engagement."""
        tabs_schema = EDTTranslationSchema(many=True)
        tab_records = EDTTranslationModel.find_by_engagement_and_language(engagement_id, language_id)
        return tabs_schema.dump(tab_records)

    @staticmethod
    def create_translations(engagement_id: int, language_id: int, translations_data: list) -> list[dict]:
        """Create one or more engagement details tab translations and return the persisted records."""
        EngagementDetailsTabTranslationService._authorize(engagement_id)

        if isinstance(translations_data, dict):
            translations_data = [translations_data]
        elif not isinstance(translations_data, list):
            raise BusinessException(error='Invalid translations payload', status_code=HTTPStatus.BAD_REQUEST)

        inserts = []
        for td in translations_data:
            td['language_id'] = language_id
            td['created_date'] = datetime.now()
            EngagementDetailsTabTranslationService._validate_translation_data(td)
            inserts.append(td)
        EDTTranslationModel.bulk_insert_details_tab_translations(inserts)
        created_records = EDTTranslationModel.find_by_engagement_and_language(engagement_id, language_id)
        return EDTTranslationSchema(many=True).dump(created_records)

    @staticmethod
    def sync_translations(engagement_id: int, language_id: int, translations_data, user_id=None):
        """Sync details tab translations for an engagement: create, update, delete."""
        EngagementDetailsTabTranslationService._authorize(engagement_id)
        if not isinstance(translations_data, list):
            raise BusinessException(error='Invalid translations payload', status_code=HTTPStatus.BAD_REQUEST)
        existing_translations = EDTTranslationModel.find_by_engagement_and_language(engagement_id, language_id)
        existing_ids = {tab.id for tab in existing_translations}
        incoming_ids = {t.get('id') for t in translations_data if t.get('id') and t.get('id') > 0}

        updates = [t for t in translations_data if t.get('id') in existing_ids]
        for u in updates:
            u['updated_by'] = user_id
            u['updated_date'] = datetime.now()
            u['language_id'] = language_id

        inserts = [t for t in translations_data if not t.get('id') or t.get('id') == -1]
        for i in inserts:
            i.pop('id', None)
            i['language_id'] = language_id
            i['created_date'] = datetime.now()

        to_delete = existing_ids - incoming_ids

        if updates:
            EDTTranslationModel.bulk_update_details_tab_translations(updates)
        if inserts:
            EDTTranslationModel.bulk_insert_details_tab_translations(inserts)
        if to_delete:
            EDTTranslationModel.delete_translations_by_ids(to_delete)

        updated_records = EDTTranslationModel.find_by_engagement_and_language(engagement_id, language_id)
        return {
            'summary': {'updated': len(updates), 'created': len(inserts), 'deleted': len(to_delete)},
            'tabs': EDTTranslationSchema(many=True).dump(updated_records)
        }

    @staticmethod
    def delete_translation(engagement_id: int, translation_id: int):
        """Delete a single details tab translation."""
        EngagementDetailsTabTranslationService._authorize(engagement_id)
        deleted_count = EDTTranslationModel.delete_details_tab_translation(engagement_id, translation_id)
        if not deleted_count:
            raise BusinessException(error='Details tab translation not found', status_code=HTTPStatus.NOT_FOUND)
        return {'deleted': deleted_count}

    @staticmethod
    def _validate_translation_data(translation_data: dict):
        required_fields = ['language_id', 'engagement_details_tab_id', 'label', 'slug', 'heading', 'body']
        missing = [field for field in required_fields if field not in translation_data]
        if missing:
            raise BusinessException(error=f'Missing fields: {", ".join(missing)}', status_code=HTTPStatus.BAD_REQUEST)

    @staticmethod
    def _authorize(engagement_id: int):
        one_of_roles = (MembershipType.TEAM_MEMBER.name, Role.EDIT_ENGAGEMENT.value)
        authorization.check_auth(one_of_roles=one_of_roles, engagement_id=engagement_id)
