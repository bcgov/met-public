"""Widget schema class."""

from marshmallow import Schema

from met_api.models.engagement_settings import EngagementSettingsModel


class EngagementSettingsSchema(Schema):
    """Engagement settings schema."""

    class Meta:  # pylint: disable=too-few-public-methods
        """Exclude unknown fields in the deserialized output."""

        model = EngagementSettingsModel
        fields = ('engagement_id', 'send_report')
