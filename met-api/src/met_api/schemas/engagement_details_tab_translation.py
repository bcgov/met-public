"""Schema for engagement details tab translation."""

from marshmallow import EXCLUDE, Schema, fields


class EngagementDetailsTabTranslationSchema(Schema):
    """Engagement details tab translation schema."""

    class Meta:  # pylint: disable=too-few-public-methods
        """Meta class to exclude unknown fields."""

        unknown = EXCLUDE

    id = fields.Int(data_key='id')
    language_id = fields.Int(data_key='language_id', required=True)
    engagement_details_tab_id = fields.Int(data_key='engagement_details_tab_id', required=True)
    label = fields.Str(data_key='label', required=True)
    slug = fields.Str(data_key='slug', required=True)
    heading = fields.Str(data_key='heading', required=True)
    body = fields.Str(data_key='body', required=True)
