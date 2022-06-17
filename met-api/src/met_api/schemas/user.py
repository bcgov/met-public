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
    status_name = fields.Str(data_key="status_name")
    last_name = fields.Str(data_key='last_name')
    email_id = fields.Int(data_key='email_id')
    contact_number = fields.Str(data_key='contact_number')
    created_date = fields.Str(data_key='created_date')
    updated_date = fields.Str(data_key='updated_date')
