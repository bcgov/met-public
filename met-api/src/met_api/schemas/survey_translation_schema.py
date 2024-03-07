"""SurveyTranslation schema."""

from marshmallow import fields
from marshmallow_sqlalchemy import SQLAlchemyAutoSchema

from met_api.models.survey_translation import SurveyTranslation


class SurveyTranslationSchema(SQLAlchemyAutoSchema):
    """Schema for SurveyTranslation serialization and deserialization."""

    class Meta:
        """SurveyTranslationSchema metadata."""

        model = SurveyTranslation
        load_instance = True  # Optional: deserialize to model instances

    id = fields.Int(dump_only=True)
    survey_id = fields.Int(required=True)
    language_id = fields.Int(required=True)
    name = fields.Str(required=False, allow_none=True)
    form_json = fields.Raw(required=False, allow_none=True)
