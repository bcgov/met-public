"""Service for Email queue."""
from met_api.models.email_queue import EmailQueue as EmailQueueModel
from met_api.schemas.email_queue import EmailQueueSchema


class EmailQueueService:  # pylint:disable=too-few-public-methods
    """Email queue service."""

    verification_expiry_hours = 24
    datetime_format = '%Y-%m-%d %H:%M:%S.%f'
    full_date_format = ' %B %d, %Y'
    date_format = '%Y-%m-%d'

    @classmethod
    def create_email_queue(cls, email_queue_data) -> EmailQueueSchema:
        """Create a email queue."""
        return EmailQueueModel.create(email_queue_data)
