"""Schema for PollAnswerTranslation serialization and deserialization."""

from marshmallow import fields
from marshmallow_sqlalchemy import SQLAlchemyAutoSchema
from met_api.models.poll_answer_translation import PollAnswerTranslation

class PollAnswerTranslationSchema(SQLAlchemyAutoSchema):
    """Schema for PollAnswerTranslation."""

    class Meta:
        """PollAnswerTranslationSchema metadata."""

        model = PollAnswerTranslation
        load_instance = True  # Optional: deserialize to model instances

    id = fields.Int(dump_only=True)
    poll_answer_id = fields.Int(required=True)
    language_id = fields.Int(required=True)
    answer_text = fields.Str(required=True)
