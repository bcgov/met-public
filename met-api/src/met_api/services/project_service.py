"""Service for project management."""
import logging
from http import HTTPStatus

from flask import current_app

from met_api.models.engagement import Engagement as EngagementModel
from met_api.models.engagement_metadata import EngagementMetadata as EngagementMetadataModel
from met_api.services.email_verification_service import EmailVerificationService
from met_api.services.rest_service import RestService
from met_api.utils import notification
from met_api.utils.datetime import convert_and_format_to_utc_str


class ProjectService:
    """Project management service."""

    @staticmethod
    def update_project_info(eng_id: str) -> EngagementModel:
        """Publish new comment period to EPIC/EAO system."""
        logger = logging.getLogger(__name__)

        try:
            epic_integration = current_app.config.get('EPIC_CONFIG')
            if not epic_integration['ENABLED']:
                return

            engagement_metadata: EngagementMetadataModel
            engagement, engagement_metadata = ProjectService._get_engagement_and_metadata(eng_id)

            epic_comment_period_payload = ProjectService._construct_epic_payload(engagement)

            eao_service_account_token = ProjectService._get_eao_service_account_token()

            if engagement_metadata and engagement_metadata.project_tracking_id:
                update_url = f'{epic_integration["URL"]}/{engagement_metadata.project_tracking_id}'
                api_response = RestService.put(endpoint=update_url, token=eao_service_account_token,
                                               data=epic_comment_period_payload,
                                               raise_for_status=False)
                # no handling of return so far since epic doesnt return anything

            else:
                create_url = f'{epic_integration["URL"]}'
                api_response = RestService.post(endpoint=create_url, token=eao_service_account_token,
                                                data=epic_comment_period_payload, raise_for_status=False)
                response_data = api_response.json()

                if api_response.status_code == HTTPStatus.OK:
                    tracking_number = response_data.get('id')
                    engagement_metadata.project_tracking_id = tracking_number
                    engagement_metadata.commit()

        except Exception as e:  # NOQA # pylint:disable=broad-except
            logger.error('Error in update_project_info: %s', str(e))

    @staticmethod
    def _get_engagement_and_metadata(eng_id: str):
        engagement = EngagementModel.find_by_id(eng_id)
        engagement_metadata = EngagementMetadataModel.find_by_engagement_id(eng_id)
        return engagement, engagement_metadata

    @staticmethod
    def _construct_epic_payload(engagement):
        site_url = notification.get_tenant_site_url(engagement.tenant_id)
        # the dates have to be converted to UTC since EPIC accepts UTC date and converts to PST
        start_date_utc = convert_and_format_to_utc_str(engagement.start_date)
        end_date_utc = convert_and_format_to_utc_str(engagement.end_date)

        epic_comment_period_payload = {
            'isMet': 'true',
            # metURL is the public url using slug
            'metURL': f'{site_url}{EmailVerificationService.get_engagement_path(engagement, is_public_url=True)}',
            # metURLAdmin is the staff url for editing the engagement
            'metURLAdmin': f'{site_url}{EmailVerificationService.get_engagement_path(engagement, is_public_url=False)}',
            'dateCompleted': end_date_utc,
            'dateStarted': start_date_utc,
            'instructions': '',
            'commentTip': '',
            'milestone': current_app.config['EPIC_CONFIG']['MILESTONE_ID'],
            'openHouse': '',
            'relatedDocuments': '',
            'isPublished': 'true'
        }
        return epic_comment_period_payload

    @staticmethod
    def _get_eao_service_account_token():
        epic = current_app.config['EPIC_CONFIG']
        kc_service_id = epic.get('KEYCLOAK_SERVICE_ACCOUNT_ID')
        kc_secret = epic.get('KEYCLOAK_SERVICE_ACCOUNT_SECRET')
        client_id = epic.get('KEYCLOAK_CLIENT_ID')
        issuer_url = epic.get('JWT_OIDC_ISSUER')
        return RestService.get_access_token_with_password(kc_service_id, kc_secret, client_id, issuer_url)
