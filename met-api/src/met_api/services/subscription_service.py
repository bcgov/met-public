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
    def get(cls, participant_id):
        """Get an active subscription matching the provided participant id."""
        db_subscription = SubscriptionModel.get_by_participant_id(participant_id)
        return SubscriptionSchema().dump(db_subscription)

    @classmethod
    def create_subscription(cls, subscription_data) -> SubscriptionSchema:
        """Create a subscription."""
        subscription_data['created_by'] = subscription_data.get('participant_id')
        return SubscriptionModel.create(subscription_data)

    @classmethod
    def update_subscription_for_participant(cls, subscription_data) -> SubscriptionSchema:
        """Update subscription for a participant."""
        subscription_data['updated_by'] = subscription_data.get('participant_id')
        updated_subscription = SubscriptionModel.update_subscription_for_participant(subscription_data)
        if not updated_subscription:
            raise ValueError('Subscription to update was not found')
        return SubscriptionModel.update_subscription_for_participant(subscription_data)

    @classmethod
    def update_subscription_for_participant_eng(cls, subscription_data) -> SubscriptionSchema:
        """Update subscription for a participant."""
        subscription_data['updated_by'] = subscription_data.get('participant_id')
        updated_subscription = SubscriptionModel.update_subscription_for_participant_eng(subscription_data)
        if not updated_subscription:
            raise ValueError('Subscription to update was not found')
        return SubscriptionModel.update_subscription_for_participant_eng(subscription_data)

    @classmethod
    def create_or_update_subscription(cls, subscription: dict):
        """Create or update a subscription."""
        cls.validate_fields(subscription)

        participant_id = subscription.get('participant_id')
        engagement_id = subscription.get('engagement_id')
        db_subscription = SubscriptionModel.get_by_participant_and_eng_id(participant_id, engagement_id)

        if db_subscription is None:
            return cls.create_subscription(subscription)

        return cls.update_subscription_for_participant_eng(subscription)

    @staticmethod
    def validate_fields(data: SubscriptionSchema):
        """Validate all fields."""
        empty_fields = [not data.get(field, None) for field in [
            'engagement_id',
            'participant_id',
        ]]

        if any(empty_fields):
            raise ValueError('Some required fields are empty')
