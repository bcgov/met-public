"""Notification Services."""

import json
import re
from traceback import print_tb

import requests
from flask import current_app


def send_email(subject, email, sender, html_body, token=None):
    """Send the email asynchronously, using the given details."""
    if not email or not is_valid_email(email):
        return

    send_email_endpoint = current_app.config.get('NOTIFICATIONS_EMAIL_ENDPOINT')
    payload = {
        'bodyType': 'html',
        'body': html_body,
        'from': sender,
        'subject': subject,
        'to': email.split()
    }
    print('-----------------payload-----------------',json.dumps(payload))
    print('-----------------sender-----------------',sender)
    print('-----------------send_email_endpoint-----------------',send_email_endpoint)
    response = requests.post(send_email_endpoint,
                             headers={'Content-Type': 'application/json', 'Authorization': f'Bearer {token}'},
                             data=json.dumps(payload))
    response.raise_for_status()


def is_valid_email(email: str):
    """Return if the email is valid or not."""
    if email:
        return re.match(r'[^@]+@[^@]+\.[^@]+', email) is not None
    return False
