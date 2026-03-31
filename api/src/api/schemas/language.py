"""Language schema."""

from marshmallow import EXCLUDE, Schema, fields


class LanguageSchema(Schema):
    """Language schema."""

    class Meta:
        """Exclude unknown fields in the deserialized output."""

        unknown = EXCLUDE

    id = fields.Int(data_key='id')
    name = fields.Str(data_key='name', required=True)
    code = fields.Str(data_key='code', required=True)
    right_to_left = fields.Bool(data_key='right_to_left')
