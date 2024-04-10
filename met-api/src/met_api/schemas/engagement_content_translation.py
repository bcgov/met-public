"""Schema for engagement content translation."""

from marshmallow import EXCLUDE, Schema, fields


class EngagementContentTranslationSchema(Schema):
    """Engagement content translation schema."""

    class Meta:  # pylint: disable=too-few-public-methods
        """Meta class to exclude unknown fields."""

        unknown = EXCLUDE

    id = fields.Int(data_key='id')
    language_id = fields.Int(data_key='language_id', required=True)
    engagement_content_id = fields.Int(data_key='engagement_content_id', required=True)
    content_title = fields.Str(data_key='content_title', required=True)
    custom_text_content = fields.Str(data_key='custom_text_content')
    custom_json_content = fields.Str(data_key='custom_json_content')
