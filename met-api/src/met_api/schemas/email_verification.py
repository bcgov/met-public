"""Email verification schema class.

Manages the Email verification
"""

from marshmallow import EXCLUDE, Schema, fields
from marshmallow_enum import EnumField
from met_api.constants.email_verification import EmailVerificationType


class EmailVerificationSchema(Schema):
    """Schema for Email verification."""

    class Meta:  # pylint: disable=too-few-public-methods
        """Exclude unknown fields in the deserialized output."""

        unknown = EXCLUDE

    id = fields.Int(data_key='id')
    verification_token = fields.Str(data_key='verification_token')
    email_address = fields.Str(data_key='email_address')
    participant_id = fields.Int(data_key='participant_id')
    is_active = fields.Bool(data_key='is_active')
    survey_id = fields.Int(data_key='survey_id')
    type = EnumField(EmailVerificationType, by_value=True)
    submission_id = fields.Int(data_key='submission_id')
    created_by = fields.Str(data_key='created_by')
    created_date = fields.Str(data_key='created_date')
    updated_by = fields.Str(data_key='updated_by')
    updated_date = fields.Str(data_key='updated_date')
