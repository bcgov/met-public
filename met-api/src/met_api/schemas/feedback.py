"""Feedback schema class."""

from marshmallow import EXCLUDE, Schema, fields
from marshmallow_enum import EnumField
from met_api.models.feedback import CommentType, RatingType


class FeedbackSchema(Schema):
    """Schema for feedback."""

    class Meta:  # pylint: disable=too-few-public-methods
        """Exclude unknown fields in the deserialized output."""

        unknown = EXCLUDE

    id = fields.Int(data_key='id')
    comment = fields.Str(data_key='comment')
    created_date = fields.Date(data_key='created_date')
    rating = EnumField(RatingType, by_value=True)
    comment_type = EnumField(CommentType, by_value=True)
