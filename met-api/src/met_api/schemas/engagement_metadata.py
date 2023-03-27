"""Engagement model class.

Manages the engagement
"""

from marshmallow import EXCLUDE, Schema, fields


class EngagementMetadataSchema(Schema):
    """Schema for engagement metadata."""

    class Meta:  # pylint: disable=too-few-public-methods
        """Exclude unknown fields in the deserialized output."""

        unknown = EXCLUDE

    engagement_id = fields.Int(data_key='engagement_id')
    project_id = fields.Str(data_key='project_id')
    project_metadata = fields.Dict(data_key='project_metadata')
