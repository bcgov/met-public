"""Service for Subscription management."""
from met_api.models.subscription import Subscription as SubscriptionModel
from met_api.schemas.subscription import SubscriptionSchema


class SubscriptionService:
    """Subscription management service."""

    verification_expiry_hours = 24
    datetime_format = '%Y-%m-%d %H:%M:%S.%f'
    full_date_format = ' %B %d, %Y'
    date_format = '%Y-%m-%d'

    @classmethod
    def get(cls, user_id):
        """Get an active subscription matching the provided user id."""
        db_subscription = SubscriptionModel.get_by_user_id(user_id)
        return SubscriptionSchema().dump(db_subscription)

    @classmethod
    def create_subscription(cls, subscription_data) -> SubscriptionSchema:
        """Create a subscription."""
        subscription_data['created_by'] = subscription_data.get('user_id')
        return SubscriptionModel.create(subscription_data)

    @classmethod
    def update_subscription(cls, subscription_data) -> SubscriptionSchema:
        """Update subscription."""
        subscription_data['created_by'] = subscription_data.get('user_id')
        updated_subscription = SubscriptionModel.update(subscription_data)
        if not updated_subscription:
            raise ValueError('Subscription to update was not found')
        return SubscriptionModel.update(subscription_data)

    @classmethod
    def update_user_subscription(cls, subscription_data) -> SubscriptionSchema:
        """Update subscription for a user."""
        subscription_data['updated_by'] = subscription_data.get('user_id')
        updated_subscription = SubscriptionModel.update_user_subscription(subscription_data)
        if not updated_subscription:
            raise ValueError('Subscription to update was not found')
        return SubscriptionModel.update_user_subscription(subscription_data)
