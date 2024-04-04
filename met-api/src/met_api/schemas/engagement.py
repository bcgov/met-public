"""Engagement model class.

Manages the engagement
"""

from datetime import datetime

from marshmallow import EXCLUDE, Schema, ValidationError, fields, validate, validates_schema

from met_api.constants.comment_status import Status as CommentStatus
from met_api.constants.engagement_status import Status, SubmissionStatus
from met_api.schemas.engagement_status_block import EngagementStatusBlockSchema
from met_api.schemas.engagement_survey import EngagementSurveySchema
from met_api.schemas.utils import count_comments_by_status
from met_api.utils.datetime import local_datetime

from .engagement_status import EngagementStatusSchema


class EngagementSchema(Schema):
    """Schema for engagement."""

    class Meta:  # pylint: disable=too-few-public-methods
        """Exclude unknown fields in the deserialized output."""

        unknown = EXCLUDE

    id = fields.Int(data_key='id')
    name = fields.Str(data_key='name', required=True, validate=validate.Length(min=1, error='Name cannot be blank'))
    description = fields.Str(data_key='description')
    rich_description = fields.Str(data_key='rich_description')
    start_date = fields.Date(data_key='start_date', required=True)
    end_date = fields.Date(data_key='end_date', required=True)
    status_id = fields.Int(data_key='status_id')
    created_by = fields.Str(data_key='created_by')
    created_date = fields.Str(data_key='created_date')
    updated_by = fields.Str(data_key='updated_by')
    updated_date = fields.Str(data_key='updated_date')
    published_date = fields.Str(data_key='published_date')
    scheduled_date = fields.Str(data_key='scheduled_date')
    banner_filename = fields.Str(data_key='banner_filename')
    engagement_status = fields.Nested(EngagementStatusSchema)
    surveys = fields.List(fields.Nested(EngagementSurveySchema))
    submission_status = fields.Method('get_submission_status')
    submissions_meta_data = fields.Method('get_submissions_meta_data')
    status_block = fields.List(fields.Nested(EngagementStatusBlockSchema))
    tenant_id = fields.Str(data_key='tenant_id')
    is_internal = fields.Bool(data_key='is_internal')
    consent_message = fields.Str(data_key='consent_message')

    def get_submissions_meta_data(self, obj):
        """Get the meta data of the submissions made in the survey."""
        if not obj or len(obj.surveys) == 0:
            return {
                'total': 0,
                'pending': 0,
                'approved': 0,
                'rejected': 0,
                'needs_further_review': 0
            }
        submissions = obj.surveys[0].submissions
        return {
            'total': len(submissions),
            'pending': count_comments_by_status(submissions, CommentStatus.Pending.value),
            'approved': count_comments_by_status(submissions, CommentStatus.Approved.value),
            'rejected': count_comments_by_status(submissions, CommentStatus.Rejected.value),
            'needs_further_review': count_comments_by_status(
                submissions,
                CommentStatus.Needs_further_review.value)
        }

    def get_submission_status(self, obj):
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

    @validates_schema
    def validate_dates(self, data, **kwargs):
        """Validate that start date is before end date."""
        if kwargs.get('partial', False):
            return

        if data.get('start_date') > data.get('end_date'):
            raise ValidationError('From date must be before to date')
