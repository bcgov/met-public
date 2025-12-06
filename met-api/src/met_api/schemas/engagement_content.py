"""Engagement content model class.

Manages the engagement content.
"""
from marshmallow import EXCLUDE, Schema, fields


class EngagementContentSchema(Schema):
    """Schema for engagement content."""

    class Meta:  # pylint: disable=too-few-public-methods
        """Exclude unknown fields in the deserialized output."""

        unknown = EXCLUDE

    id = fields.Int(data_key='id')
    title = fields.Str(data_key='title')
    heading = fields.Str(data_key='heading')
    text_content = fields.Str(data_key='text_content')
    json_content = fields.Str(data_key='json_content')
    engagement_id = fields.Int(data_key='engagement_id')
    widget_id = fields.Int(data_key="widget_id")
    sort_index = fields.Int(data_key='sort_index')
    is_internal = fields.Bool(data_key='is_internal')
