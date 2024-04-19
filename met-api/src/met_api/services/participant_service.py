"""Service for user management."""
from met_api.models.participant import Participant as ParticipantModel


class ParticipantService:
    """Participant management service."""

    @staticmethod
    def get_or_create_by_email(email_address):
        """Get or create a participant matching the email address."""
        db_participant = ParticipantModel.get_by_email(email_address)
        if db_participant is not None:
            return db_participant

        new_user = {
            'email_address': email_address,
        }
        db_participant = ParticipantModel.create(new_user)
        if not db_participant:
            raise ValueError('Error creating participant')
        return db_participant
