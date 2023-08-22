"""Membership engagement schema class."""
from marshmallow import fields

from .memberships import MembershipSchema


class MembershipEngagementSchema(MembershipSchema):
    """Membership schema with engagement details."""

    engagement = fields.Nested(
        'EngagementSchema', only=['id', 'name']
    )
