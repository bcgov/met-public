"""Submission schema class.

Manages the submission
"""

from marshmallow import EXCLUDE, Schema, fields
from met_api.schemas.comment import CommentSchema

from .survey import SurveySchema


class SubmissionSchema(Schema):
    """Schema for submission."""

    class Meta:  # pylint: disable=too-few-public-methods
        """Exclude unknown fields in the deserialized output."""

        unknown = EXCLUDE

    id = fields.Str(data_key='id')
    submission_json = fields.Dict(data_key='submission_json')
    created_by = fields.Str(data_key='created_by')
    created_date = fields.Str(data_key='created_date')
    updated_by = fields.Str(data_key='updated_by')
    updated_date = fields.Str(data_key='updated_date')
    survey_id = fields.Int(data_key='survey_id')
    user_id = fields.Int(data_key='user_id')
    verification_token = fields.Str(data_key='verification_token')
    reviewed_by = fields.Str(data_key='reviewed_by')
    review_date = fields.Str(data_key='review_date')
    comment_status_id = fields.Int(data_key='comment_status_id')
    survey_name = fields.Pluck(SurveySchema, 'name')
    comments = fields.List(fields.Nested(CommentSchema))
