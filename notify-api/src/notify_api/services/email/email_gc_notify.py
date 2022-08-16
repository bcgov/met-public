# Copyright © 2019 Province of British Columbia
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
"""GC notify email service."""
import os
from notifications_python_client import NotificationsAPIClient

from .email_base_service import EmailBaseService


class EmailGCNotify(EmailBaseService):  # pylint: disable=too-few-public-methods
    """Implementation for email from GC Notify."""

    def send(self, email_payload):
        """Send email through GCNotify."""
        api_key = os.getenv('GC_NOTIFY_API_KEY')
        print('----email_payload', email_payload)
        gc_notify_url = os.getenv('GC_NOTIFY_API_BASE_URL')
        email_template_id = email_payload.get('template_id', os.getenv('GC_NOTIFY_EMAIL_TEMPLATE_ID'))
        notifications_client = NotificationsAPIClient(api_key=api_key, base_url=gc_notify_url)
        email_to = ','.join(email_payload.get('to'))
        args = email_payload.get('args')
        try:
            response = notifications_client.send_email_notification(
                email_address=email_to,
                template_id=email_template_id,
                personalisation=args)
            print(response)

        except Exception as e:  # noqa: B902
            print(e)
            raise Exception(
                error='Error sending GC notify email.') from e
