"""Submission schema class.

Manages the submission
"""

from marshmallow import EXCLUDE, Schema, fields
from met_api.schemas.comment import CommentSchema, PublicCommentSchema
from met_api.schemas.staff_note import StaffNoteSchema

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
    engagement_id = fields.Int(data_key='engagement_id')
    participant_id = fields.Int(data_key='participant_id')
    verification_token = fields.Str(data_key='verification_token')
    reviewed_by = fields.Str(data_key='reviewed_by')
    review_date = fields.Str(data_key='review_date')
    comment_status_id = fields.Int(data_key='comment_status_id')
    has_personal_info = fields.Bool(data_key='has_personal_info')
    has_profanity = fields.Bool(data_key='has_profanity')
    has_threat = fields.Bool(data_key='has_threat')
    rejected_reason_other = fields.Str(data_key='rejected_reason_other')
    survey_name = fields.Pluck(SurveySchema, 'name')
    notify_email = fields.Bool(data_key='notify_email')
    comments = fields.List(fields.Nested(CommentSchema))
    staff_note = fields.List(fields.Nested(StaffNoteSchema))


class PublicSubmissionSchema(Schema):
    """Schema for a public submission."""

    class Meta:  # pylint: disable=too-few-public-methods
        """Exclude unknown fields in the deserialized output."""

        unknown = EXCLUDE

    id = fields.Int(data_key='id')
    engagement_id = fields.Int(data_key='engagement_id')
    comments = fields.List(fields.Nested(PublicCommentSchema))
