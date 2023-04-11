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
from met_api.models.comment import Comment as MetCommentModel
from met_api.models.engagement import Engagement as MetEngagementModel
from met_api.models.submission import Submission as MetSubmissionModel
from met_cron.models.db import db, session_scope


class CommentRedactService:  # pylint: disable=too-few-public-methods
    """Redaction Service on Comments."""
    LAST_N_DAYS = 50

    @staticmethod
    def do_redact_comments():
        """Perform the redaction on rejected comments.

            1.
            2.
            3.

        """
        submissions = CommentRedactService._find_submissions_for_last_n_days_closed_engagements(days=CommentRedactService.LAST_N_DAYS)
        if not submissions:
            current_app.logger.info(f'No Submissions for Engagements closed in the last {CommentRedactService.LAST_N_DAYS} days found.')
            return
        submissions_ids = [submission.id for submission in submissions]
        with session_scope() as session:
            CommentRedactService._redact_comments_by_submission_ids(submissions_ids, session)
            CommentRedactService._redact_submission_json_comments(submissions_ids, session)


    @staticmethod
    def _find_submissions_for_last_n_days_closed_engagements(days = LAST_N_DAYS) -> List[MetSubmissionModel]:
        return db.session.query(MetSubmissionModel)\
            .join(MetEngagementModel, MetEngagementModel.id == MetSubmissionModel.engagement_id)\
            .filter(MetEngagementModel.end_date >= datetime.now() - timedelta(days=days))\
            .filter(MetEngagementModel.status_id == MetEngagementStatus.Closed.value).all()


    @staticmethod
    def _redact_comments_by_submission_ids(submission_ids: List[int], session) -> List[MetCommentModel]:
        session.query(MetCommentModel)\
        .filter(MetCommentModel.submission_id.in_(submission_ids))\
        .update({MetCommentModel.text: '[Comment Redacted]'}, synchronize_session=False)


    @staticmethod
    def _redact_submission_json_comments(submission_ids: List[int], session) -> List[MetSubmissionModel]:
        keys_to_redact = ['simpletextarea', 'simpletextfield']
        for submission in session.query(MetSubmissionModel).filter(MetSubmissionModel.id.in_(submission_ids)):
            new_submission_json = {}
            for key, value in submission.submission_json.items():
                if any(key.startswith(redacted_key) for redacted_key in keys_to_redact):
                    new_submission_json[key] = '[Comment Redacted]'
                else:
                    new_submission_json[key] = value
            submission.submission_json = new_submission_json

