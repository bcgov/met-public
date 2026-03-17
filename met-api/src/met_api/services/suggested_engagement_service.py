"""Service for suggested engagement management."""
from datetime import datetime, timezone
from http import HTTPStatus

from met_api.constants.membership_type import MembershipType
from met_api.exceptions.business_exception import BusinessException
from met_api.models.suggested_engagement import SuggestedEngagement as SuggestedEngagementModel
from met_api.schemas.suggested_engagement import SuggestedEngagementSchema, SuggestedEngagementWithAttachment
from met_api.services import authorization
from met_api.utils.roles import Role


class SuggestedEngagementService:
    """Service for managing suggested engagements."""

    @staticmethod
    def get_suggestions_by_engagement_id(engagement_id: int, attach: bool = False):
        """List all suggestions for an engagement."""
        if not attach:
            suggestion_records = SuggestedEngagementModel.find_by_engagement_id(engagement_id)
            return SuggestedEngagementSchema(many=True).dump(suggestion_records)

        pairs = SuggestedEngagementModel.find_by_engagement_id_and_attach(engagement_id)
        materialized = [
            {
                'id': s.id,
                'engagement_id': s.engagement_id,
                'suggested_engagement_id': s.suggested_engagement_id,
                'sort_index': s.sort_index,
                'engagement': e,
            }
            for (s, e) in pairs
        ]
        return SuggestedEngagementWithAttachment(many=True).dump(materialized)

    @staticmethod
    def create_suggestions(engagement_id: int, suggestions_data: list) -> list[dict]:
        """Create one or more suggested engagements and return the persisted records."""
        SuggestedEngagementService._authorize(engagement_id)
        if not isinstance(suggestions_data, list):
            raise BusinessException(error='Invalid suggestions payload', status_code=HTTPStatus.BAD_REQUEST)
        inserts = []
        for s in suggestions_data:
            SuggestedEngagementService._validate_suggestion(s)
            inserts.append({
                'engagement_id': engagement_id,
                'suggested_engagement_id': s['suggested_engagement_id'],
                'sort_index': s['sort_index'],
                'updated_date': datetime.now(timezone.utc),
            })
        SuggestedEngagementService._validate_payload_uniqueness(inserts)
        SuggestedEngagementModel.bulk_insert_suggested_engagements(inserts)
        created_records = SuggestedEngagementModel.find_by_engagement_id(engagement_id)
        return SuggestedEngagementSchema(many=True).dump(created_records)

    @staticmethod
    def delete_suggestion(engagement_id: int, suggestion_id: int):
        """Delete a single suggested engagement."""
        SuggestedEngagementService._authorize(engagement_id)
        deleted_count = SuggestedEngagementModel.delete_suggested_engagement(engagement_id, suggestion_id)
        if not deleted_count:
            raise BusinessException(error='Engagement suggestion not found', status_code=HTTPStatus.NOT_FOUND)
        return {'deleted': deleted_count}

    @staticmethod
    def sync_suggestions(engagement_id: int, suggestions_data):
        """Sync suggestions for an engagement: create, update, delete."""
        SuggestedEngagementService._validate_and_authorize_sync(
            engagement_id, suggestions_data
        )

        updates, inserts, to_delete = (
            SuggestedEngagementService._build_sync_operations(
                engagement_id, suggestions_data
            )
        )

        if to_delete:
            SuggestedEngagementModel.delete_suggestions_by_ids(to_delete)
        if updates:
            SuggestedEngagementModel.bulk_update_suggested_engagements(updates)
        if inserts:
            SuggestedEngagementModel.bulk_insert_suggested_engagements(inserts)

        updated_records = SuggestedEngagementModel.find_by_engagement_id(engagement_id)
        return {
            'summary': {
                'updated': len(updates),
                'created': len(inserts),
                'deleted': len(to_delete),
            },
            'suggestions': SuggestedEngagementSchema(many=True).dump(updated_records),
        }

    @staticmethod
    def _validate_and_authorize_sync(engagement_id: int, suggestions_data):
        SuggestedEngagementService._authorize(engagement_id)

        if not isinstance(suggestions_data, list):
            raise BusinessException(
                error='Invalid suggestions payload',
                status_code=HTTPStatus.BAD_REQUEST,
            )

        for s in suggestions_data:
            SuggestedEngagementService._validate_suggestion(s)

        SuggestedEngagementService._validate_payload_uniqueness(suggestions_data)

    @staticmethod
    def _build_sync_operations(engagement_id: int, suggestions_data):
        existing = SuggestedEngagementModel.find_by_engagement_id(engagement_id)
        existing_ids = {e.id for e in existing}

        incoming_ids = {
            s.get('id')
            for s in suggestions_data
            if s.get('id') and s.get('id') > 0
        }

        to_delete = existing_ids - incoming_ids

        updates = []
        inserts = []
        now = datetime.now(timezone.utc)

        for s in suggestions_data:
            base = {
                'engagement_id': engagement_id,
                'suggested_engagement_id': s['suggested_engagement_id'],
                'sort_index': s['sort_index'],
                'updated_date': now,
            }

            if s.get('id') in existing_ids:
                base['id'] = s['id']
                updates.append(base)
            else:
                inserts.append(base)

        return updates, inserts, to_delete

    @staticmethod
    def _validate_suggestion(suggestion_data: dict):
        required_fields = ['sort_index', 'suggested_engagement_id']
        missing = [field for field in required_fields if field not in suggestion_data]
        if missing:
            raise BusinessException(error=f'Missing fields: {", ".join(missing)}', status_code=HTTPStatus.BAD_REQUEST)

    @staticmethod
    def _validate_payload_uniqueness(suggestion_data: list[dict]):
        slots = []
        targets = []
        for s in suggestion_data:
            try:
                slots.append(int(s['sort_index']))
                targets.append(int(s['suggested_engagement_id']))
            except (TypeError, ValueError) as exc:
                raise BusinessException(
                    error='sort_index and suggested_engagement_id must be integers',
                    status_code=HTTPStatus.BAD_REQUEST,
                ) from exc

        if len(slots) != len(set(slots)):
            raise BusinessException(error='Duplicate sort_index values are not allowed',
                                    status_code=HTTPStatus.BAD_REQUEST)
        if len(targets) != len(set(targets)):
            raise BusinessException(error='Duplicate suggested_engagement_id values are not allowed',
                                    status_code=HTTPStatus.BAD_REQUEST)

    @staticmethod
    def _authorize(engagement_id: int):
        one_of_roles = (MembershipType.TEAM_MEMBER.name, Role.EDIT_ENGAGEMENT.value)
        authorization.check_auth(one_of_roles=one_of_roles, engagement_id=engagement_id)
