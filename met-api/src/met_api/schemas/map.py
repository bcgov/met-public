"""Widget Map schema class."""

from marshmallow import EXCLUDE, Schema, fields


class WidgetMapSchema(Schema):
    """Widget Map schema."""

    class Meta:  # pylint: disable=too-few-public-methods
        """Exclude unknown fields in the deserialized output."""

        unknown = EXCLUDE

    id = fields.Int(data_key='id')
    widget_id = fields.Int(data_key='widget_id', required=True)
    sort_index = fields.Int(data_key='sort_index')
    title = fields.Int(data_key='title')
    latitude = fields.Float(data_key="latitude")
    longitude = fields.Float(data_key="longitude")
    shapefile = fields.Dict(data_key="shapefile")
    created_by = fields.Str(data_key='created_by')
    created_date = fields.Str(data_key='created_date')
    updated_by = fields.Str(data_key='updated_by')
    updated_date = fields.Str(data_key='updated_date')