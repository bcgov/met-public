"""Engagement summary model class.

Manages the engagement summary
"""
from marshmallow import EXCLUDE, Schema, fields


class EngagementSummarySchema(Schema):
    """Schema for engagement summary."""

    class Meta:  # pylint: disable=too-few-public-methods
        """Exclude unknown fields in the deserialized output."""

        unknown = EXCLUDE

    id = fields.Int(data_key='id')
    content = fields.Str(data_key='content')
    rich_content = fields.Str(data_key='rich_content')
    engagement_content_id = fields.Int(data_key='engagement_content_id')
    engagement_id = fields.Int(data_key='engagement_id')
