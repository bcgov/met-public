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
    def update_subscription_for_user(cls, subscription_data) -> SubscriptionSchema:
        """Update subscription for a user."""
        subscription_data['updated_by'] = subscription_data.get('user_id')
        updated_subscription = SubscriptionModel.update_subscription_for_user(subscription_data)
        if not updated_subscription:
            raise ValueError('Subscription to update was not found')
        return SubscriptionModel.update_subscription_for_user(subscription_data)

    @classmethod
    def update_subscription_for_user_eng(cls, subscription_data) -> SubscriptionSchema:
        """Update subscription for a user."""
        subscription_data['updated_by'] = subscription_data.get('user_id')
        updated_subscription = SubscriptionModel.update_subscription_for_user_eng(subscription_data)
        if not updated_subscription:
            raise ValueError('Subscription to update was not found')
        return SubscriptionModel.update_subscription_for_user_eng(subscription_data)

    @classmethod
    def create_or_update_subscription(self, subscription: dict):
        """Create or update a subscription."""
        self.validate_fields(subscription)

        user_id = subscription.get('user_id')
        engagement_id = subscription.get('engagement_id')
        db_user = SubscriptionModel.get_by_user_and_eng_id(user_id, engagement_id)

        if db_user is None:
            return self.create_subscription(subscription)

        return self.update_subscription_for_user_eng(subscription)

    @staticmethod
    def validate_fields(data: SubscriptionSchema):
        """Validate all fields."""
        empty_fields = [not data.get(field, None) for field in [
            'engagement_id',
            'user_id',
        ]]

        if any(empty_fields):
            raise ValueError('Some required fields are empty')
