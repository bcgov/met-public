"""Engagement model class.

Manages the engagement
"""

from marshmallow import EXCLUDE, Schema, fields


class UserSchema(Schema):
    """User schema."""

    class Meta:  # pylint: disable=too-few-public-methods
        """Exclude unknown fields in the deserialized output."""

        unknown = EXCLUDE

    id = fields.Int(data_key='id')
    first_name = fields.Str(data_key='first_name')
    middle_name = fields.Str(data_key='description')
    last_name = fields.Str(data_key='last_name')
    email_id = fields.Str(data_key='email_id')
    contact_number = fields.Str(data_key='contact_number')
    username = fields.Str(data_key='username')
    external_id = fields.Str(data_key='external_id')
    created_date = fields.Str(data_key='created_date')
    updated_date = fields.Str(data_key='updated_date')
    access_type = fields.Str(data_key='access_type')
    roles = fields.List(fields.Str(data_key='roles'))
