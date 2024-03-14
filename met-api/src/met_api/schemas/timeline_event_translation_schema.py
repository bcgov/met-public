"""Schema for TimelineEventTranslation serialization and deserialization."""

from marshmallow import EXCLUDE, fields
from marshmallow_sqlalchemy import SQLAlchemyAutoSchema

from met_api.models.timeline_event_translation import TimelineEventTranslation


class TimelineEventTranslationSchema(SQLAlchemyAutoSchema):
    """Schema for TimelineEventTranslation."""

    class Meta:
        """TimelineEventTranslationSchema metadata."""

        model = TimelineEventTranslation
        unknown = EXCLUDE

    id = fields.Int(dump_only=True)
    language_id = fields.Int(required=True)
    timeline_event_id = fields.Int(required=True)
    description = fields.Str(allow_none=True)
    time = fields.Str(allow_none=True)
