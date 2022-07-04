"""Survey schema class.

Manages the survey
"""

from marshmallow import EXCLUDE, Schema, fields
from .Engagement import EngagementSchema


class SurveySchema(Schema):
    """Schema for survey."""

    class Meta:  # pylint: disable=too-few-public-methods
        """Exclude unknown fields in the deserialized output."""

        unknown = EXCLUDE

    id = fields.Str(data_key='id')
    name = fields.Str(data_key='name')
    formJSON = fields.Dict(data_key='formJSON')
    created_by = fields.Str(data_key='created_by')
    created_date = fields.Str(data_key='created_date')
    updated_by = fields.Str(data_key='updated_by')
    updated_date = fields.Str(data_key='updated_date')
    engagement = fields.Nested(EngagementSchema)
