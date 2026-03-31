"""Staff Note model class.

Manages the review/internal notes for a comment
"""

from marshmallow import EXCLUDE, Schema, fields


class StaffNoteSchema(Schema):
    """Schema for staff note."""

    class Meta:  # pylint: disable=too-few-public-methods
        """Exclude unknown fields in the deserialized output."""

        unknown = EXCLUDE

    id = fields.Int(data_key='id')
    note = fields.Str(data_key='note')
    note_type = fields.Str(data_key='note_type')
    survey_id = fields.Int(data_key='survey_id')
    submission_id = fields.Int(data_key='submission_id')
