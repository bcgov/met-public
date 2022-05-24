from marshmallow import EXCLUDE, Schema, fields


"""
This class  consolidates schemas of extension operations.

__author__      = "jad.saad@aot-technologies.com"

"""

class EngagementStatusSchema(Schema):
    class Meta:  # pylint: disable=too-few-public-methods
        """Exclude unknown fields in the deserialized output."""

        unknown = EXCLUDE
        
    id = fields.Int(data_key="id")
    status_name = fields.Str(data_key="status_name")
    description = fields.Str(data_key="description")
    created_date = fields.Str(data_key="created_date")
    updated_date = fields.Str(data_key="updated_date")