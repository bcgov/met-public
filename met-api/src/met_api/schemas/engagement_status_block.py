"""Engagement status schema class."""

from marshmallow import EXCLUDE, Schema, fields
from marshmallow_enum import EnumField

from met_api.constants.engagement_status import SubmissionStatus


class EngagementStatusBlockSchema(Schema):
    """Schema for engagement Status Block."""

    class Meta:  # pylint: disable=too-few-public-methods
        """Exclude unknown fields in the deserialized output."""

        unknown = EXCLUDE

    survey_status = EnumField(SubmissionStatus, by_value=False)
    block_text = fields.Str(data_key='block_text')
    button_text = fields.Str(data_key='button_text')
    link_type = fields.Str(data_key='link_type')
    internal_link = fields.Str(data_key='internal_link', allow_none=True)
    external_link = fields.Str(data_key='external_link', allow_none=True)
