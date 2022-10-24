"""Contact model class.

Manages the contact
"""
from __future__ import annotations

from datetime import datetime

from .db import db


class Contact(db.Model):  # pylint: disable=too-few-public-methods
    """Definition of the Contact entity."""

    __tablename__ = 'contact'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(50))
    title = db.Column(db.String(50))
    email = db.Column(db.String(50))
    phone_number = db.Column(db.String(50), nullable=True)
    address = db.Column(db.String(150))
    bio = db.Column(db.String(500), comment='A biography or short biographical profile of someone.')
    created_date = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_date = db.Column(db.DateTime, onupdate=datetime.utcnow, nullable=False)
    created_by = db.Column(db.String(50), nullable=False)
    updated_by = db.Column(db.String(50), nullable=False)

    @classmethod
    def get_contact_by_id(cls, contact_id) -> Contact:
        """Get a contact."""
        contact = db.session.query(Contact) \
            .filter(Contact.id == contact_id) \
            .first()
        return contact

    @classmethod
    def get_contacts(cls) -> list[Contact]:
        """Get contacts."""
        return db.session.query(Contact).order_by(Contact.name).all()

    @classmethod
    def create_contact(cls, contact) -> Contact:
        """Create contact."""
        new_contact = Contact(
            name=contact.get('name', None),
            title=contact.get('title', None),
            email=contact.get('email', None),
            phone_number=contact.get('phone_number', None),
            address=contact.get('address', None),
            bio=contact.get('bio', None),
            created_date=datetime.utcnow(),
            updated_date=datetime.utcnow(),
            created_by=contact.get('created_by', None),
            updated_by=contact.get('updated_by', None),
        )
        db.session.add(new_contact)
        db.session.commit()

        return new_contact
