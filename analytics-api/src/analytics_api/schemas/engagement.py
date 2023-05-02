"""Engagement status schema class."""
from marshmallow import EXCLUDE, Schema, fields


class EngagementSchema(Schema):
    """Schema for engagement."""

    class Meta:  # pylint: disable=too-few-public-methods
        """Exclude unknown fields in the deserialized output."""

        unknown = EXCLUDE

    id = fields.Int(data_key='id')
    source_engagement_id = fields.Int(data_key='source_engagement_id')
    name = fields.Str(data_key='name')
    start_date = fields.Str(data_key='start_date')
    end_date = fields.Str(data_key='end_date')
    published_date = fields.Str(data_key='published_date')
    runcycle_id = fields.Int(data_key='runcycle_id')
    created_date = fields.Str(data_key='created_date')
    updated_date = fields.Str(data_key='updated_date')
    is_active = fields.Bool(data_key='is_active')
    latitude = fields.Float(data_key='latitude')
    longitude = fields.Float(data_key='longitude')
    geojson = fields.Str(data_key='geojson')
    marker_label = fields.Str(data_key='marker_label')