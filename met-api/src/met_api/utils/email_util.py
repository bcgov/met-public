"""Email queue publishing utility.

Manages the Email queue
"""
from met_api.models.email_queue import EmailQueue


def publish_to_email_queue(entity_type, entity_id, event_type, do_commit=False):
    """Publish an event to the email queue.

    The method is separated from the model class and placed in a utility function to ensure future flexibility.
    By separating the method, any future changes, such as switching from database tables to a queue system,
    can be made without modifying the calling method.
    """
    email_queue = EmailQueue(
        entity_type=entity_type,
        entity_id=entity_id,
        action=event_type,
    )
    email_queue.flush()
    if do_commit:
        email_queue.commit()
    return email_queue
