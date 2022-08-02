
"""Service for submission management."""
from met_api.constants.engagement_status import SubmissionStatus
from met_api.models.submission import Submission
from met_api.models.survey import Survey
from met_api.schemas.submission import SubmissionSchema
from met_api.services.email_verification_service import EmailVerificationService
from met_api.services.comment_service import CommentService
from met_api.services.survey_service import SurveyService


class SubmissionService:
    """Submission management service."""

    otherdateformat = '%Y-%m-%d'

    @classmethod
    def get(cls, submission_id):
        """Get submission by the id."""
        db_data = Submission.get_survey(submission_id)
        return db_data

    @classmethod
    def get_by_survey_id(cls, survey_id):
        """Get all surveys."""
        db_data = Submission.get_by_survey_id(survey_id)
        return db_data

    @classmethod
    def create(cls, submission: SubmissionSchema):
        """Create submission."""
        cls.validate_fields(submission)
        # verification_token = submission.get('verification_token', None)
        survey_id = submission.get('survey_id', None)
        email_verification = {}
        user_id = email_verification.get('user_id', 1)
        submission['user_id'] = user_id
        submission['created_by'] = user_id

        survey = SurveyService.get(survey_id)
        comments = CommentService.extract_comments(submission, survey)
        CommentService.create_comments(comments)

        return Submission.create(submission)

    @classmethod
    def update(cls, data: SubmissionSchema):
        """Update submission."""
        cls.validate_fields(data)
        return Submission.update(data)

    @staticmethod
    def validate_fields(submission):
        # TODO: Validate against survey form_json
        """Validate all fields."""
        empty_fields = [not submission[field] for field in ['submission_json', 'survey_id']]

        if any(empty_fields):
            raise ValueError('Some required fields are empty')

        survey_id = submission.get('survey_id', None)
        survey = Survey.get_survey(survey_id)
        engagement = survey.get('engagement', None)
        if not engagement:
            raise ValueError('Survey not linked to an Engagement')

        submission_status = engagement.get('submission_status', None)

        if submission_status != SubmissionStatus.Open:
            raise ValueError('Engagement not open to submissions')

    @staticmethod
    def validate_email_verification(verification_token, survey_id):
        """Validate the provided verification token."""
        return EmailVerificationService().verify(verification_token, survey_id)
