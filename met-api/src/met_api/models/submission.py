"""Submission model class.

Manages the Submission
"""
from __future__ import annotations
from datetime import datetime
from typing import List
from sqlalchemy import TEXT, ForeignKey, asc, cast, desc, text
from sqlalchemy.dialects import postgresql

from met_api.constants.comment_status import Status
from met_api.models.pagination_options import PaginationOptions
from met_api.models.survey import Survey
from met_api.models.user import User
from met_api.schemas.submission import SubmissionSchema

from .db import db
from .default_method_result import DefaultMethodResult


class Submission(db.Model):  # pylint: disable=too-few-public-methods
    """Definition of the Submission entity."""

    __tablename__ = 'submission'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    submission_json = db.Column(postgresql.JSONB(astext_type=db.Text()), nullable=False, server_default='{}')
    survey_id = db.Column(db.Integer, ForeignKey('survey.id', ondelete='CASCADE'), nullable=False)
    engagement_id = db.Column(db.Integer, ForeignKey('engagement.id', ondelete='CASCADE'), nullable=False)
    user_id = db.Column(db.Integer, ForeignKey('met_users.id'), nullable=True)
    created_date = db.Column(db.DateTime, default=datetime.utcnow)
    updated_date = db.Column(db.DateTime, onupdate=datetime.utcnow)
    created_by = db.Column(db.String(50), nullable=True)
    updated_by = db.Column(db.String(50), nullable=True)
    reviewed_by = db.Column(db.String(50))
    review_date = db.Column(db.DateTime)
    comment_status_id = db.Column(db.Integer, ForeignKey('comment_status.id', ondelete='SET NULL'))
    has_personal_info = db.Column(db.Boolean, nullable=True)
    has_profanity = db.Column(db.Boolean, nullable=True)
    rejected_reason_other = db.Column(db.String(50), nullable=True)
    has_threat = db.Column(db.Boolean, nullable=True)
    notify_email = db.Column(db.Boolean(), default=True)
    comments = db.relationship('Comment', backref='submission', cascade='all, delete')
    staff_note = db.relationship('StaffNote', backref='submission', cascade='all, delete')

    @classmethod
    def get(cls, submission_id) -> Submission:
        """Get a submission by id."""
        return db.session.query(Submission).filter_by(id=submission_id).first()

    @classmethod
    def get_by_survey_id(cls, survey_id) -> List[SubmissionSchema]:
        """Get submissions by survey id."""
        return db.session.query(Submission).filter_by(survey_id=survey_id).all()

    @classmethod
    def create(cls, submission: SubmissionSchema, session=None) -> Submission:
        """Save submission."""
        new_submission = Submission(
            submission_json=submission.get('submission_json', None),
            engagement_id=submission.get('engagement_id', None),
            survey_id=submission.get('survey_id', None),
            user_id=submission.get('user_id', None),
            created_date=datetime.utcnow(),
            updated_date=None,
            created_by=submission.get('created_by', None),
            updated_by=submission.get('updated_by', None),
            comment_status_id=Status.Pending.value,
        )
        if session is None:
            db.session.add(new_submission)
            db.session.commit()
        else:
            session.add(new_submission)
            session.flush()
        return new_submission

    @classmethod
    def update(cls, submission: SubmissionSchema, session=None) -> Submission:
        """Update submission."""
        update_fields = dict(
            submission_json=submission.get('submission_json', None),
            updated_date=datetime.utcnow(),
            updated_by=submission.get('updated_by', None),
        )
        submission_id = submission.get('id', None)
        query = Submission.query.filter_by(id=submission_id)
        record = query.first()
        if not record:
            raise ValueError('Submission Not Found')
        query.update(update_fields)
        if session is None:
            db.session.commit()
        else:
            session.flush()
        return query.first()

    @classmethod
    def update_comment_status(cls, submission_id, comment: dict, session=None) -> Submission:
        """Update comment status."""
        status_id = comment.get('status_id', None)
        has_personal_info = comment.get('has_personal_info', None)
        has_profanity = comment.get('has_profanity', None)
        has_threat = comment.get('has_threat', None)
        rejected_reason_other = comment.get('rejected_reason_other', None)
        notify_email = comment.get('notify_email', None)

        query = Submission.query.filter_by(id=submission_id)

        if not query.first():
            return DefaultMethodResult(False, 'Submission Not Found', submission_id)

        update_fields = dict(
            comment_status_id=status_id,
            has_personal_info=has_personal_info,
            has_profanity=has_profanity,
            has_threat=has_threat,
            rejected_reason_other=rejected_reason_other,
            notify_email=notify_email,
            reviewed_by=comment.get('reviewed_by'),
            review_date=datetime.utcnow(),
            updated_by=comment.get('user_id'),
            updated_date=datetime.utcnow(),
        )

        query.update(update_fields)
        if session is None:
            db.session.commit()
        else:
            session.flush()

        return query.first()

    @classmethod
    def get_by_survey_id_paginated(cls, survey_id, pagination_options: PaginationOptions, search_text=''):
        """Get submissions by survey id paginated."""
        query = db.session.query(Submission)\
            .filter(Submission.survey_id == survey_id)\

        if search_text:
            # Remove all non-digit characters from search text
            query = query.filter(cast(Submission.id, TEXT).like('%' + search_text + '%'))

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
    def get_engaged_users(cls, engagement_id) -> List[User]:
        """Get users that have submissions for the specified engagement id."""
        users = db.session.query(User)\
            .join(Submission)\
            .join(Survey)\
            .filter(Survey.engagement_id == engagement_id)\
            .all()
        return users
