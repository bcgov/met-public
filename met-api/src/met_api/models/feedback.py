"""Feedback model class.

Manages the feedback
"""
from datetime import datetime
import enum

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


class RatingType(enum.Enum):
    VerySatisfied = 1
    Satisfied = 2
    Neutral = 3
    Unsatisfied = 4
    VeryUnsatisfied = 5

class CommentType(enum.Enum):
    Issue = 1
    Idea = 2
    Else = 3

class Feedback(db.Model):
    """Definition of the Feedback entity."""

    __tablename__ = 'feedback'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    created_date = db.Column(db.DateTime)
    rating = db.Column(db.Enum(RatingType), nullable=False)
    comment_type = db.Column(db.Enum(CommentType), nullable=True)
    comment = db.Column(db.Text, nullable=True)

    @classmethod
    def get(cls, feedback_id):
        """Get a feedback."""
        return db.session.query(Feedback).filter(Feedback.id == feedback_id).first()

    @classmethod
    def get_all_paginated(cls, pagination_options: PaginationOptions, search_text=''):
        """Get feedback paginated."""
        query = db.session.query(Feedback)

        if search_text:
            # Remove all non-digit characters from search text
            query = query.filter(cast(Feedback.id, TEXT).like('%' + search_text + '%'))

        sort = asc(text(pagination_options.sort_key)) if pagination_options.sort_order == 'asc'\
            else desc(text(pagination_options.sort_key))

        query = query.order_by(sort)

        no_pagination_options = not pagination_options.page or not pagination_options.size
        if no_pagination_options:
            items = query.all()
            return items, len(items)

        page = query.paginate(page=pagination_options.page, per_page=pagination_options.size)

        return page.items, page.total

    
    @staticmethod
    def create_feedback(feedback):
        """Create new feedback entity."""
        new_feedback = Feedback(
            comment=feedback.get('comment', None),
            created_date=datetime.utcnow(),
            rating=feedback.get('rating'),
            comment_type=feedback.get('commentType', None)
        )
        db.session.add(new_feedback)
        db.session.commit()
        return new_feedback
