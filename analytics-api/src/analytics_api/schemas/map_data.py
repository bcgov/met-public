"""Map schema class."""
from marshmallow import EXCLUDE, Schema, fields


class MapDataSchema(Schema):
    """Schema for map data."""

    class Meta:  # pylint: disable=too-few-public-methods
        """Exclude unknown fields in the deserialized output."""

        unknown = EXCLUDE

    latitude = fields.Float(data_key='latitude')
    longitude = fields.Float(data_key='longitude')
    geojson = fields.Str(data_key='geojson')
    marker_label = fields.Str(data_key='marker_label')