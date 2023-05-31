# Copyright © 2019 Province of British Columbia
#
# Licensed under the Apache License, Version 2.0 (the 'License');
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an 'AS IS' BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
"""Service to do ETL on Users."""

from datetime import datetime, timedelta
from typing import List

from flask import current_app
from met_api.models.comment import Comment as MetCommentModel
from met_api.constants.comment_status import Status as CommentStatus
from met_cron.models.db import db
from met_api.models.met_user import MetUser as MetUserModel
from met_cron.models.user_details import UserDetails as UserDetailsModel


class UserEtlService:  # pylint: disable=too-few-public-methods
    """ETL Service on users."""

    @staticmethod
    def do_etl_users():
        """Perform the ETL for users."""
        current_app.logger.info('<<<<<<<<<<<<<<<<<<<<<<<<<<<User Extraction starting ')
        updated_users = UserEtlService._get_updated_users()
        if not updated_users:
            current_app.logger.info('No new Users Found')
            return
        current_app.logger.info('Total updated Users Found : %s.', len(updated_users))
        UserEtlService._load_users(updated_users)
        db.session.commit()

    @staticmethod
    def _load_users(updated_users):
        user: MetUserModel
        for user in updated_users:
            current_app.logger.info('Processing updated User: %s.', user.id)
            UserEtlService._load_new_user_model(user)

    @staticmethod
    def _get_updated_users():
        time_delta_in_minutes: int = int(current_app.config.get('TIME_DELTA_IN_MINUTES'))
        time_delta = datetime.utcnow() - timedelta(minutes=time_delta_in_minutes)
        updated_users = db.session.query(MetUserModel).filter(
            MetUserModel.created_date > time_delta).all()
        return updated_users

    @staticmethod
    def _load_new_user_model(user: MetUserModel):
        """Helper to build the user."""

        current_app.logger.info('Creating new User in Analytics DB: %s.', user.id)
        user_details: UserDetailsModel = UserDetailsModel()
        user_details.name = user.external_id
        user_details.flush()
        return user_details
