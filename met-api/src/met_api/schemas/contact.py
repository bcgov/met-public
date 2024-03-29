"""Widget schema class."""

from marshmallow import EXCLUDE, Schema, fields


class ContactSchema(Schema):
    """User schema."""

    class Meta:  # pylint: disable=too-few-public-methods
        """Exclude unknown fields in the deserialized output."""

        unknown = EXCLUDE

    id = fields.Int(data_key='id')
    name = fields.Str(data_key='name', required=True)
    title = fields.Str(data_key='title')
    phone_number = fields.Str(data_key='phone_number')
    email = fields.Str(data_key='email', required=True)
    address = fields.Str(data_key='address')
    bio = fields.Str(data_key='bio')
    avatar_filename = fields.Str(data_key='avatar_filename')
    created_by = fields.Str(data_key='created_by')
    created_date = fields.Str(data_key='created_date')
    updated_by = fields.Str(data_key='updated_by')
    updated_date = fields.Str(data_key='updated_date')
    tenant_id = fields.Str(data_key='tenant_id')
