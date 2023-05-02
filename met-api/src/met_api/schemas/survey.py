"""Survey schema class.

Manages the survey
"""

from marshmallow import EXCLUDE, Schema, fields
from .engagement import EngagementSchema
from met_api.constants.comment_status import Status


class SurveySchema(Schema):
    """Schema for survey."""

    class Meta:  # pylint: disable=too-few-public-methods
        """Exclude unknown fields in the deserialized output."""

        unknown = EXCLUDE

    id = fields.Int(data_key='id')
    name = fields.Str(data_key='name')
    form_json = fields.Dict(data_key='form_json')
    created_by = fields.Str(data_key='created_by')
    created_date = fields.Str(data_key='created_date')
    updated_by = fields.Str(data_key='updated_by')
    updated_date = fields.Str(data_key='updated_date')
    engagement_id = fields.Str(data_key='engagement_id')
    is_hidden = fields.Bool(data_key='is_hidden')
    is_template = fields.Bool(data_key='is_template')
    engagement = fields.Nested(EngagementSchema)
    comments_meta_data = fields.Method('get_comments_meta_data')
    tenant_id = fields.Str(data_key='tenant_id')

    def get_comments_meta_data(self, obj):
        """Get the meta data of the comments made in the survey."""
        return {
            'total': len(obj.submissions),
            'pending': self._count_comments_by_status(obj.submissions, Status.Pending.value),
            'approved': self._count_comments_by_status(obj.submissions, Status.Approved.value),
            'rejected': self._count_comments_by_status(obj.submissions, Status.Rejected.value),
            'needs_further_review': self._count_comments_by_status(
                obj.submissions,
                Status.Needs_further_review.value)
        }

    def _count_comments_by_status(self, submissios, status):
        return len([submission for submission in submissios
                    if submission.comment_status_id == status])
