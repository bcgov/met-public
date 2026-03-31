"""Comment Status model class.

Manages the comment status
"""
from .base_model import BaseModel
from .db import db, ma


class CommentStatus(BaseModel):  # pylint: disable=too-few-public-methods
    """Definition of the Comment Status entity."""

    __tablename__ = 'comment_status'

    id = db.Column(db.Integer, primary_key=True)
    status_name = db.Column(db.String(50), unique=True, nullable=False)
    description = db.Column(db.String(50))
    submission = db.relationship('Submission', backref='comment_status', cascade='all, delete')

    @classmethod
    def get_comment_statuses(cls):
        """Get all comment statuses."""
        return db.session.query(CommentStatus).all()


class CommentStatusSchema(ma.Schema):
    """Comment status schema."""

    class Meta:  # pylint: disable=too-few-public-methods
        """Meta class."""

        fields = ('id', 'status_name', 'description', 'created_date', 'updated_date')
