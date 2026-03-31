"""This manages a Membership Type record.

It defines the available types of membership Status have with engagements.
"""
from __future__ import annotations

from .base_model import BaseModel
from .db import db


class MembershipStatusCode(BaseModel):  # pylint: disable=too-few-public-methods
    """Definition of the MembershipStatusCode entity."""

    __tablename__ = 'membership_status_codes'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    status_name = db.Column(db.String(50))
    description = db.Column(db.String(50))
