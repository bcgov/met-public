
"""Service for feedback management."""
from met_api.constants.feedback import FeedbackSourceType, FeedbackStatusType
from met_api.models.feedback import Feedback
from met_api.models.pagination_options import PaginationOptions
from met_api.schemas.feedback import FeedbackSchema


class FeedbackService:
    """Feedback management service."""

    @staticmethod
    def get_feedback(feedback_id):
        """Get feedback by the id."""
        feedback = Feedback.find_by_id(feedback_id)
        feedback_schema = FeedbackSchema()
        return feedback_schema.dump(feedback)

    @classmethod
    def get_feedback_paginated(cls, pagination_options: PaginationOptions,
                               status: FeedbackStatusType,
                               search_text='',
                               ):
        """Get feedbacks paginated."""
        feedback_schema = FeedbackSchema(many=True)
        items, total = Feedback.get_all_paginated(
            pagination_options,
            search_text,
            status,
        )
        return {
            'items': feedback_schema.dump(items),
            'total': total
        }

    @classmethod
    def create_feedback(cls, feedback: FeedbackSchema, user_id):
        """Create feedback."""
        if user_id is None:
            feedback['source'] = FeedbackSourceType.Public
        else:
            feedback['source'] = FeedbackSourceType.Internal
        new_feedback = Feedback.create_feedback(feedback)
        feedback_schema = FeedbackSchema()
        return feedback_schema.dump(new_feedback)

    @classmethod
    def update_feedback(cls, feedback_id, feedback_data):
        """Update feedback by its ID."""
        updated_feedback = Feedback.update_feedback(feedback_id, feedback_data)
        if updated_feedback:
            feedback_schema = FeedbackSchema()
            return feedback_schema.dump(updated_feedback)
        return None

    @classmethod
    def delete_feedback(cls, feedback_id):
        """Remove Feedback from engagement."""
        is_deleted = Feedback.delete_by_id(feedback_id)
        return is_deleted
