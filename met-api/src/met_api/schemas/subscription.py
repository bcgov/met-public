"""Subscription schema class.

Manages the subscription
"""

from marshmallow import EXCLUDE, Schema, fields
from marshmallow_enum import EnumField

from met_api.constants.subscription_type import SubscriptionTypes


class SubscriptionSchema(Schema):
    """Schema for Subscription."""

    class Meta:  # pylint: disable=too-few-public-methods
        """Exclude unknown fields in the deserialized output."""

        unknown = EXCLUDE

    id = fields.Int(data_key='id')
    engagement_id = fields.Int(data_key='engagement_id')
    participant_id = fields.Int(data_key='participant_id')
    is_subscribed = fields.Bool(data_key='is_subscribed')
    project_id = fields.Str(data_key='project_id')
    type = EnumField(SubscriptionTypes, by_value=True)
    created_by = fields.Str(data_key='created_by')
    created_date = fields.Str(data_key='created_date')
    updated_by = fields.Str(data_key='updated_by')
    updated_date = fields.Str(data_key='updated_date')
