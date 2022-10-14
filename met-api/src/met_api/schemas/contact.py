"""Widget schema class."""

from marshmallow import EXCLUDE, Schema, fields, validate


class ContactSchema(Schema):
    """User schema."""

    class Meta:  # pylint: disable=too-few-public-methods
        """Exclude unknown fields in the deserialized output."""

        unknown = EXCLUDE

    id = fields.Int(data_key='id')
    name = fields.Str(data_key='name', required=True)
    role = fields.Str(data_key='role', required=True)
    phone_number = fields.Str(data_key='phone_number', required=True)
    email = fields.Str(data_key='email', required=True)
    address = fields.Str(data_key='address', required=True)
    bio = fields.Str(
        data_key='bio',
        required=True,
        validate=validate.Length(
            min=20,
            error='Bio must be atleast 20 characters'))
    created_by = fields.Str(data_key='created_by')
    created_date = fields.Str(data_key='created_date')
    updated_by = fields.Str(data_key='updated_by')
    updated_date = fields.Str(data_key='updated_date')
