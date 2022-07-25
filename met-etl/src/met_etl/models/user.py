"""user model class.

Manages the user details
"""
from datetime import datetime
from .db import db


class user(db.Model):  # pylint: disable=too-few-public-methods
    """Definition of the user entity."""

    __bind_key__ = 'met_db_analytics'
    __tablename__ = 'user'
    

    id = db.Column(db.Integer, primary_key=True, nullable=False)
    name = db.Column(db.String(100))
    created_date = db.Column(db.DateTime, default=datetime.utcnow)
    updated_date = db.Column(db.DateTime, onupdate=datetime.utcnow)

    @classmethod
    def get_all(cls):
        """Get all user."""
        return db.session.query(user).all()