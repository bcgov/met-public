"""Widget schema class."""
from marshmallow import EXCLUDE, Schema, fields
from marshmallow_enum import EnumField

from met_api.constants.membership_type import MembershipType

from .staff_user import StaffUserSchema


class MembershipSchema(Schema):
    """Membership schema."""

    class Meta:  # pylint: disable=too-few-public-methods
        """Exclude unknown fields in the deserialized output."""

        unknown = EXCLUDE

    id = fields.Int(data_key='id')
    status = fields.Str(data_key='status')
    created_date = fields.DateTime(data_key='created_date')
    engagement_id = fields.Int(data_key='engagement_id')
    status = fields.Str(data_key='status')
    user_id = fields.Int(data_key='user_id')
    user = fields.Nested(StaffUserSchema)
    type = EnumField(MembershipType, by_value=True)
