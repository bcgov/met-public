
"""Service for comment management."""
import itertools

from datetime import datetime

from met_api.models.comment import Comment
from met_api.models.pagination_options import PaginationOptions
from met_api.schemas.comment import CommentSchema
from met_api.schemas.submission import SubmissionSchema
from met_api.schemas.survey import SurveySchema
from met_api.services.document_generation_service import DocumentGenerationService


class CommentService:
    """Comment management service."""

    otherdateformat = '%Y-%m-%d'

    wizard_display = 'wizard'
    form_display = 'form'

    @staticmethod
    def get_comment(comment_id) -> CommentSchema:
        """Get Comment by the id."""
        comment = Comment.get_comment(comment_id)
        comment_schema = CommentSchema()
        return comment_schema.dump(comment)

    @staticmethod
    def get_comments_by_submission(submission_id) -> CommentSchema:
        """Get Comment by the id."""
        comments = Comment.get_by_submission(submission_id)
        comment_schema = CommentSchema(many=True)
        return comment_schema.dump(comments)

    @classmethod
    def get_comments_paginated(cls, user_id, survey_id, pagination_options: PaginationOptions, search_text=''):
        """Get comments paginated."""
        if not user_id:
            comment_schema = CommentSchema(many=True, only=('text', 'submission_date'))
            items, total = Comment.get_accepted_comments_by_survey_id_where_engagement_closed_paginated(
                survey_id, pagination_options)
        else:
            comment_schema = CommentSchema(many=True)
            items, total = Comment.get_comments_by_survey_id_paginated(
                survey_id,
                pagination_options,
                search_text,
            )
        return {
            'items': comment_schema.dump(items),
            'total': total
        }

    @classmethod
    def create_comments(cls, comments: list, session):
        """Create comment."""
        for comment in comments:
            cls.validate_fields(comment)

        return Comment.add_all_comments(comments, session)

    @staticmethod
    def validate_fields(data):
        """Validate all fields."""
        # Will empty text return False
        empty_fields = [not data[field] for field in ['text', 'survey_id', 'user_id']]

        if any(empty_fields):
            raise ValueError('Some required fields for comments are missing')

    @staticmethod
    def __form_comment(component_id, comment_text, survey_submission: SubmissionSchema, survey: SurveySchema):
        """Create a comment dict."""
        return {
            'component_id': component_id,
            'text': comment_text,
            'survey_id': survey.get('id', None),
            'user_id': survey_submission.get('user_id', None),
            'submission_id': survey_submission.get('id', None)
        }

    @classmethod
    def extract_components(cls, survey_form: dict):
        """Extract components from survey form."""
        components = list(survey_form.get('components', []))

        is_comments_from_form_survey = survey_form.get('display') == cls.form_display
        if is_comments_from_form_survey:
            return components

        is_comments_from_wizard_survey = survey_form.get('display') == cls.wizard_display
        if is_comments_from_wizard_survey:
            return list(itertools.chain.from_iterable([page.get('components', []) for page in components]))
        return []

    @classmethod
    def extract_comments_from_survey(cls, survey_submission: SubmissionSchema, survey: SurveySchema):
        """Extract comments from survey submission."""
        survey_form = survey.get('form_json', {})
        components = cls.extract_components(survey_form)
        if len(components) == 0:
            return []
        # get the 'id' for each component that has 'inputType' text and filter out the rest.
        text_component_keys = [
            component.get('key', None) for component in components
            if component.get('inputType', None) == 'text']
        submission = survey_submission.get('submission_json', {})
        comments = [cls.__form_comment(key, submission.get(key, ''), survey_submission, survey)
                    for key in text_component_keys if submission.get(key, '') != '']
        return comments    

    @classmethod
    def extract_comments_to_spread_sheet(cls, survey_id):
        """Extract comments to spread sheet."""

        comments = Comment.get_comments_by_survey_id(survey_id)
        formatted_comments = [
            {
                "commentNumber": comment.id,
                "dateSubmitted": str(comment.submission_date),
                "author": f'{comment.first_name} {comment.last_name}',
                "commentText": comment.text,
                "reviewer": comment.reviewed_by,
                "exportDate": str(datetime.utcnow())
            } 
            for comment in comments]

        data = {
            "comments": formatted_comments
        }
        return DocumentGenerationService().generate_comment_sheet(data= data)
