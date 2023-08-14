
"""Service for contact management."""
from met_api.models.contact import Contact
from met_api.schemas.contact import ContactSchema
from met_api.services.object_storage_service import ObjectStorageService


class ContactService:
    """Contact management service."""

    def __init__(self):
        """Initialize the service."""
        self.object_storage = ObjectStorageService()

    def get_contact_by_id(self, contact_id):
        """Get contact by id."""
        contact_record = Contact.find_by_id(contact_id)
        contact = ContactSchema().dump(contact_record)
        contact['avatar_url'] = self.object_storage.get_url(contact.get('avatar_filename', None))
        return contact

    def get_contacts(self):
        """Get contacts."""
        contacts_records = Contact.get_contacts()
        contacts = ContactSchema(many=True).dump(contacts_records)
        contacts = [{
            **contact,
            'avatar_url': self.object_storage.get_url(contact.get('avatar_filename', None))
        } for contact in contacts]
        return contacts

    @staticmethod
    def create_contact(contact_data):
        """Create contact."""
        return Contact.create_contact(contact_data)

    @staticmethod
    def update_contact(data: dict):
        """Update contact partially."""
        updated_contact = Contact.update_contact(data)
        if not updated_contact:
            raise ValueError('Contact to update was not found')
        return Contact.update_contact(data)
