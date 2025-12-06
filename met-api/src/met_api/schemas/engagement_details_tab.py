"""Engagement details tab model class.

Represents an individual engagement tab.
"""
from marshmallow import EXCLUDE, Schema, fields


class EngagementDetailsTabSchema(Schema):
    """Schema for engagement details tab."""

    class Meta:  # pylint: disable=too-few-public-methods
        """Exclude unknown fields in the deserialized output."""

        unknown = EXCLUDE

    id = fields.Int(data_key='id')
    engagement_id = fields.Int(data_key='engagement_id')
    label = fields.Str(data_key='label')
    slug = fields.Str(data_key='slug')
    heading = fields.Str(data_key='heading')
    body = fields.Dict(data_key='body')
    sort_index = fields.Int(data_key='sort_index')
