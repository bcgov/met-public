"""Language-Tenant Mapping schema."""

from marshmallow import EXCLUDE, Schema, fields


class LanguageTenantMappingSchema(Schema):
    """Language-Tenant Mapping schema."""

    class Meta:
        """Exclude unknown fields in the deserialized output."""

        unknown = EXCLUDE

    id = fields.Int(data_key='id')
    language_id = fields.Int(data_key='language_id')
    tenant_id = fields.Int(data_key='tenant_id')
