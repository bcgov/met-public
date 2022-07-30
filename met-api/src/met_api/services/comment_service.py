
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

    @classmethod
    def get_comments_by_survey_id(cls, user_id, survey_id):
        """Get all comments."""
        filters = {}
        if not user_id:
            filters['status_id'] = Status.Accepted
        return Comment.get_comments_by_survey_id_query(survey_id, **filters)

    @classmethod
    def create_comments(cls, comments: list):
        """Create comment."""
        
        for comment in comments:
            cls.validate_fields(comment)
            
        return Comment.bulk_create_comment(comments)

    @staticmethod
    def validate_fields(data):
        """Validate all fields."""
        ##Will empty text return False
        empty_fields = [not data[field] for field in ['text', 'survey_id']]

        if any(empty_fields):
            raise ValueError('Some required fields for comments are missing')
        
    @staticmethod
    def extract_comments(survey_submission: SubmissionSchema, survey: SurveySchema):
        survey_form = survey.get('form_json', {})
        components = list(survey_form.get('components', []))
        if len(components) == 0:
            return;
        
        comments_keys = [component.get('key', None) for component in components if component.get('inputType', None) == 'text']
        
        submission = survey_submission.get('submission_json', {})
        comments_texts = [submission.get(key, None) for key in comments_keys]
        
        if None in comments_texts:
            raise KeyError('Some answered questions were not found in the survey form')
        
        comments = [{"text": comment_text, "survey_id": survey.get('id', None)} for comment_text in comments_texts]
        
        return comments
