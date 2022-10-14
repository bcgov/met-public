
"""Service for contact management."""
from met_api.models.contact import Contact
from met_api.schemas.contact import ContactSchema


class ContactService:
    """Contact management service."""

    @staticmethod
    def get_contact_by_id(contact_id):
        """Get contact by id."""
        contact_record = Contact.get_contact_by_id(contact_id)
        return ContactSchema().dump(contact_record)

    @staticmethod
    def get_contacts():
        """Get contacts."""
        contacts_records = Contact.get_contacts()        
        return ContactSchema(many=True).dump(contacts_records)

    @staticmethod
    def create_contact(data: ContactSchema):
        """Create contact."""
        return Contact.create_contact(data)
