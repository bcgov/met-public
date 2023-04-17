"""Tenat model class.

Manages the tenants
"""
from __future__ import annotations

from .base_model import BaseModel
from .db import db


class Tenant(BaseModel):
    """Definition of the Tenant entity."""

    __tablename__ = 'tenant'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    short_name = db.Column(db.String(10), comment='A small code for the tenant ie GDX , EAO.', nullable=False)
    name = db.Column(db.String(50), comment='Full name of the ministry.ie Env Assessment Office')
    description = db.Column(db.String(100))

    @staticmethod
    def find_by_short_name(short_name: str) -> Tenant:
        """Find tenant using short name."""
        return db.session.query(Tenant).filter(Tenant.short_name.ilike(short_name)).one_or_none()
