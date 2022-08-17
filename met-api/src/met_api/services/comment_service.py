
"""Service for comment management."""
from met_api.models.comment import Comment
from met_api.models.comment_status import CommentStatus, CommentStatusSchema
from met_api.schemas.comment import CommentSchema
from met_api.schemas.submission import SubmissionSchema
from met_api.schemas.survey import SurveySchema
from met_api.services.user_service import UserService


class CommentService:
    """Comment management service."""

    otherdateformat = '%Y-%m-%d'

    @staticmethod
    def get_comment(comment_id) -> CommentSchema:
        """Get Comment by the id."""
        comment = Comment.get_comment(comment_id)
        comment_schema = CommentSchema()
        return comment_schema.dump(comment)

    @classmethod
    def get_comments_by_survey_id(cls, user_id, survey_id):
        """Get all comments."""
        if not user_id:
            comment_schema = CommentSchema(many=True, only=('text', 'submission_date', 'survey'))
            return comment_schema.dump(
                Comment.get_accepted_comments_by_survey_id_where_engagement_closed(survey_id)
            )

        comment_schema = CommentSchema(many=True)
        return comment_schema.dump(Comment.get_comments_by_survey_id(survey_id))

    @classmethod
    def create_comments(cls, comments: list):
        """Create comment."""
        for comment in comments:
            cls.validate_fields(comment)

        return Comment.add_all_comments(comments)

    @staticmethod
    def validate_fields(data):
        """Validate all fields."""
        # Will empty text return False
        empty_fields = [not data[field] for field in ['text', 'survey_id', 'user_id']]

        if any(empty_fields):
            raise ValueError('Some required fields for comments are missing')

    @staticmethod
    def __form_comment(comment_text, survey_submission: SubmissionSchema, survey: SurveySchema):
        """Create a comment dict."""
        return {
            'text': comment_text,
            'survey_id': survey.get('id', None),
            'user_id': survey_submission.get('user_id', None)
        }

    @classmethod
    def extract_comments(cls, survey_submission: SubmissionSchema, survey: SurveySchema):
        """Extract comments from survey submission."""
        survey_form = survey.get('form_json', {})
        components = list(survey_form.get('components', []))
        if len(components) == 0:
            return []
        # get the 'key' for each component that has 'inputType' text and filter out the rest.
        comments_keys = [
            component.get('key', None) for component in components
            if component.get('inputType', None) == 'text']
        submission = survey_submission.get('submission_json', {})
        comments_texts = [submission.get(key, None) for key in comments_keys if submission.get(key, None) != '']
        if None in comments_texts:
            raise KeyError('Some answered questions were not found in the survey form')
        comments = [cls.__form_comment(comment_text, survey_submission, survey) for comment_text in comments_texts]
        return comments

    @classmethod
    def review_comment(cls, comment_id, status_id, external_user_id):
        """Review comment."""
        user = UserService.get_user_by_external_id(external_user_id)
        
        valid_statuses = [status.id for status in CommentStatus.get_comment_statuses()]
        
        if not status_id or status_id == 1 or status_id not in valid_statuses or not user:
            raise ValueError('Invalid review')        

        comment = cls.get_comment(comment_id)
        if not comment:
            raise KeyError('Comment was not found')

        reviewed_by = ' '.join([user.get('first_name', ''), user.get('last_name', '')])

        return Comment.update_comment_status(comment_id, status_id, reviewed_by)
