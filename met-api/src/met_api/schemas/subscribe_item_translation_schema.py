"""Schema for SubscribeItemTranslation serialization and deserialization."""

from marshmallow import fields
from marshmallow_sqlalchemy import SQLAlchemyAutoSchema

from met_api.models.subscribe_item_translation import SubscribeItemTranslation


class SubscribeItemTranslationSchema(SQLAlchemyAutoSchema):
    """Schema for SubscribeItemTranslation."""

    class Meta:
        """SubscribeItemTranslationSchema metadata."""

        model = SubscribeItemTranslation
        load_instance = True  # Optional: deserialize to model instances

    id = fields.Int(dump_only=True)
    language_id = fields.Int(required=True)
    subscribe_item_id = fields.Int(required=True)
    description = fields.Str(allow_none=True)
    rich_description = fields.Str(allow_none=True)
    call_to_action_text = fields.Str(allow_none=True, validate=lambda s: len(s) <= 25)
