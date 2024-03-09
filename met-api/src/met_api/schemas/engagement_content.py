"""Engagement content model class.

Manages the engagement content.
"""
from marshmallow import EXCLUDE, Schema, fields
from marshmallow_enum import EnumField
from met_api.constants.engagement_content_type import EngagementContentType


class EngagementContentSchema(Schema):
    """Schema for engagement content."""

    class Meta:  # pylint: disable=too-few-public-methods
        """Exclude unknown fields in the deserialized output."""

        unknown = EXCLUDE

    id = fields.Int(data_key='id')
    title = fields.Str(data_key='title')
    icon_name = fields.Str(data_key='icon_name')
    content_type = EnumField(EngagementContentType)
    engagement_id = fields.Int(data_key='engagement_id')
    sort_index = fields.Int(data_key='sort_index')
    is_internal = fields.Bool(data_key='is_internal')
