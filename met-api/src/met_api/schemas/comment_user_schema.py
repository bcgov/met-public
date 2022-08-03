
    
"""Comment model class.

Manages the comment
"""

from marshmallow import EXCLUDE, Schema, fields

class CommentUserSchema(Schema):
    """User schema for comment."""

    class Meta:  # pylint: disable=too-few-public-methods
        """Exclude unknown fields in the deserialized output."""

        unknown = EXCLUDE

    first_name = fields.Str(data_key='first_name')
    last_name = fields.Str(data_key='last_name')
