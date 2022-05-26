from marshmallow import EXCLUDE, Schema, fields


"""
This class  consolidates schemas of extension operations.

__author__      = "jad.saad@aot-technologies.com"

"""

class EngagementSchema(Schema):
    class Meta:  # pylint: disable=too-few-public-methods
        """Exclude unknown fields in the deserialized output."""

        unknown = EXCLUDE
        
    id = fields.Int(data_key="id")
    name = fields.Str(data_key="name")
    description = fields.Str(data_key="description")
    rich_text_state = fields.Str(data_key="rich_text_state")
    start_date = fields.Str(data_key="start_date")
    end_date = fields.Str(data_key="end_date")
    status_id = fields.Int(data_key="status_id")
    user_id = fields.Int(data_key="user_id")
    updated_date = fields.Str(data_key="updated_date")
    published_date = fields.Str(data_key="published_date")