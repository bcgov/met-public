"""Calculate the submission status."""

from datetime import datetime

from met_api.constants.comment_status import Status as CommentStatus
from met_api.constants.engagement_status import Status, SubmissionStatus
from met_api.utils.datetime import local_datetime

def get_submission_status(obj):
    """Get the submission status of the engagement."""
    if obj.status_id == Status.Draft.value or obj.status_id == Status.Scheduled.value:
        return SubmissionStatus.Upcoming.value

    if obj.status_id == Status.Closed.value:
        return SubmissionStatus.Closed.value

    now = local_datetime()
    
    # Strip time off datetime object
    date_due = datetime(now.year, now.month, now.day)

    if obj.start_date <= date_due <= obj.end_date:
        return SubmissionStatus.Open.value

    if date_due <= obj.start_date:
        return SubmissionStatus.Upcoming.value

    return SubmissionStatus.Closed.value