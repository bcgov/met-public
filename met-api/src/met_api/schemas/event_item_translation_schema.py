"""Schema for EventItemTranslation serialization and deserialization."""

from marshmallow import EXCLUDE, fields
from marshmallow_sqlalchemy import SQLAlchemyAutoSchema

from met_api.models.event_item_translation import EventItemTranslation


class EventItemTranslationSchema(SQLAlchemyAutoSchema):
    """Schema for EventItemTranslation."""

    class Meta:
        """EventItemTranslationSchema metadata."""

        model = EventItemTranslation
        unknown = EXCLUDE

    id = fields.Int(dump_only=True)
    language_id = fields.Int(required=True)
    event_item_id = fields.Int(required=True)
    description = fields.Str(allow_none=True)
    location_name = fields.Str(allow_none=True)
    location_address = fields.Str(allow_none=True)
    url = fields.Str(allow_none=True)
    url_label = fields.Str(allow_none=True)
