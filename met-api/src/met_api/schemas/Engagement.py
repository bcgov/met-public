"""Engagement model class.

Manages the engagement
"""

from marshmallow import EXCLUDE, Schema, fields
from .engagement_status import EngagementStatusSchema


class EngagementSchema(Schema):
    """Schema for engagement."""

    class Meta:  # pylint: disable=too-few-public-methods
        """Exclude unknown fields in the deserialized output."""

        unknown = EXCLUDE

    id = fields.Int(data_key='id')
    name = fields.Str(data_key='name')
    description = fields.Str(data_key='description')
    rich_description = fields.Str(data_key='rich_description')
    start_date = fields.Str(data_key='start_date')
    end_date = fields.Str(data_key='end_date')
    status_id = fields.Int(data_key='status_id')
    created_by = fields.Str(data_key='created_by')
    created_date = fields.Str(data_key='created_date')
    updated_by = fields.Str(data_key='updated_by')
    updated_date = fields.Str(data_key='updated_date')
    published_date = fields.Str(data_key='published_date')
    content = fields.Str(data_key='content')
    rich_content = fields.Str(data_key='rich_content')
    banner_url = fields.Str(data_key='banner_url')
    engagement_status = fields.Nested(EngagementStatusSchema)
