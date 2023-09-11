"""EAO publishing utility.

Manages data transfer to eao
"""

from flask import current_app

from met_api.models.engagement import Engagement as EngagementModel
from met_api.services.email_verification_service import EmailVerificationService
from met_api.services.rest_service import RestService
from met_api.utils import notification


def publish_to_epic(project_id: str, eng_id: str):
    """Publish new comment period to EPIC/EAO system.

    EAO accepts data in the below format.
    {
       "isMet":"true",
       "metURL":"https://eagle-dev.apps.silver.devops.gov.bc.ca",
       "dateCompleted":"2023-03-31 23:11:49.582",
       "dateStarted":"2023-01-31 23:11:49.582",
       "instructions":"",
       "commentTip":"",
       "milestone":"5cf00c03a266b7e1877504e9",
       "openHouse":"",
       "relatedDocuments":"",
       "project":"5d40cc5b4cb2c7001b1336b8"
    }
    """
    try:
        # publish to epic should happen only in EAO environments
        is_eao_environment = current_app.config.get('IS_EAO_ENVIRONMENT')
        if not is_eao_environment:
            return

        kc_service_id = current_app.config.get('EPIC_KEYCLOAK_SERVICE_ACCOUNT_ID')
        kc_secret = current_app.config.get('EPIC_KEYCLOAK_SERVICE_ACCOUNT_SECRET')
        issuer_url = current_app.config.get('EPIC_JWT_OIDC_ISSUER')
        eao_service_account_token = RestService.get_service_account_token(kc_service_id, kc_secret, issuer_url)
        eao_endpoint = current_app.config.get('EPIC_URL')
        engagement: EngagementModel = EngagementModel.find_by_id(eng_id)

        engagement_path = EmailVerificationService.get_engagement_path(
            engagement)
        site_url = notification.get_tenant_site_url(engagement.tenant_id)

        epic_comment_period_payload = dict(
            isMet=True,
            metURL=f'{site_url}{engagement_path}',
            dateCompleted=engagement.end_date,
            dateStarted=engagement.start_date,
            instructions='',
            commentTip='',
            milestone=current_app.config.get('EPIC_MILESTONE'),
            openHouse='',
            relatedDocuments='',
            project=project_id
        )

        RestService.post(endpoint=eao_endpoint,
                         token=eao_service_account_token,
                         data=epic_comment_period_payload,
                         raise_for_status=False)
    except Exception as e:  # NOQA # pylint:disable=broad-except
        # Log the error and continue execution without raising the exception
        current_app.logger.error(f'Error in publish_to_epic: {str(e)}')
