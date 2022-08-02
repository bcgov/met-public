"""Engagement Status model class.

Manages the engagement status
"""
from datetime import datetime

from .db import db, ma


class CommentStatus(db.Model):  # pylint: disable=too-few-public-methods
    """Definition of the Comment Status entity."""

    __tablename__ = 'comment_status'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    status_name = db.Column(db.String(50), unique=True, nullable=False)
    description = db.Column(db.String(50))
    created_date = db.Column(db.DateTime, default=datetime.utcnow)
    updated_date = db.Column(db.DateTime, onupdate=datetime.utcnow)
    comment = db.relationship('Comment', backref='comment_status', cascade='all, delete')


class CommentStatusSchema(ma.Schema):
    """Comment status schema."""

    class Meta:  # pylint: disable=too-few-public-methods
        """Meta class."""

        fields = ('id', 'status_name', 'description', 'created_date', 'updated_date')
