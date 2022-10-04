
"""Service for feedback management."""
from met_api.models.feedback import Feedback
from met_api.models.pagination_options import PaginationOptions
from met_api.schemas.feedback import FeedbackSchema


class FeedbackService:
    """Feedback management service."""

    @staticmethod
    def get_feedback(feedback_id):
        """Get feedback by the id."""
        feedback = Feedback.get(feedback_id)
        feedback_schema = FeedbackSchema()
        return feedback_schema.dump(feedback)

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
        feedback_schema = FeedbackSchema()
        new_feedback = Feedback.create_feedback(feedback)
        return feedback_schema.dump(new_feedback)
