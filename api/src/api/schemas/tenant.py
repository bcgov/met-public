"""Tenant schema class."""

from marshmallow import EXCLUDE, Schema, fields


class TenantSchema(Schema):
    """Schema for tenant."""

    class Meta:  # pylint: disable=too-few-public-methods
        """Exclude unknown fields in the deserialized output."""

        unknown = EXCLUDE

    name = fields.Str(data_key='name')
    short_name = fields.Str(data_key='short_name')
    description = fields.Str(data_key='description')
    title = fields.Str(data_key='title')
    hero_image_url = fields.Str(data_key='hero_image_url')
    contact_name = fields.Str(data_key='contact_name')
    contact_email = fields.Str(data_key='contact_email')
    hero_image_credit = fields.Str(data_key='hero_image_credit')
    hero_image_description = fields.Str(data_key='hero_image_description')
