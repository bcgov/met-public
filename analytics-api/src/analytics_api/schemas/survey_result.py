"""Survey result schema class."""
from marshmallow import EXCLUDE, Schema, fields


class SurveyResultSchema(Schema):
    """Schema for survey result."""

    class Meta:  # pylint: disable=too-few-public-methods
        """Exclude unknown fields in the deserialized output."""

        unknown = EXCLUDE

    position = fields.Int(data_key='position')
    question = fields.Str(data_key='label')
    result = fields.List(fields.Dict(data_key='response'))
