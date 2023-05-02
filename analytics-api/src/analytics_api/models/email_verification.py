"""Email verification model class.

Manages the Email verification
"""
from sqlalchemy.sql.expression import true

from .base_model import BaseModel
from .db import db


class EmailVerification(BaseModel):  # pylint: disable=too-few-public-methods
    """Definition of the Email verification entity."""

    __tablename__ = 'email_verification'

    id = db.Column(db.Integer, primary_key=True, nullable=False, autoincrement=True)
    source_email_ver_id = db.Column(db.Integer, comment='Source System Id.')
    user_id = db.Column(db.Integer)
    engagement_id = db.Column(db.Integer, comment='Source System Engagement Id.')
    survey_id = db.Column(db.Integer, comment='Source System Survey Id.')

    @classmethod
    def get_email_verification_count(
        cls,
        engagement_id
    ):
        """Get email verification count for an engagement id."""
        email_verification_count = (db.session.query(EmailVerification)
                                    .filter(EmailVerification.engagement_id == engagement_id)
                                    .filter(EmailVerification.is_active == true()))

        return email_verification_count.count()
