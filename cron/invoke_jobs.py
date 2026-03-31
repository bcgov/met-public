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
"""Generate account statements.

This module will create statement records for each account.
"""
import os
import sys

from flask import Flask
from utils.logger import setup_logging

from config import get_named_config

setup_logging(os.path.join(os.path.abspath(os.path.dirname(__file__)), 'logging.conf'))  # important to do this first


def create_app(run_mode=os.getenv('FLASK_ENV', 'production')):
    """Return a configured Flask App using the Factory method.""" 
    from api.models import db

    app = Flask(__name__)
    print(f'>>>>> Creating app in run_mode: {run_mode}')

    # Configure app from config.py
    app.config.from_object(get_named_config(run_mode))

    # Configure Sentry
    app.logger.info(f'<<<< Starting Jobs >>>>')
    db.init_app(app)

    register_shellcontext(app)

    return app


def register_shellcontext(app):
    """Register shell context objects."""

    def shell_context():
        """Shell context objects."""
        return {
            'app': app
        }  # pragma: no cover

    app.shell_context_processor(shell_context)


def run(job_name):
    from tasks.closing_soon_mailer import EngagementClosingSoonMailer
    from tasks.closeout import EngagementCloseoutTask
    from tasks.publish import EngagementPublishTask
    from tasks.purge import PurgeTask
    from tasks.comment_redact import CommentRedactTask
    from tasks.subscription_mailer import SubscriptionMailerTask
    application = create_app()

    application.app_context().push()

    print('Requested Job:', job_name)
    if job_name == 'ENGAGEMENT_CLOSEOUT':
        EngagementCloseoutTask.do_closeout()
        application.logger.info(f'<<<< Completed Engagement Closeout Job >>>>')
    elif job_name == 'ENGAGEMENT_PUBLISH':
        EngagementPublishTask.do_publish()
        application.logger.info(f'<<<< Completed Engagement Publish Job >>>>')
    elif job_name == 'PURGE':
        PurgeTask.do_purge()
        application.logger.info('<<<< Completed Event Log Purge >>>>')
    elif job_name == 'COMMENT_REDACT':
        CommentRedactTask.do_redact()
        application.logger.info('<<<< Completed Comment Redaction >>>>')
    elif job_name == 'PUBLISH_EMAIL':
        SubscriptionMailerTask.do_email()
        application.logger.info(
            '<<<< Completed sending engagement publication notification emails >>>>'
        )
    elif job_name == 'CLOSING_SOON_EMAIL':
        EngagementClosingSoonMailer.do_email()
        application.logger.info(
            '<<<< Completed sending engagement closing soon notification emails >>>>'
        )
    else:
        application.logger.debug(
            'No valid args passed. Exiting without running any jobs. ***************'
        )


if __name__ == "__main__":
    run(sys.argv[1])

