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
"""Service to do ETL on e."""
from datetime import datetime, timedelta
from typing import List

from flask import current_app
from met_api.models.comment import Comment as MetCommentModel
from met_api.constants.comment_status import Status as CommentStatus
from met_cron.models.db import db
from met_cron.models.user_feedback import UserFeedback as UserFeedbackModel
from met_cron.models.survey import Survey as SurveyModel


class CommentsEtlService:  # pylint: disable=too-few-public-methods
    """ETL Service on Comments."""

    @staticmethod
    def do_etl_comments():
        """Perform the ETL for Engagement.

        1). Find comments
                    which is approved.
                    whose reviewed date is newer
        2). No update logic in place now.
        """
        current_app.logger.info('<<<<<<<<<<<<<<<<<<<<<<<<<<<Comment Extraction starting ')
        updated_comments = CommentsEtlService.get_updated_comments()
        if not updated_comments:
            current_app.logger.info('No updated Comments Found')
            return

        current_app.logger.info('Total updated Comments Found : %s.', len(updated_comments))
        CommentsEtlService._transform_engagements(updated_comments)
        db.session.commit()

    @staticmethod
    def _transform_engagements(updated_comments):
        comment: MetCommentModel
        for comment in updated_comments:
            current_app.logger.info('Processing updated Comment: %s.', comment.id)
            survey: SurveyModel = SurveyModel.find_active_by_source_id(comment.survey_id)
            current_app.logger.info('Survey id in Analytics DB: %s  for Comment: %s with source survey id:%s:', comment.id,
                                    survey, comment.survey_id)
            CommentsEtlService._load_new_user_feedback(comment, survey)

    @staticmethod
    def get_updated_comments():
        time_delta_in_minutes: int = int(current_app.config.get('TIME_DELTA_IN_MINUTES'))
        time_delta = datetime.utcnow() - timedelta(minutes=time_delta_in_minutes)
        updated_comments = db.session.query(MetCommentModel).filter(
            MetCommentModel.submission_date > time_delta,
            MetCommentModel.status_id == CommentStatus.Approved.value).all()
        return updated_comments

    @staticmethod
    def _load_new_user_feedback(comment: MetCommentModel, survey: SurveyModel):
        """Helper to build the engagement."""

        current_app.logger.info('Creating new User Feedback  in Analytics DB: %s.', comment.id)
        feedback: UserFeedbackModel = UserFeedbackModel()
        feedback.comment = comment.text
        feedback.user_id = comment.user_id
        feedback.source_comment_id = comment.id
        feedback.survey_id = getattr(survey, 'id', None)
        feedback.flush()
        return feedback
