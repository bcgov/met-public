"""Widget schema class."""

from marshmallow import EXCLUDE, Schema, fields

from met_api.schemas.widget_item import WidgetItemSchema


class WidgetSchema(Schema):
    """Widget schema."""

    class Meta:  # pylint: disable=too-few-public-methods
        """Exclude unknown fields in the deserialized output."""

        unknown = EXCLUDE

    id = fields.Int(data_key='id')
    widget_type_id = fields.Int(data_key='widget_type_id', required=True)
    engagement_id = fields.Int(data_key='engagement_id', required=True)
    created_by = fields.Str(data_key='created_by')
    created_date = fields.Str(data_key='created_date')
    updated_by = fields.Str(data_key='updated_by')
    updated_date = fields.Str(data_key='updated_date')
    sort_index = fields.Int(data_key='sort_index')
    items = fields.List(fields.Nested(WidgetItemSchema))
