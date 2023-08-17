"""Membership engagement schema class."""
from marshmallow import fields


from .memberships import MembershipSchema
from .engagement import EngagementSchema


class MembershipEngagementSchema(MembershipSchema):
    """Membership schema with engagement details."""

    engagement = fields.Nested(EngagementSchema)
