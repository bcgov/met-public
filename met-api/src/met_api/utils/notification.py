"""Notification Services."""

import json
import re

import requests
from flask import current_app
from met_api.services.rest_service import RestService


def send_email(subject, email, html_body, args, template_id):
    """Send the email asynchronously, using the given details."""
    if not email or not is_valid_email(email):
        return

    sender = current_app.config.get('MAIL_FROM_ID')
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
