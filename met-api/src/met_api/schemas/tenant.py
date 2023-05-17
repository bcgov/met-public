"""Feedback schema class."""

from marshmallow import EXCLUDE, Schema, fields


class TenantSchema(Schema):
    """Schema for tenant."""

    class Meta:  # pylint: disable=too-few-public-methods
        """Exclude unknown fields in the deserialized output."""

        unknown = EXCLUDE

    name = fields.Str(data_key='name')
    description = fields.Str(data_key='description')
    title = fields.Str(data_key='title')
    logo_url = fields.Str(data_key='logo_url')
