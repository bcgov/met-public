"""Engagement model class.

Manages the engagement
"""

from datetime import datetime, timedelta
from marshmallow import EXCLUDE, Schema, fields

from met_api.constants.engagement_status import Status, SubmissionStatus
from met_api.schemas.engagement_survey import EngagementSurveySchema
from met_api.utils.datetime import local_datetime

from .engagement_status import EngagementStatusSchema


class EngagementSchema(Schema):
    """Schema for engagement."""

    class Meta:  # pylint: disable=too-few-public-methods
        """Exclude unknown fields in the deserialized output."""

        unknown = EXCLUDE

    id = fields.Int(data_key='id')
    name = fields.Str(data_key='name')
    description = fields.Str(data_key='description')
    rich_description = fields.Str(data_key='rich_description')
    start_date = fields.Date(data_key='start_date')
    end_date = fields.Date(data_key='end_date')
    status_id = fields.Int(data_key='status_id')
    created_by = fields.Str(data_key='created_by')
    created_date = fields.Str(data_key='created_date')
    updated_by = fields.Str(data_key='updated_by')
    updated_date = fields.Str(data_key='updated_date')
    published_date = fields.Str(data_key='published_date')
    content = fields.Str(data_key='content')
    rich_content = fields.Str(data_key='rich_content')
    banner_filename = fields.Str(data_key='banner_filename')
    engagement_status = fields.Nested(EngagementStatusSchema)
    surveys = fields.List(fields.Nested(EngagementSurveySchema))
    submission_status = fields.Method('get_submission_status')
    submissions_meta_data = fields.Method('get_submissions_meta_data')

    def get_submissions_meta_data(self, obj):
        """Get the meta data of the submissions made in the survey."""
        if len(obj.surveys) == 0:
            return {
                'total': '0'
            }
        return {
            'total': len(obj.surveys[0].submissions),
        }

    def get_submission_status(self, obj):
        """Get the submission status of the engagement."""
        if obj.status_id == Status.Draft.value:
            return SubmissionStatus.Upcoming.value

        if obj.status_id == Status.Closed.value:
            return SubmissionStatus.Closed.value

        now = local_datetime()
        date_due = (now + timedelta(days=1))
        date_due = datetime(date_due.year, date_due.month, date_due.day)

        if obj.start_date <= date_due <= obj.end_date:
            return SubmissionStatus.Open.value

        if datetime.now() <= obj.start_date:
            return SubmissionStatus.Upcoming.value

        return SubmissionStatus.Closed.value
