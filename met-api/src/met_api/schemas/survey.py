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
    engagement = fields.Nested(EngagementSchema)
    comments_meta_data = fields.Method('get_comments_meta_data')

    def get_comments_meta_data(self, obj):
        """Get the meta data of the comments made in the survey."""
        return {
            'total': len(obj.submissions),
            'pending': len([submission for submission in obj.submissions
                            if submission.comment_status_id == Status.Pending.value])
        }
