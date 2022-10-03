
"""Service for feedback management."""
from met_api.models.feedback import Feedback
from met_api.models.pagination_options import PaginationOptions
from met_api.schemas.feedback import FeedbackSchema


class FeedbackService:
    """Feedback management service."""

    @classmethod
    def get_feedback_paginated(cls, pagination_options: PaginationOptions, search_text=''):
        """Get feedbacks paginated."""
        feedback_schema = FeedbackSchema(many=True)
        items, total = Feedback.get_all_paginated(
            pagination_options,
            search_text,
        )
        return {
            'items': feedback_schema.dump(items),
            'total': total
        }

    @classmethod
    def create_feedback(cls, feedback: FeedbackSchema):
        """Create feedback."""
        cls.validate_fields(feedback)

        return Feedback.create_feedback(feedback)

    @staticmethod
    def validate_fields(data):
        """Validate all fields."""
        # Will empty text return False
        empty_fields = [not data[field] for field in ['rating']]

        if any(empty_fields):
            raise ValueError('Some required fields for feedback are missing')
