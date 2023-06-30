"""Report setting schema class.

Manages the report setting
"""

from marshmallow import EXCLUDE, Schema, fields


class ReportSettingSchema(Schema):
    """Schema for report setting."""

    class Meta:  # pylint: disable=too-few-public-methods
        """Exclude unknown fields in the deserialized output."""

        unknown = EXCLUDE

    id = fields.Int(data_key='id')
    survey_id = fields.Int(data_key='survey_id')
    question_id = fields.Str(data_key='question_id')
    question_key = fields.Str(data_key='question_key')
    question_type = fields.Str(data_key='question_type')
    question = fields.Str(data_key='question')
    display = fields.Bool(data_key='display')
    created_by = fields.Str(data_key='created_by')
    created_date = fields.Str(data_key='created_date')
    updated_by = fields.Str(data_key='updated_by')
    updated_date = fields.Str(data_key='updated_date')
