"""Subscription model class.

Manages the Subscription
"""
from __future__ import annotations
from datetime import datetime
from sqlalchemy import ForeignKey

from met_api.schemas.subscription import SubscriptionSchema

from .base_model import BaseModel
from .db import db


class Subscription(BaseModel):  # pylint: disable=too-few-public-methods
    """Definition of the subscription entity."""

    __tablename__ = 'subscription'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    email_verification_id = db.Column(db.Integer, ForeignKey('email_verification.id'), nullable=True)
    user_id = db.Column(db.Integer, ForeignKey('met_users.id'), nullable=True)
    is_subscribed = db.Column(db.Boolean, nullable=False)

    @classmethod
    def get(cls) -> Subscription:
        """Get a subscription."""
        db_subscription = db.session.query(Subscription)
        return db_subscription

    @classmethod
    def get_by_user_id(cls, user_id) -> Subscription:
        """Get a subscription."""
        db_subscription = db.session.query(Subscription)\
            .filter_by(user_id=user_id)\
            .order_by(Subscription.created_date.desc())\
            .first()
        return db_subscription

    @classmethod
    def create(cls, subscription: SubscriptionSchema, session=None) -> Subscription:
        """Create a subscription."""
        new_subscription = Subscription(
            email_verification_id=subscription.get('email_verification_id', None),
            user_id=subscription.get('user_id', None),
            is_subscribed=subscription.get('is_subscribed', None),
            created_date=datetime.utcnow(),
            created_by=subscription.get('created_by', None),
        )
        db.session.add(new_subscription)
        if session is None:
            db.session.commit()
        else:
            session.flush()
        return new_subscription

    @classmethod
    def update(cls, subscription: SubscriptionSchema, session=None) -> Subscription:
        """Update an subscription."""
        update_fields = dict(
            is_subscribed=subscription.get('is_subscribed', None),
            updated_date=datetime.utcnow(),
            updated_by=subscription.get('updated_by', None),
        )
        subscription_id = subscription.get('id', None)
        query = Subscription.query.filter_by(id=subscription_id)
        record = query.first()
        if not record:
            raise ValueError('Subscription Not Found')
        query.update(update_fields)
        if session is None:
            db.session.commit()
        return query.first()

    @classmethod
    def update_user_subscription(cls, subscription: SubscriptionSchema, session=None) -> Subscription:
        """Update an subscription."""
        update_fields = dict(
            is_subscribed=subscription.get('is_subscribed', None),
            updated_date=datetime.utcnow(),
            updated_by=subscription.get('updated_by', None),
        )
        user_id = subscription.get('user_id', None)
        query = Subscription.query.filter_by(user_id=user_id)
        record = query.first()
        if not record:
            raise ValueError('Subscription Not Found')
        query.update(update_fields)
        if session is None:
            db.session.commit()
        return query.first()
