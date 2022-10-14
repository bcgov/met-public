"""Widget schema class."""

from marshmallow import EXCLUDE, Schema, fields


class WidgetSchema(Schema):
    """User schema."""

    class Meta:  # pylint: disable=too-few-public-methods
        """Exclude unknown fields in the deserialized output."""

        unknown = EXCLUDE

    id = fields.Int(data_key='id')
    widget_type_id = fields.Int(data_key='widget_type_id', required=True)
    engagement_id = fields.Int(data_key='engagement_id', required=True)
    widget_data_id = fields.Int(data_key='widget_data_id', required=True)
    created_by = fields.Str(data_key='created_by')
    created_date = fields.Str(data_key='created_date')
    updated_by = fields.Str(data_key='updated_by')
    updated_date = fields.Str(data_key='updated_date')
