"""Feedback model class.

Manages the feedback
"""
from datetime import datetime

from sqlalchemy import TEXT, asc, cast, desc
from sqlalchemy.sql import text

from met_api.constants.feedback import CommentType, FeedbackSourceType, FeedbackStatusType, RatingType
from met_api.models.pagination_options import PaginationOptions

from .base_model import BaseModel
from .db import db


class Feedback(BaseModel):
    """Definition of the Feedback entity."""

    __tablename__ = 'feedback'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    status = db.Column(db.Enum(FeedbackStatusType),
                       nullable=False, default=FeedbackStatusType.Unreviewed)
    rating = db.Column(db.Enum(RatingType), nullable=True)
    comment_type = db.Column(db.Enum(CommentType), nullable=True)
    comment = db.Column(db.Text, nullable=True)
    submission_path = db.Column(db.Text, nullable=True)
    source = db.Column(db.Enum(FeedbackSourceType), nullable=True)
    tenant_id = db.Column(
        db.Integer, db.ForeignKey('tenant.id'), nullable=True)

    @classmethod
    def get_all_paginated(cls,
                          pagination_options: PaginationOptions,
                          status: FeedbackStatusType,
                          search_text='',
                          ):
        """Get feedback paginated."""
        query = db.session.query(Feedback)

        query = query.filter_by(status=status)

        if search_text:
            # Remove all non-digit characters from search text
            query = query.filter(
                cast(Feedback.id, TEXT).like('%' + search_text + '%'))

        sort = asc(text(pagination_options.sort_key)) if pagination_options.sort_order == 'asc'\
            else desc(text(pagination_options.sort_key))

        query = query.order_by(sort)

        no_pagination_options = not pagination_options.page or not pagination_options.size
        if no_pagination_options:
            items = query.all()
            return items, len(items)

        page = query.paginate(page=pagination_options.page,
                              per_page=pagination_options.size)

        return page.items, page.total

    @staticmethod
    def create_feedback(feedback):
        """Create new feedback entity."""
        new_feedback = Feedback(
            status=feedback.get('status', None),
            comment=feedback.get('comment', None),
            submission_path=feedback.get('submission_path', None),
            created_date=datetime.utcnow(),
            rating=feedback.get('rating'),
            comment_type=feedback.get('comment_type', None),
            source=feedback.get('source', None)
        )
        db.session.add(new_feedback)
        db.session.commit()
        return new_feedback

    @classmethod
    def delete_by_id(cls, feedback_id):
        """Delete feedback by ID."""
        feedback = cls.query.get(feedback_id)
        if feedback:
            db.session.delete(feedback)
            db.session.commit()
            return True  # Successfully deleted
        return False  # Feedback not found

    @classmethod
    def update_feedback(cls, feedback_id, feedback_data):
        """Update feedback by ID."""
        feedback = cls.query.get(feedback_id)
        if not feedback:
            return None  # Feedback not found

        for key, value in feedback_data.items():
            if hasattr(feedback, key):
                setattr(feedback, key, value)

        db.session.commit()
        return feedback
