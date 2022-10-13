"""Widget schema class."""

from marshmallow import EXCLUDE, Schema, fields


class WidgetSchema(Schema):
    """User schema."""

    class Meta:  # pylint: disable=too-few-public-methods
        """Exclude unknown fields in the deserialized output."""

        unknown = EXCLUDE

    id = fields.Int(data_key='id')
    name = fields.Str(data_key='name')
    widget_type_id = fields.Int(data_key='widget_type_id')
    engagement_id = fields.Int(data_key='engagement_id')
    widget_data_id = fields.Int(data_key='widget_data_id')
