"""Survey schema class.

Manages the survey
"""

from marshmallow import EXCLUDE, Schema, fields
from .engagement import EngagementSchema


class SurveySchema(Schema):
    """Schema for survey."""

    class Meta:  # pylint: disable=too-few-public-methods
        """Exclude unknown fields in the deserialized output."""

        unknown = EXCLUDE

    id = fields.Str(data_key='id')
    name = fields.Str(data_key='name')
    form_json = fields.Dict(data_key='form_json')
    created_by = fields.Str(data_key='created_by')
    created_date = fields.Str(data_key='created_date')
    updated_by = fields.Str(data_key='updated_by')
    updated_date = fields.Str(data_key='updated_date')
    engagement_id = fields.Str(data_key='engagement_id')
    engagement = fields.Nested(EngagementSchema)
    comments_count = fields.Method('get_comments_count')

    def get_comments_count(self, obj):
        """Get the number of comments made in the survey."""
        if not obj.comments:
            return 0
        return len(obj.comments)
