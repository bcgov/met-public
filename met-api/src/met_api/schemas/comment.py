"""Comment model class.

Manages the comment
"""

from marshmallow import EXCLUDE, Schema, fields

from met_api.schemas.survey import SurveySchema
from .comment_status import CommentStatusSchema


class CommentSchema(Schema):
    """Schema for comment."""

    class Meta:  # pylint: disable=too-few-public-methods
        """Exclude unknown fields in the deserialized output."""

        unknown = EXCLUDE

    id = fields.Int(data_key='id')
    text = fields.Str(data_key='text')
    submission_date = fields.Date(data_key='submission_date')
    reviewed_by = fields.Str(data_key='reviewed_by')
    review_date = fields.Str(data_key='review_date')
    status_id = fields.Int(data_key='status_id')
    survey_id = fields.Int(data_key='survey_id')
    comment_status = fields.Nested(CommentStatusSchema)
    survey = fields.Pluck(SurveySchema, 'name')
