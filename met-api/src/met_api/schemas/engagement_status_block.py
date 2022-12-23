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
