"""Comment model class.

Manages the comment
"""
from datetime import datetime

from sqlalchemy import TEXT, and_, asc, cast, desc
from sqlalchemy.sql import text
from sqlalchemy.sql.schema import ForeignKey

from met_api.constants.comment_status import Status
from met_api.models.pagination_options import PaginationOptions
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
        return db.session.query(Comment).join(CommentStatus).join(Survey).filter(Comment.id == comment_id).first()

    @classmethod
    def get_comments_by_survey_id_paginated(cls, survey_id, pagination_options: PaginationOptions, search_text=''):
        """Get comments paginated."""
        query = db.session.query(Comment)\
            .join(CommentStatus)\
            .join(Survey)\
            .filter(Comment.survey_id == survey_id)\

        if search_text:
            # Remove all non-digit characters from search text
            query = query.filter(cast(Comment.id, TEXT).like('%' + search_text + '%'))

        sort = asc(text(pagination_options.sort_key)) if pagination_options.sort_order == 'asc'\
            else desc(text(pagination_options.sort_key))

        query = query.order_by(sort)

        no_pagination_options = not pagination_options.page or not pagination_options.size
        if no_pagination_options:
            items = query.all()
            return items, len(items)

        page = query.paginate(page=pagination_options.page, per_page=pagination_options.size)

        return page.items, page.total

    @classmethod
    def get_accepted_comments_by_survey_id_where_engagement_closed_paginated(
            cls, survey_id, pagination_options: PaginationOptions):
        """Get comments for closed engagements."""
        now = datetime.now()
        query = db.session.query(Comment)\
            .join(CommentStatus)\
            .join(Survey)\
            .join(Engagement, Engagement.id == Survey.engagement_id)\
            .filter(
                and_(
                    Comment.survey_id == survey_id,
                    Engagement.end_date < now,
                    CommentStatus.id == Status.Approved.value
                ))\

        query = query.order_by(Comment.id.desc())

        no_pagination_options = not pagination_options.page or not pagination_options.size
        if no_pagination_options:
            items = query.all()
            return items, len(items)

        page = query.paginate(page=pagination_options.page, per_page=pagination_options.size)

        return page.items, page.total

    @staticmethod
    def __create_new_comment_entity(comment):
        """Create new comment entity."""
        return Comment(
            text=comment.get('text', None),
            submission_date=datetime.utcnow(),
            status_id=Status.Pending.value,
            survey_id=comment.get('survey_id', None),
            user_id=comment.get('user_id', None)
        )

    @classmethod
    def add_all_comments(cls, comments: list) -> DefaultMethodResult:
        """Save comments."""
        new_comments = [cls.__create_new_comment_entity(comment) for comment in comments]
        db.session.add_all(new_comments)
        db.session.commit()
        return DefaultMethodResult(True, 'Comments Added', 1)

    @classmethod
    def update_comment_status(cls, comment_id, status_id, reviewed_by) -> DefaultMethodResult:
        """Update comment status."""
        query = Comment.query.filter_by(id=comment_id)

        if not query.first():
            return DefaultMethodResult(False, 'Survey Not Found', comment_id)

        update_fields = dict(
            status_id=status_id,
            reviewed_by=reviewed_by,
            review_date=datetime.utcnow()
        )
        query.update(update_fields)
        db.session.commit()
        return DefaultMethodResult(True, 'Survey Updated', comment_id)
