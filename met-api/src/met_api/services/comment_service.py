
"""Service for comment management."""
from met_api.models.comment import Comment
from met_api.schemas.comment import CommentSchema
from met_api.schemas.submission import SubmissionSchema
from met_api.schemas.survey import SurveySchema


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
            return comment_schema.dump(Comment.get_publicly_viewable_comments_by_survey_id_query(survey_id))

        comment_schema = CommentSchema(many=True)
        return comment_schema.dump(Comment.get_comments_by_survey_id_query(survey_id))

    @classmethod
    def create_comments(cls, comments: list):
        """Create comment."""
        for comment in comments:
            cls.validate_fields(comment)

        return Comment.bulk_create_comment(comments)

    @staticmethod
    def validate_fields(data):
        """Validate all fields."""
        # Will empty text return False
        empty_fields = [not data[field] for field in ['text', 'survey_id', 'user_id']]

        if any(empty_fields):
            raise ValueError('Some required fields for comments are missing')

    @staticmethod
    def form_comment(comment_text, survey_submission: SubmissionSchema, survey: SurveySchema):
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

        comments_keys = [
            component.get(
                'key',
                None) for component in components if component.get(
                'inputType',
                None) == 'text']

        submission = survey_submission.get('submission_json', {})
        comments_texts = [submission.get(key, None) for key in comments_keys]

        if None in comments_texts:
            raise KeyError('Some answered questions were not found in the survey form')

        comments = [cls.form_comment(comment_text, survey_submission, survey) for comment_text in comments_texts]

        print(comments)

        return comments

    @classmethod
    def review_comment(cls, comment_id, status_id, reviewed_by):
        """review comment."""
        if not status_id or status_id == 1 or not reviewed_by:
            raise ValueError('Invalid review')

        comment = cls.get_comment(comment_id)
        db_status_id = comment.get('comment_status').get('id')

        if db_status_id != 1:
            raise ValueError('Comment has already been reviewed')

        return Comment.update_comment_status(comment_id, status_id, reviewed_by)
