"""Service for submission management."""
from met_api.constants.comment_status import Status
from met_api.constants.engagement_status import SubmissionStatus
from met_api.models import Engagement as EngagementModel
from met_api.models import Survey as SurveyModel
from met_api.models.comment_status import CommentStatus
from met_api.models.db import session_scope
from met_api.models.pagination_options import PaginationOptions
from met_api.models.submission import Submission
from met_api.schemas.submission import SubmissionSchema
from met_api.services.comment_service import CommentService
from met_api.services.email_verification_service import EmailVerificationService
from met_api.services.survey_service import SurveyService
from met_api.services.user_service import UserService


class SubmissionService:
    """Submission management service."""

    otherdateformat = '%Y-%m-%d'

    @classmethod
    def get(cls, submission_id):
        """Get submission by the id."""
        db_data = Submission.get(submission_id)
        return SubmissionSchema().dump(db_data)

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

            submission_result = Submission.create(submission, session)
            submission['id'] = submission_result.identifier
            survey = SurveyService.get(survey_id)
            comments = CommentService.extract_comments(submission, survey)
            CommentService().create_comments(comments, session)
        return submission_result

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

    @classmethod
    def review_comment(cls, submission_id, status_id, external_user_id) -> SubmissionSchema:
        """Review comment."""
        user = UserService.get_user_by_external_id(external_user_id)

        valid_statuses = [status.id for status in CommentStatus.get_comment_statuses()]

        if not status_id or status_id == Status.Pending.value or status_id not in valid_statuses or not user:
            raise ValueError('Invalid review')

        reviewed_by = ' '.join([user.get('first_name', ''), user.get('last_name', '')])

        submission = Submission.update_comment_status(submission_id, status_id, reviewed_by, user.get('id'))
        return SubmissionSchema().dump(submission)

    @classmethod
    def get_paginated(cls, survey_id, pagination_options: PaginationOptions, search_text=''):
        """Get submissions by survey id paginated."""
        items, total = Submission.get_by_survey_id_paginated(
            survey_id,
            pagination_options,
            search_text,
        )
        return {
            'items': SubmissionSchema(many=True).dump(items),
            'total': total
        }
