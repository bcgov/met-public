"""Email verification schema class.

Manages the Email verification
"""

from marshmallow import EXCLUDE, Schema, fields


class EmailVerificationSchema(Schema):
    """Schema for Email verification."""

    class Meta:  # pylint: disable=too-few-public-methods
        """Exclude unknown fields in the deserialized output."""

        unknown = EXCLUDE

    id = fields.Str(data_key='id')
    verification_token = fields.Str(data_key='verification_token')
    email_address = fields.Str(data_key='email_address')
    user_id = fields.Int(data_key='user_id')
    is_active = fields.Bool(data_key='is_active')
    survey_id = fields.Int(data_key='survey_id')
    created_by = fields.Str(data_key='created_by')
    created_date = fields.Str(data_key='created_date')
    updated_by = fields.Str(data_key='updated_by')
    updated_date = fields.Str(data_key='updated_date')
