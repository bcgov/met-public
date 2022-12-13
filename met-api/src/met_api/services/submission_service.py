"""Service for submission management."""
from http import HTTPStatus

from flask import current_app

from met_api.constants.comment_status import Status
from met_api.constants.engagement_status import SubmissionStatus
from met_api.exceptions.business_exception import BusinessException
from met_api.models import Engagement as EngagementModel
from met_api.models import Survey as SurveyModel
from met_api.models.comment_status import CommentStatus
from met_api.models.db import session_scope
from met_api.models.pagination_options import PaginationOptions
from met_api.models.submission import Submission
from met_api.models.user import User as UserModel
from met_api.schemas.submission import SubmissionSchema
from met_api.services.comment_service import CommentService
from met_api.services.email_verification_service import EmailVerificationService
from met_api.services.survey_service import SurveyService
from met_api.services.user_service import UserService
from met_api.utils import notification
from met_api.utils.template import Template


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
    def review_comment(cls, submission_id, values: dict, external_user_id) -> SubmissionSchema:
        """Review comment."""
        user = UserService.get_user_by_external_id(external_user_id)
        status_id = values.get('status_id', None)

        cls.validate_review(values, user)
        reviewed_by = ' '.join([user.get('first_name', ''), user.get('last_name', '')])

        submission = Submission.update_comment_status(submission_id, values, reviewed_by, user.get('id'))

        if status_id == Status.Rejected.value and submission.has_threat is not True:
            cls._send_rejected_email(submission)

        return SubmissionSchema().dump(submission)

    @classmethod
    def validate_review(cls, values: dict, user):
        status_id = values.get('status_id', None)
        has_personal_info = values.get('has_personal_info', None)
        has_profanity = values.get('has_profanity', None)
        has_threat = values.get('has_threat', None)
        rejected_reason_other = values.get('rejected_reason_other', None)

        valid_statuses = [status.id for status in CommentStatus.get_comment_statuses()]

        if not status_id or status_id == Status.Pending.value or status_id not in valid_statuses or not user:
            raise ValueError('Invalid review status.')

        if status_id == Status.Rejected.value and\
           not any(set((has_personal_info, has_profanity, has_threat))) and\
           not rejected_reason_other:
            raise ValueError('A rejection reason is required.')


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

    @staticmethod
    def _send_rejected_email(submission: Submission) -> None:
        """Send an verification email.Throws error if fails."""
        user_id = submission.user_id
        user: UserModel = UserModel.get_user(user_id)

        template_id = current_app.config.get('REJECTED_EMAIL_TEMPLATE_ID', None)
        subject, body, args = SubmissionService._render_email_template(submission)
        try:
            notification.send_email(subject=subject,
                                    email=user.email_id,
                                    html_body=body,
                                    args=args,
                                    template_id=template_id)
        except Exception as exc:  # noqa: B902
            current_app.logger.error('<Notification for rejected comment failed', exc)
            raise BusinessException(
                error='Error sending rejected comment notification email.',
                status_code=HTTPStatus.INTERNAL_SERVER_ERROR) from exc

    @staticmethod
    def _render_email_template(submission: Submission):
        survey: SurveyModel = SurveyModel.get_survey(submission.survey_id)
        template = Template.get_template('email_rejected_comment.html')
        engagement: EngagementModel = EngagementModel.get_engagement(survey.engagement_id)
        engagement_name = engagement.name
        subject = current_app.config.get('REJECTED_EMAIL_SUBJECT'). \
            format(engagement_name=engagement_name)
        args = {
            'engagement_name': engagement_name,
            'has_personal_info': 'yes' if submission.has_personal_info else '',
            'has_profanity': 'yes' if submission.has_profanity else '',
            'has_other_reason': 'yes' if submission.rejected_reason_other else '',
            'other_reason': submission.rejected_reason_other,
        }
        body = template.render(
            engagement_name=args.get('engagement_name'),
            has_personal_info=args.get('has_personal_info'),
            has_profanity=args.get('has_profanity'),
            has_other_reason=args.get('has_other_reason'),
            other_reason=args.get('other_reason'),
        )
        return subject, body, args
