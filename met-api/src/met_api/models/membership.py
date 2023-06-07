"""Membership class.

Manages the membership between a user and engagement/survey
"""
from __future__ import annotations

from typing import List

from sqlalchemy import ForeignKey, and_

from met_api.constants.membership_type import MembershipType
from met_api.utils.enums import MembershipStatus

from .base_model import BaseModel
from .staff_user import StaffUser
from .db import db


class Membership(BaseModel):
    """Definition of the Memebership entity."""

    __tablename__ = 'membership'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    status = db.Column(
        ForeignKey('membership_status_codes.id')
    )
    engagement_id = db.Column(db.Integer, ForeignKey('engagement.id', ondelete='CASCADE'), nullable=False)
    user_id = db.Column(db.Integer, ForeignKey('staff_users.id'), nullable=True)
    type = db.Column(db.Enum(MembershipType), nullable=False)
    user = db.relationship('StaffUser', foreign_keys=[user_id], lazy='joined')
    membership_status = db.relationship('MembershipStatusCode', foreign_keys=[status], lazy='select')
    engagement = db.relationship('Engagement', foreign_keys=[engagement_id], lazy='select')
    tenant_id = db.Column(db.Integer, db.ForeignKey('tenant.id'), nullable=True)

    @classmethod
    def find_by_engagement(cls, engagement_id) -> List[Membership]:
        """Get a survey."""
        memberships = db.session.query(Membership) \
            .filter(Membership.engagement_id == engagement_id) \
            .all()
        return memberships

    @classmethod
    def find_by_user_id(cls, user_external_id) -> List[Membership]:
        """Get memberships by user id."""
        memberships = db.session.query(Membership) \
            .join(StaffUser, StaffUser.id == Membership.user_id) \
            .filter(and_(StaffUser.external_id == user_external_id,
                         Membership.type == MembershipType.TEAM_MEMBER
                         )
                    ) \
            .all()
        return memberships

    @classmethod
    def find_by_engagement_and_user_id(cls, eng_id, userid, status=MembershipStatus.ACTIVE.value) \
            -> List[Membership]:
        """Get a survey."""
        memberships = db.session.query(Membership) \
            .join(StaffUser, StaffUser.id == Membership.user_id) \
            .filter(and_(Membership.engagement_id == eng_id,
                         Membership.user_id == userid,
                         Membership.status == status
                         )
                    ) \
            .all()
        return memberships
