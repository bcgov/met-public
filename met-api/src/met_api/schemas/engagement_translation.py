"""Engagement translation schema class."""

from marshmallow import EXCLUDE, Schema, fields


class EngagementTranslationSchema(Schema):
    """Engagement translation schema."""

    class Meta:  # pylint: disable=too-few-public-methods
        """Exclude unknown fields in the deserialized output."""

        unknown = EXCLUDE

    id = fields.Int(data_key='id')
    engagement_id = fields.Int(data_key='engagement_id', required=True)
    language_id = fields.Int(data_key='language_id', required=True)
    name = fields.Str(data_key='name')
    description = fields.Str(data_key='description')
    rich_description = fields.Str(data_key='rich_description')
    content = fields.Str(data_key='content')
    rich_content = fields.Str(data_key='rich_content')
    consent_message = fields.Str(data_key='consent_message')
    slug = fields.Str(data_key='slug')
    upcoming_status_block_text = fields.Str(data_key='upcoming_status_block_text')
    open_status_block_text = fields.Str(data_key='open_status_block_text')
    closed_status_block_text = fields.Str(data_key='closed_status_block_text')
