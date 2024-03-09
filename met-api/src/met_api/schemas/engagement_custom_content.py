"""Engagement custom model class.

Manages the engagement custom
"""
from marshmallow import EXCLUDE, Schema, fields


class EngagementCustomSchema(Schema):
    """Schema for engagement custom."""

    class Meta:  # pylint: disable=too-few-public-methods
        """Exclude unknown fields in the deserialized output."""

        unknown = EXCLUDE

    id = fields.Int(data_key='id')
    custom_text_content = fields.Str(data_key='custom_text_content')
    custom_json_content = fields.Str(data_key='custom_json_content')
    engagement_content_id = fields.Int(data_key='engagement_content_id')
    engagement_id = fields.Int(data_key='engagement_id')
