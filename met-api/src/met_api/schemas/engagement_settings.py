"""Engagement settings schema class."""

from marshmallow import EXCLUDE, Schema, fields

class EngagementSettingsSchema(Schema):
    """Engagement settings schema."""

    class Meta:  # pylint: disable=too-few-public-methods
        """Exclude unknown fields in the deserialized output."""

        unknown = EXCLUDE

    engagement_id = fields.Int(data_key='engagement_id')
    send_report = fields.Bool(data_key='send_report')
