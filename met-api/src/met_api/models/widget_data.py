"""Widget data model class.

Manages the widget data status
"""
from .db import db


class WidgetData(db.Model):  # pylint: disable=too-few-public-methods
    """Definition of the Widget Type entity."""

    __tablename__ = 'widget_data'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), unique=True, nullable=False)
    description = db.Column(db.String(50))

    @classmethod
    def get_widget_data(cls, widget_id):
        """Get a comment."""
        return db.session.query(Comment).join(CommentStatus).join(Survey).filter(Comment.id == comment_id).first()
