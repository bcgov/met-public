
"""Service for comment management."""
from met_api.constants.comment_status import Status
from met_api.models.comment import Comment
from met_api.schemas.comment import CommentSchema
from met_api.schemas.submission import SubmissionSchema
from met_api.schemas.survey import SurveySchema


class CommentService:
    """Comment management service."""

    otherdateformat = '%Y-%m-%d'

    @staticmethod
    def get_comment(comment_id, user_id) -> CommentSchema:
        """Get Comment by the id."""
        comment = Comment.get_comment(comment_id)

        if comment:
            if user_id is None and comment.get('status_id', None) != Status.Accepted:
                # Non authenticated users only have access to accepted comments
                return None

        return comment

    @staticmethod
    def get_comments_by_survey_id(user_id, survey_id):
        """Get all comments."""
        filters = {}
        if not user_id:
            filters['status_id'] = Status.Accepted
        return Comment.get_comments_by_survey_id(survey_id, filters)

    def create_comments(self, comments: list):
        """Create comment."""
        
        for comment in comments:
            self.validate_fields(comment)
            
        return Comment.bulk_create_comment(comments)

    @staticmethod
    def validate_fields(data):
        """Validate all fields."""
        empty_fields = [not data[field] for field in ['text', 'survey_id']]

        if any(empty_fields):
            raise ValueError('Some required fields are empty')
        
    @staticmethod
    def extract_comments(surveySubmission: SubmissionSchema, survey: SurveySchema):
        return;
