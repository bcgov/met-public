"""Suggested engagement schema class.

Represents an individual suggested engagement.
"""
from marshmallow import EXCLUDE, Schema, fields, validate


class SuggestedEngagementAttachment(Schema):
    """Schema for attached engagement data."""

    id = fields.Int(data_key='id')
    name = fields.Str(data_key='name', required=True, validate=validate.Length(min=1, error='Name cannot be blank'))
    description = fields.Str(data_key='description')
    rich_description = fields.Str(data_key='rich_description')
    description_title = fields.Str(data_key='description_title')
    start_date = fields.Date(data_key='start_date', required=True)
    end_date = fields.Date(data_key='end_date', required=True)
    status_id = fields.Int(data_key='status_id')
    banner_filename = fields.Str(data_key='banner_filename')
    tenant_id = fields.Int(data_key='tenant_id')
    is_internal = fields.Bool(data_key='is_internal')
    consent_message = fields.Str(data_key='consent_message')
    sponsor_name = fields.Str(data_key='sponsor_name')


class SuggestedEngagementWithAttachment(Schema):
    """Schema for a suggested engagement with the engagement data attached."""

    class Meta:
        """Exclude unknown fields."""

        unknown = EXCLUDE

    id = fields.Int(data_key='id')
    engagement_id = fields.Int(data_key='engagement_id')
    suggested_engagement_id = fields.Int(data_key='suggested_engagement_id')
    sort_index = fields.Int(data_key='sort_index')
    engagement = fields.Nested(SuggestedEngagementAttachment)


class SuggestedEngagementSchema(Schema):
    """Schema for suggested engagement."""

    class Meta:  # pylint: disable=too-few-public-methods
        """Exclude unknown fields."""

        unknown = EXCLUDE

    id = fields.Int(data_key='id')
    engagement_id = fields.Int(data_key='engagement_id')
    suggested_engagement_id = fields.Int(data_key='suggested_engagement_id')
    sort_index = fields.Int(data_key='sort_index')
