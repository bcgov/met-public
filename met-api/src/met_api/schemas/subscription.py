"""Subscription schema class.

Manages the subscription
"""

from marshmallow import EXCLUDE, Schema, fields


class SubscriptionSchema(Schema):
    """Schema for Subscription."""

    class Meta:  # pylint: disable=too-few-public-methods
        """Exclude unknown fields in the deserialized output."""

        unknown = EXCLUDE

    id = fields.Int(data_key='id')
    email_verification_id = fields.Int(data_key='email_verification_id')
    user_id = fields.Int(data_key='user_id')
    is_subscribed = fields.Bool(data_key='is_subscribed')
    created_by = fields.Str(data_key='created_by')
    created_date = fields.Str(data_key='created_date')
    updated_by = fields.Str(data_key='updated_by')
    updated_date = fields.Str(data_key='updated_date')
