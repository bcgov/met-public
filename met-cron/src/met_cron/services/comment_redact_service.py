from datetime import datetime, timedelta
from typing import List

from flask import current_app

from met_api.constants.engagement_status import Status as MetEngagementStatus
from met_api.constants.comment_status import Status as CommentStatus
from met_api.constants.user import SYSTEM_USER
from met_api.models.comment import Comment as MetCommentModel
from met_api.models.engagement import Engagement as MetEngagementModel
from met_api.models.submission import Submission as MetSubmissionModel
from met_api.models.db import db
from sqlalchemy import and_


class CommentRedactService:  # pylint: disable=too-few-public-methods
    """Redaction Service on Comments."""

    @staticmethod
    def do_redact_comments():
        """Perform the redaction on rejected comments.

            1. Get submissions for engagements closed for N_DAYS
            2. Redact comments in comments table by submission_ids
            3. Redact comments in submission_json by submission_ids

        """
        n_days: int = int(current_app.config.get('N_DAYS'))
        submissions = CommentRedactService._find_submissions_for_n_days_closed_engagements(days=current_app.config.get(n_days, 14))
        if not submissions:
            current_app.logger.info(f'>>>>>No Submissions for Engagements closed for {current_app.config.get(n_days, 14)} days found.')
            return        
        current_app.logger.info('>>>>>Total Submissions to redact found: %s.', len(submissions))
        submissions_ids = [submission.id for submission in submissions]
        CommentRedactService._redact_comments_by_submission_ids(submissions_ids)
        CommentRedactService._redact_submission_json_comments(submissions_ids)
        db.session.commit()


    @staticmethod
    def _find_submissions_for_n_days_closed_engagements(days) -> List[MetSubmissionModel]:        
        current_app.logger.info(f'>>>>>Finding submissions for Engagements closed for {days} days.')
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
    def _redact_comments_by_submission_ids(submission_ids: List[int]):
        current_app.logger.info(f'>>>>>Redacting comments for submissions: {submission_ids}')
        db.session.query(MetCommentModel)\
        .filter(MetCommentModel.submission_id.in_(submission_ids))\
        .update(
            {
                MetCommentModel.text: current_app.config.get('REDACTION_TEXT', '[Comment Redacted]'),                
                MetCommentModel.updated_by: SYSTEM_USER,
                MetCommentModel.updated_date: datetime.utcnow(),
            },
            synchronize_session=False)


    @staticmethod
    def _redact_submission_json_comments(submission_ids: List[int]):
        current_app.logger.info(f'>>>>>Fetching keys to redact aka component_types from comments for submissions: {submission_ids}')
        comments = db.session.query(MetCommentModel)\
        .filter(MetCommentModel.submission_id.in_(submission_ids))\
        .all()
        # e.g. ['simpletextarea', 'simpletextarea1', 'simpletextfield']
        keys_to_redact = [comment.component_id for comment in comments]

        current_app.logger.info(f'>>>>>Redacting comments in submission_json for submissions: {submission_ids}')
        for submission in db.session.query(MetSubmissionModel).filter(MetSubmissionModel.id.in_(submission_ids)):
            new_submission_json = {}
            for key, value in submission.submission_json.items():
                if key in keys_to_redact:
                    new_submission_json[key] = current_app.config.get('REDACTION_TEXT', '[Comment Redacted]')
                else:
                    new_submission_json[key] = value
            submission.submission_json = new_submission_json
            submission.updated_by = SYSTEM_USER
            submission.updated_date = datetime.utcnow()
