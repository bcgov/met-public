"""User model class.

Manages the user
"""
from __future__ import annotations
from datetime import datetime

from .db import db, ma
from .default_method_result import DefaultMethodResult


class User(db.Model):  # pylint: disable=too-few-public-methods
    """Definition of the User entity."""

    __tablename__ = 'user'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    first_name = db.Column(db.String(50))
    middle_name = db.Column(db.String(50), nullable=True)
    last_name = db.Column(db.String(50))
    email_id = db.Column(db.String(50))
    contact_number = db.Column(db.String(50), nullable=True)
    external_id = db.Column(db.String(50), nullable=False, unique=True)
    created_date = db.Column(db.DateTime, default=datetime.utcnow)
    updated_date = db.Column(db.DateTime, onupdate=datetime.utcnow)
    engagement_id = db.relationship('Engagement', backref='user', cascade='all, delete')
    @classmethod
    def get_user(cls, _id):
        """Get a user with the provided id."""
        return cls.query.filter_by(id=_id).first()

    @classmethod
    def get_user_by_external_id(cls, _external_id) -> User:
        """Get a user with the provided external id."""
        return cls.query.filter_by(external_id=_external_id).first()

    @classmethod
    def create_user(cls, user) -> DefaultMethodResult:
        """Create user."""
        new_user = User(
            first_name=user.get('first_name', None),
            middle_name=user.get('middle_name', None),
            last_name=user.get('last_name', None),
            email_id=user.get('email_id', None),
            contact_number=user.get('contact_number', None),
            external_id=user.get('external_id', None),
            created_date=datetime.utcnow(),
            updated_date=datetime.utcnow(),
        )
        db.session.add(new_user)
        db.session.commit()

        return DefaultMethodResult(True, 'User Added', new_user.id)

    @classmethod
    def update_user(cls, user_id, user) -> DefaultMethodResult:
        """Update user."""
        update_fields = dict(
            first_name=user.get('first_name', None),
            middle_name=user.get('middle_name', None),
            last_name=user.get('last_name', None),
            email_id=user.get('email_id', None),
            contact_number=user.get('contact_number', None),
            external_id=user.get('external_id', None),
            updated_date=datetime.utcnow(),
        )
        User.query.filter_by(id=user_id).update(update_fields)
        db.session.commit()
        return DefaultMethodResult(True, 'User Updated', user_id)


class UserSchema(ma.Schema):
    """This class represents the UserSchema table."""

    class Meta:  # pylint: disable=too-few-public-methods
        """Meta class for UserSchema."""

        fields = ('id', 'first_name', 'middle_name', 'last_name', 'email_id', 'contact_number', 'external_id',
                  'created_date', 'updated_date')
