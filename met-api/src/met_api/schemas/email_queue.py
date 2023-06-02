"""Email queue schema class.

Manages the Email queue
"""

from marshmallow import EXCLUDE, Schema, fields


class EmailQueueSchema(Schema):
    """Schema for Email queue."""

    class Meta:  # pylint: disable=too-few-public-methods
        """Exclude unknown fields in the deserialized output."""

        unknown = EXCLUDE

    id = fields.Int(data_key='id')
    source_id = fields.Int(data_key='source_id')
    source_type = fields.Str(data_key='source_type')
    event_type = fields.Str(data_key='event_type')
    status = fields.Bool(data_key='status')
    email_date = fields.Str(data_key='email_date')
    created_by = fields.Str(data_key='created_by')
    created_date = fields.Str(data_key='created_date')
    updated_by = fields.Str(data_key='updated_by')
    updated_date = fields.Str(data_key='updated_date')
