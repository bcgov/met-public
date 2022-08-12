"""Submission model class.

Manages the Submission
"""
from datetime import datetime
from typing import List
from sqlalchemy import ForeignKey
from sqlalchemy.dialects import postgresql

from met_api.models.survey import Survey
from met_api.models.user import User, UserSchema
from met_api.schemas.submission import SubmissionSchema

from .db import db
from .default_method_result import DefaultMethodResult


class Submission(db.Model):  # pylint: disable=too-few-public-methods
    """Definition of the Submission entity."""

    __tablename__ = 'submission'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    submission_json = db.Column(postgresql.JSONB(astext_type=db.Text()), nullable=False, server_default='{}')
    survey_id = db.Column(db.Integer, ForeignKey('survey.id', ondelete='CASCADE'), nullable=False)
    user_id = db.Column(db.Integer, ForeignKey('user.id'), nullable=True)
    created_date = db.Column(db.DateTime, default=datetime.utcnow)
    updated_date = db.Column(db.DateTime, onupdate=datetime.utcnow)
    created_by = db.Column(db.String(50), nullable=True)
    updated_by = db.Column(db.String(50), nullable=True)

    @classmethod
    def get(cls, submission_id) -> SubmissionSchema:
        """Get a submission."""
        submission_schema = SubmissionSchema()
        data = db.session.query(Submission).filter_by(id=submission_id).first()
        return submission_schema.dump(data)

    @classmethod
    def get_by_survey_id(cls, survey_id) -> List[SubmissionSchema]:
        """Get submissions by survey id."""
        submission_schema = SubmissionSchema(many=True)
        data = db.session.query(Submission).filter_by(survey_id=survey_id).all()
        return submission_schema.dump(data)

    @classmethod
    def create(cls, submission: SubmissionSchema) -> DefaultMethodResult:
        """Save submission."""
        new_submission = Submission(
            submission_json=submission.get('submission_json', None),
            survey_id=submission.get('survey_id', None),
            user_id=submission.get('user_id', None),
            created_date=submission.get('created_date', None),
            updated_date=submission.get('updated_date', None),
            created_by=submission.get('created_by', None),
            updated_by=submission.get('updated_by', None),
        )
        db.session.add(new_submission)
        db.session.commit()
        return DefaultMethodResult(True, 'Submission Added', new_submission.id)

    @classmethod
    def update(cls, submission: SubmissionSchema) -> DefaultMethodResult:
        """Update submission."""
        update_fields = dict(
            submission_json=submission.get('submission_json', None),
            updated_date=submission.get('updated_date', None),
            updated_by=submission.get('updated_by', None),
        )
        submission_id = submission.get('id', None)
        query = Submission.query.filter_by(id=submission_id)
        record = query.first()
        if not record:
            return DefaultMethodResult(False, 'Submission Not Found', submission_id)
        query.update(update_fields)
        db.session.commit()
        return DefaultMethodResult(True, 'Submission Updated', submission_id)

    @classmethod
    def get_engaged_users(cls, engagement_id) -> list[UserSchema]:
        """Get users that have submissions for the specified engagement id."""
        user_schema = UserSchema(many=True)
        users = db.session.query(User)\
            .join(Submission)\
            .join(Survey)\
            .filter(Survey.engagement_id == engagement_id)\
            .all()
        return user_schema.dump(users)
