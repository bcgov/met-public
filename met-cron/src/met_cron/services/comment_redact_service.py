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
"""Service to do met comment refaction."""
from datetime import datetime, timedelta
from typing import List

from flask import current_app

from met_api.constants.engagement_status import Status as MetEngagementStatus
from met_api.constants.comment_status import Status as CommentStatus
from met_api.constants.user import SYSTEM_USER
from met_api.models.comment import Comment as MetCommentModel
from met_api.models.engagement import Engagement as MetEngagementModel
from met_api.models.submission import Submission as MetSubmissionModel
from met_cron.models.db import db, session_scope
from sqlalchemy import and_


class CommentRedactService:  # pylint: disable=too-few-public-methods
    """Redaction Service on Comments."""

    @staticmethod
    def do_redact_comments():
        """Perform the redaction on rejected comments.

            1. Get submissions for engagements closed in for N_DAYS
            2. Redact comments in comments table by submission_ids
            3. Redact comments in submission_json by submission_ids

        """
        submissions = CommentRedactService._find_submissions_for_n_days_closed_engagements(days=current_app.config.get('N_DAYS', 14))
        if not submissions:
            current_app.logger.info(f'No Submissions for Engagements closed for {current_app.config.get("N_DAYS", 14)} days found.')
            return
        submissions_ids = [submission.id for submission in submissions]
        with session_scope() as session:
            CommentRedactService._redact_comments_by_submission_ids(submissions_ids, session)
            CommentRedactService._redact_submission_json_comments(submissions_ids, session)


    @staticmethod
    def _find_submissions_for_n_days_closed_engagements(days) -> List[MetSubmissionModel]:
        n_days_ago = datetime.utcnow().date() - timedelta(days=days)
        return db.session.query(MetSubmissionModel)\
            .join(MetEngagementModel, MetEngagementModel.id == MetSubmissionModel.engagement_id)\
            .filter(and_(
                MetEngagementModel.end_date <= n_days_ago,
                MetEngagementModel.status_id == MetEngagementStatus.Closed.value,
                MetSubmissionModel.comment_status_id == CommentStatus.Rejected.value,
                MetSubmissionModel.has_threat.is_(False)))\
            .all()


    @staticmethod
    def _redact_comments_by_submission_ids(submission_ids: List[int], session):
        session.query(MetCommentModel)\
        .filter(MetCommentModel.submission_id.in_(submission_ids))\
        .update(
            {
                MetCommentModel.text: current_app.config.get('REDACTION_TEXT', '[Comment Redacted]'),                
                MetCommentModel.updated_by: SYSTEM_USER,
                MetCommentModel.updated_date: datetime.utcnow(),
            },
            synchronize_session=False)


    @staticmethod
    def _redact_submission_json_comments(submission_ids: List[int], session):
        comments = session.query(MetCommentModel)\
        .filter(MetCommentModel.submission_id.in_(submission_ids))\
        .all()
        # e.g. ['simpletextarea', 'simpletextarea1', 'simpletextfield']
        keys_to_redact = [comment.component_id for comment in comments]

        for submission in session.query(MetSubmissionModel).filter(MetSubmissionModel.id.in_(submission_ids)):
            new_submission_json = {}
            for key, value in submission.submission_json.items():
                if key in keys_to_redact:
                    new_submission_json[key] = current_app.config.get('REDACTION_TEXT', '[Comment Redacted]')
                else:
                    new_submission_json[key] = value
            submission.submission_json = new_submission_json
            submission.updated_by = SYSTEM_USER
            submission.updated_date = datetime.utcnow()

