"""User model class.

Manages the user
"""
from __future__ import annotations

from datetime import datetime
from typing import Optional

from sqlalchemy import Column, ForeignKey, String, func

from .db import db, ma


class User(db.Model):  # pylint: disable=too-few-public-methods
    """Definition of the User entity."""

    __tablename__ = 'met_users'

    id = Column(db.Integer, primary_key=True, autoincrement=True)
    first_name = Column(db.String(50))
    middle_name = Column(db.String(50), nullable=True)
    last_name = Column(db.String(50))
    # To store the IDP user name..ie IDIR username
    username = Column('username', String(100), index=True)
    email_id = Column(db.String(50))
    contact_number = Column(db.String(50), nullable=True)
    external_id = Column(db.String(50), nullable=False, unique=True)
    created_date = Column(db.DateTime, default=datetime.utcnow)
    updated_date = Column(db.DateTime, onupdate=datetime.utcnow)
    # a type for the user to identify what kind of user it is..STAFF/PUBLIC_USER etc
    access_type = Column('access_type', String(200), nullable=True)
    status_id = db.Column(db.Integer, ForeignKey('user_status.id'))

    @classmethod
    def get_user(cls, _id):
        """Get a user with the provided id."""
        return cls.query.filter_by(id=_id).first()

    @classmethod
    def find_users_by_acess_type(cls, user_access_type):
        """Get a user with the provided id."""
        return cls.query.filter_by(access_type=user_access_type).all()

    @classmethod
    def get_user_by_external_id(cls, _external_id) -> User:
        """Get a user with the provided external id."""
        return cls.query.filter(func.lower(User.external_id) == func.lower(_external_id)).first()

    @classmethod
    def create_user(cls, user) -> User:
        """Create user."""
        new_user = User(
            first_name=user.get('first_name', None),
            middle_name=user.get('middle_name', None),
            last_name=user.get('last_name', None),
            email_id=user.get('email_id', None),
            contact_number=user.get('contact_number', None),
            external_id=user.get('external_id', None),
            created_date=datetime.utcnow(),
            updated_date=None,
        )
        db.session.add(new_user)
        db.session.commit()

        return new_user

    @classmethod
    def update_user(cls, user_id, user_dict) -> Optional[User]:
        """Update user."""
        query = User.query.filter_by(id=user_id)
        user: User = query.first()
        if not user:
            return None

        update_fields = dict(
            first_name=user_dict.get('first_name', user.first_name),
            middle_name=user_dict.get('middle_name', user.middle_name),
            last_name=user_dict.get('last_name', user.last_name),
            email_id=user_dict.get('email_id', user.last_name),
            contact_number=user_dict.get('contact_number', user.contact_number),
            external_id=user_dict.get('external_id', user.external_id),
            updated_date=datetime.utcnow(),
        )

        query.update(update_fields)
        db.session.commit()
        return user


class UserSchema(ma.Schema):
    """This class represents the UserSchema table."""

    class Meta:  # pylint: disable=too-few-public-methods
        """Meta class for UserSchema."""

        fields = ('id', 'first_name', 'middle_name', 'last_name', 'email_id', 'contact_number', 'external_id',
                  'created_date', 'updated_date')
