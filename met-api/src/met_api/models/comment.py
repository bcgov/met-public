"""Comment model class.

Manages the comment
"""
from __future__ import annotations
from datetime import datetime

from sqlalchemy import TEXT, and_, asc, cast, desc
from sqlalchemy.sql import text
from sqlalchemy.sql.schema import ForeignKey

from met_api.constants.comment_status import Status
from met_api.constants.engagement_status import Status as EngStatus
from met_api.models.pagination_options import PaginationOptions
from met_api.models.engagement import Engagement
from met_api.models.submission import Submission
from met_api.models.user import User
from met_api.models.survey import Survey
from met_api.schemas.comment import CommentSchema

from .comment_status import CommentStatus
from .db import db


class Comment(db.Model):
    """Definition of the Comment entity."""

    __tablename__ = 'comment'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    text = db.Column(db.Text, unique=False, nullable=False)
    submission_date = db.Column(db.DateTime)
    survey_id = db.Column(db.Integer, ForeignKey('survey.id', ondelete='CASCADE'), nullable=False)
    user_id = db.Column(db.Integer, ForeignKey('met_users.id', ondelete='SET NULL'), nullable=True)
    submission_id = db.Column(db.Integer, ForeignKey('submission.id', ondelete='SET NULL'), nullable=True)
    component_id = db.Column(db.String(10))
    created_date = db.Column(db.DateTime, default=datetime.utcnow)
    updated_date = db.Column(db.DateTime, onupdate=datetime.utcnow)
    created_by = db.Column(db.String(50), nullable=True)
    updated_by = db.Column(db.String(50), nullable=True)

    @classmethod
    def get_comment(cls, comment_id):
        """Get a comment."""
        return db.session.query(Comment)\
            .join(Survey)\
            .filter(Comment.id == comment_id)\
            .first()

    @classmethod
    def get_by_submission(cls, submission_id):
        """Get comments by submission id."""
        return db.session.query(Comment)\
            .join(Survey)\
            .filter(Comment.submission_id == submission_id)\
            .all()

    @classmethod
    def get_comments_by_survey_id_paginated(cls, survey_id, pagination_options: PaginationOptions, search_text=''):
        """Get comments paginated."""
        query = db.session.query(Comment)\
            .join(Survey)\
            .filter(Comment.survey_id == survey_id)\

        if search_text:
            # Remove all non-digit characters from search text
            query = query.filter(cast(Comment.id, TEXT).like('%' + search_text + '%'))

        sort = asc(text(pagination_options.sort_key)) if pagination_options.sort_order == 'asc'\
            else desc(text(pagination_options.sort_key))

        query = query.order_by(sort)

        no_pagination_options = not pagination_options or not pagination_options.page or not pagination_options.size
        if no_pagination_options:
            items = query.all()
            return items, len(items)

        page = query.paginate(page=pagination_options.page, per_page=pagination_options.size)

        return page.items, page.total

    @classmethod
    def get_accepted_comments_by_survey_id_where_engagement_closed_paginated(
            cls, survey_id, pagination_options: PaginationOptions):
        """Get comments for closed engagements."""
        query = db.session.query(Comment)\
            .join(Submission, Submission.id == Comment.submission_id)\
            .join(CommentStatus, Submission.comment_status_id == CommentStatus.id)\
            .join(Survey, Survey.id == Submission.survey_id)\
            .join(Engagement, Engagement.id == Survey.engagement_id)\
            .filter(
                and_(
                    Comment.survey_id == survey_id,
                    Engagement.status_id == EngStatus.Closed.value,
                    CommentStatus.id == Status.Approved.value
                ))\

        query = query.order_by(Comment.id.desc())

        no_pagination_options = not pagination_options or not pagination_options.page or not pagination_options.size
        if no_pagination_options:
            items = query.all()
            return items, len(items)

        page = query.paginate(page=pagination_options.page, per_page=pagination_options.size)

        return page.items, page.total

    @staticmethod
    def __create_new_comment_entity(comment: CommentSchema):
        """Create new comment entity."""
        return Comment(
            text=comment.get('text', None),
            submission_date=datetime.utcnow(),
            created_date=datetime.utcnow(),
            created_by=comment.get('user_id', None),
            survey_id=comment.get('survey_id', None),
            user_id=comment.get('user_id', None),
            submission_id=comment.get('submission_id', None),
            component_id=comment.get('component_id', None)
        )

    @classmethod
    def add_all_comments(cls, comments: list, session=None) -> list[Comment]:
        """Create comments."""
        new_comments = [cls.__create_new_comment_entity(comment) for comment in comments]
        if session is None:
            db.session.add_all(new_comments)
            db.session.commit()
        else:
            session.add_all(new_comments)
        return new_comments

    @classmethod
    def update(cls, submission_id, comment: CommentSchema, session=None) -> Comment:
        """Update comment text."""
        query = Comment.query.filter_by(id=comment.get('id'), submission_id=submission_id)
        update_fields = dict(
            text=comment.get('text', None),
            updated_by=comment.get('user_id', None),
            updated_date=datetime.utcnow(),
        )

        query.update(update_fields)
        if session is None:
            db.session.commit()
        else:
            session.flush()
        return query.first()

    @classmethod
    def get_comments_by_survey_id(cls, survey_id):
        """Get comments paginated."""
        query = db.session.query(
            Comment.id,
            Comment.submission_date,
            Comment.text,
            User.first_name,
            User.last_name,
            Submission.reviewed_by
        )\
            .join(Submission, Submission.id == Comment.submission_id) \
            .join(User, User.id == Comment.user_id) \
            .add_entity(Submission)\
            .add_entity(User)\
            .filter(Comment.survey_id == survey_id)

        query = query.order_by(Comment.id.asc())

        return query.all()
