"""Comment model class.

Manages the comment
"""
from datetime import datetime
from sqlalchemy import and_
from sqlalchemy.sql.schema import ForeignKey
from met_api.constants.comment_status import Status
from met_api.models.engagement import Engagement
from met_api.models.survey import Survey
from .comment_status import CommentStatus
from .db import db
from .default_method_result import DefaultMethodResult


class Comment(db.Model):
    """Definition of the Comment entity."""

    __tablename__ = 'comment'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    text = db.Column(db.Text, unique=False, nullable=False)
    submission_date = db.Column(db.DateTime)
    reviewed_by = db.Column(db.String(50))
    review_date = db.Column(db.DateTime)
    status_id = db.Column(db.Integer, ForeignKey('comment_status.id', ondelete='SET NULL'))
    survey_id = db.Column(db.Integer, ForeignKey('survey.id', ondelete='CASCADE'), nullable=False)
    user_id = db.Column(db.Integer, ForeignKey('user.id', ondelete='SET NULL'), nullable=True)

    @classmethod
    def get_comment(cls, comment_id):
        """Get a comment."""
        return db.session.query(Comment).join(CommentStatus).join(Survey).filter_by(id=comment_id).first()

    @classmethod
    def get_comments_by_survey_id_query(cls, survey_id):
        """Get all comments."""
        return db.session.query(Comment)\
            .join(CommentStatus)\
            .join(Survey)\
            .filter(Comment.survey_id == survey_id)\
            .order_by(Comment.id.asc()).all()

    @classmethod
    def get_publicly_viewable_comments_by_survey_id_query(cls, survey_id):
        """Get all comments."""
        now = datetime.now()
        return db.session.query(Comment)\
            .join(CommentStatus)\
            .join(Survey)\
            .join(Engagement, Engagement.id == Survey.engagement_id)\
            .filter(\
                and_(\
                    Comment.survey_id == survey_id,\
                    Engagement.end_date < now,\
                    CommentStatus.id == Status.Accepted\
                )
            )\
            .order_by(Comment.id.asc()).all()

    @staticmethod
    def create_new_comment_entity(comment):
        """Create new comment entity."""
        return Comment(
            text=comment.get('text', None),
            submission_date=datetime.utcnow(),
            status_id=Status.Pending,
            survey_id=comment.get('survey_id', None)
        )

    @classmethod
    def bulk_create_comment(cls, comments: list) -> DefaultMethodResult:
        """Save comments."""
        new_comments = [cls.create_new_comment_entity(comment) for comment in comments]
        db.session.add_all(new_comments)
        db.session.commit()
        return DefaultMethodResult(True, 'Comments Added', 1)
