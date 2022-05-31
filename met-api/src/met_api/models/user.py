"""User model class.

Manages the user
"""
import datetime

from .db import db, ma


class User(db.Model):  # pylint: disable=too-few-public-methods
    """Definition of the User entity."""

    __tablename__ = 'user'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    first_name = db.Column(db.String(50))
    middle_name = db.Column(db.String(50), nullable=True)
    last_name = db.Column(db.String(50))
    email_id = db.Column(db.String(50))
    contact_number = db.Column(db.String(50), nullable=True)
    created_date = db.Column(db.DateTime, default=datetime.datetime.utcnow)
    updated_date = db.Column(db.DateTime, onupdate=datetime.datetime.utcnow)
    engagement_id = db.relationship('Engagement', backref='user', cascade='all, delete')

    @classmethod
    def find_by_id(cls, _id):
        """Return the first user with the provided username."""
        return cls.query.filter_by(id=_id).first()


class UserSchema(ma.Schema):
    """This class represents the UserSchema table."""

    class Meta:  # pylint: disable=too-few-public-methods
        """Meta class for UserSchema."""

        fields = ('id', 'first_name', 'middle_name', 'last_name', 'email_id', 'contact_number',
                  'created_date', 'updated_date')
