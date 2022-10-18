"""Service for submission management."""
from met_api.constants.engagement_status import SubmissionStatus
from met_api.models import Engagement as EngagementModel
from met_api.models import Survey as SurveyModel
from met_api.models.db import session_scope
from met_api.models.submission import Submission
from met_api.schemas.submission import SubmissionSchema
from met_api.services.comment_service import CommentService
from met_api.services.email_verification_service import EmailVerificationService
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
        return SubmissionSchema(many=True).dump(db_data)

    @classmethod
    def create(cls, submission: SubmissionSchema):
        """Create submission."""
        cls._validate_fields(submission)
        verification_token = submission.get('verification_token', None)
        survey_id = submission.get('survey_id', None)

        # Creates a scoped session that will be committed when diposed or rolledback if a exception occurs
        with session_scope() as session:
            email_verification = EmailVerificationService().verify(verification_token, survey_id, session)
            user_id = email_verification.get('user_id', None)
            submission['user_id'] = user_id
            submission['created_by'] = user_id

            survey = SurveyService.get(survey_id)
            comments = CommentService.extract_comments(submission, survey)
            CommentService().create_comments(comments, session)
            result = Submission.create(submission, session)
        return result

    @classmethod
    def update(cls, data: SubmissionSchema):
        """Update submission."""
        cls._validate_fields(data)
        return Submission.update(data)

    @staticmethod
    def _validate_fields(submission):
        # TODO: Validate against survey form_json
        """Validate all fields."""
        survey_id = submission.get('survey_id', None)
        survey: SurveyModel = SurveyModel.get_survey(survey_id)
        engagement: EngagementModel = EngagementModel.get_engagement(survey.engagement_id)
        if not engagement:
            raise ValueError('Survey not linked to an Engagement')

        if engagement.status_id != SubmissionStatus.Open.value:
            raise ValueError('Engagement not open to submissions')
