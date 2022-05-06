from marshmallow import EXCLUDE, Schema, fields

"""
This class  consolidates schemas of extension operations.

__author__      = "jad.saad@aot-technologies.com"

"""

class EngagementSchema(Schema):
    class Meta:  # pylint: disable=too-few-public-methods
        """Exclude unknown fields in the deserialized output."""

        unknown = EXCLUDE
        
    engagement_id = fields.Int(data_key="engagement_id")
    title = fields.Str(data_key="title")
    description = fields.Str(data_key="description")
    start_date = fields.Str(data_key="start_date")
    end_date = fields.Str(data_key="end_date")