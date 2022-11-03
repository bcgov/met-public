
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
    def create_contact(contact_data, user_id):
        """Create contact."""
        contact_data['created_by'] = user_id
        contact_data['updated_by'] = user_id
        return Contact.create_contact(contact_data)
    
    
    def create_or_update_user(self, user: UserSchema):
        """Create or update a user."""
        self.validate_fields(user)

        external_id = user.get('external_id')
        db_user = User.get_user_by_external_id(external_id)
        if db_user is None:
            return User.create_user(user)
        return User.update_user(db_user.id, user)

