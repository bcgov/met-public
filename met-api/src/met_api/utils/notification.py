"""Notification Services."""

import json
import re

import requests

from flask import current_app
from met_api.models.tenant import Tenant
from met_api.services.rest_service import RestService
from met_api.constants.email_verification import INTERNAL_EMAIL_DOMAIN


def get_tenant_site_url(tenant_id, path=''):
    """Get the tenant specific site url (domain / tenant / path)."""
    is_single_tenant_environment = current_app.config.get('IS_SINGLE_TENANT_ENVIRONMENT', False)
    paths = current_app.config['PATH_CONFIG']
    site_url = paths.get('SITE', '')
    if not is_single_tenant_environment:
        if tenant_id is None:
            raise ValueError('Missing tenant id.')
        tenant: Tenant = Tenant.find_by_id(tenant_id)
        return site_url + f'/{tenant.short_name.lower()}' + path
    else:
        return site_url + path


def send_email(subject, email, html_body, args, template_id):
    """Send the email asynchronously, using the given details."""
    if not email or not is_valid_email(email):
        return

    if not is_allowed_email(email):
        raise ValueError('The email provided is not allowed in this environment.')

    sender = current_app.config['EMAIL_TEMPLATES']['FROM_ADDRESS']
    service_account_token = RestService.get_service_account_token()
    send_email_endpoint = current_app.config.get('NOTIFICATIONS_EMAIL_ENDPOINT')
    payload = {
        'bodyType': 'html',
        'body': html_body,
        'from': sender,
        'subject': subject,
        'to': email.split(),
        'args': args,
        'template_id': template_id,
    }
    response = requests.post(send_email_endpoint,
                             headers={
                                 'Content-Type': 'application/json',
                                 'Authorization': f'Bearer {service_account_token}'},
                             data=json.dumps(payload))
    response.raise_for_status()


def is_valid_email(email: str):
    """Return if the email is valid or not."""
    if email:
        return re.match(r'[^@]+@[^@]+\.[^@]+', email) is not None
    return False


def is_allowed_email(email: str):
    """Return if the email is allowed or not if send_email_internal_only is enabled."""
    send_email_internal_only = current_app.config.get('SEND_EMAIL_INTERNAL_ONLY')
    return not send_email_internal_only or (email and email.endswith(INTERNAL_EMAIL_DOMAIN))
