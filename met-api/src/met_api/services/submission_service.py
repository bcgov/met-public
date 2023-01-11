"""Service for submission management."""
from http import HTTPStatus

from flask import current_app

from met_api.constants.comment_status import Status
from met_api.constants.engagement_status import SubmissionStatus
from met_api.exceptions.business_exception import BusinessException
from met_api.models import Engagement as EngagementModel
from met_api.models import Survey as SurveyModel
from met_api.models.comment import Comment
from met_api.models.comment_status import CommentStatus
from met_api.models.db import session_scope
from met_api.models.pagination_options import PaginationOptions
from met_api.models.submission import Submission
from met_api.models.staff_note import StaffNote
from met_api.models.user import User as UserModel
from met_api.schemas.submission import PublicSubmissionSchema, SubmissionSchema
from met_api.services.comment_service import CommentService
from met_api.services.email_verification_service import EmailVerificationService
from met_api.services.survey_service import SurveyService
from met_api.services.user_service import UserService
from met_api.utils import notification
from met_api.utils.template import Template
from met_api.constants.staff_note_type import StaffNoteType


class SubmissionService:
    """Submission management service."""

    otherdateformat = '%Y-%m-%d'

    @classmethod
    def get(cls, submission_id):
        """Get submission by the id."""
        db_data = Submission.get(submission_id)
        return SubmissionSchema().dump(db_data)

    @classmethod
    def get_by_token(cls, token):
        """Get submission by the verification token."""
        email_verification = EmailVerificationService().get_active(token)
        submission_id = email_verification.get('submission_id')
        submission = Submission.get(submission_id)
        return PublicSubmissionSchema().dump(submission)

    @classmethod
    def create(cls, token, submission: SubmissionSchema):
        """Create submission."""
        cls._validate_fields(submission)
        survey_id = submission.get('survey_id')
        survey = SurveyService.get(survey_id)

        # Creates a scoped session that will be committed when diposed or rolledback if a exception occurs
        with session_scope() as session:
            email_verification = EmailVerificationService().verify(token, survey_id, None, session)
            user_id = email_verification.get('user_id')
            submission['user_id'] = user_id
            submission['created_by'] = user_id
            submission['engagement_id'] = survey.get('engagement_id')

            submission_result = Submission.create(submission, session)
            submission['id'] = submission_result.id
            comments = CommentService.extract_comments_from_survey(submission, survey)
            CommentService().create_comments(comments, session)
        return submission_result

    @classmethod
    def update(cls, data: SubmissionSchema):
        """Update submission."""
        cls._validate_fields(data)
        return Submission.update(data)

    @classmethod
    def update_comments(cls, token, data: PublicSubmissionSchema):
        """Update submission comments."""
        email_verification = EmailVerificationService().get_active(token)
        submission_id = email_verification.get('submission_id')
        submission = Submission.get(submission_id)
        submission.comment_status_id = Status.Pending

        with session_scope() as session:
            EmailVerificationService().verify(token, submission.survey_id, submission.id, session)
            comments_result = [Comment.update(submission.id, comment, session) for comment in data.get('comments', [])]
            Submission.update(SubmissionSchema().dump(submission), session)
            return comments_result

    @staticmethod
    def _validate_fields(submission):
        # TODO: Validate against survey form_json
        """Validate all fields."""
        survey_id = submission.get('survey_id', None)
        survey: SurveyModel = SurveyModel.get_survey(survey_id)
        engagement: EngagementModel = EngagementModel.find_by_id(survey.engagement_id)
        if not engagement:
            raise ValueError('Survey not linked to an Engagement')

        if engagement.status_id != SubmissionStatus.Open.value:
            raise ValueError('Engagement not open to submissions')

    @classmethod
    def review_comment(cls, submission_id, values: dict, external_user_id) -> SubmissionSchema:
        """Review comment."""
        user = UserService.get_user_by_external_id(external_user_id)

        cls.validate_review(values, user)
        reviewed_by = ' '.join([user.get('first_name', ''), user.get('last_name', '')])

        values['reviewed_by'] = reviewed_by
        values['user_id'] = user.get('id')
        with session_scope() as session:
            if values.get('status_id', None) == Status.Rejected.value:
                rejection_reason_changed = cls.check_rejection_reason_changed(submission_id, values)

            submission = Submission.update_comment_status(submission_id, values, session)

            cls.add_or_update_staff_note(submission.survey_id, submission_id, values)

            rejection_review_note = StaffNote.get_staff_note_type(submission_id, StaffNoteType.Review.name)

            if submission.comment_status_id == Status.Rejected.value and\
               submission.has_threat is not True and\
               submission.notify_email is True and\
               rejection_reason_changed is True:
                email_verification = EmailVerificationService().create({
                    'user_id': submission.user_id,
                    'survey_id': submission.survey_id,
                    'submission_id': submission.id,
                    'review_note': rejection_review_note[0].note,
                }, session)
                cls._send_rejected_email(submission, email_verification.get('verification_token'))

        return SubmissionSchema().dump(submission)

    @classmethod
    def validate_review(cls, values: dict, user):
        """Validate a review comment request."""
        status_id = values.get('status_id', None)
        has_personal_info = values.get('has_personal_info', None)
        has_profanity = values.get('has_profanity', None)
        has_threat = values.get('has_threat', None)
        rejected_reason_other = values.get('rejected_reason_other', None)

        valid_statuses = [status.id for status in CommentStatus.get_comment_statuses()]

        if not user:
            raise ValueError('Invalid user.')

        if not status_id or status_id == Status.Pending.value or status_id not in valid_statuses:
            raise ValueError('Invalid review status.')

        if status_id == Status.Rejected.value and\
           not any(set((has_personal_info, has_profanity, has_threat))) and\
           not rejected_reason_other:
            raise ValueError('A rejection reason is required.')

    @classmethod
    def add_or_update_staff_note(cls, survey_id, submission_id, values: dict):
        """Process staff note for a comment."""
        staff_notes = values.get('staff_note', [])
        if len(staff_notes) != 0:
            for staff_note in staff_notes:
                note_exists = StaffNote.get_staff_note(staff_note['id'])
                if len(note_exists) == 0:
                    doc = SubmissionService._create_staff_notes(survey_id, submission_id, staff_note)
                    doc.save()
                else:
                    StaffNote.update_staff_note(staff_note)

    @staticmethod
    def _create_staff_notes(survey_id, submission_id, staff_note):
        doc: StaffNote = StaffNote()
        doc.note = staff_note['note']
        doc.note_type = staff_note['note_type']
        doc.survey_id = survey_id
        doc.submission_id = submission_id
        return doc

    @classmethod
    def check_rejection_reason_changed(cls, submission_id, values: dict):
        """Check if rejection reason has changed."""
        review_note_changed = cls.is_review_note_changed(values)
        if review_note_changed is True:
            return True

        submission = Submission.get(submission_id)
        if submission.has_personal_info == values['has_personal_info'] and\
           submission.has_profanity == values['has_profanity'] and\
           submission.has_threat == values['has_threat'] and\
           submission.rejected_reason_other == values['rejected_reason_other']:
            return False
        return True

    @classmethod
    def is_review_note_changed(cls, values: dict):
        """Check if review note has changed."""
        staff_notes = values.get('staff_note', [])
        if len(staff_notes) != 0:
            for staff_note in staff_notes:
                if staff_note['note_type'] == StaffNoteType.Review.name:
                    note_exists = StaffNote.get_staff_note(staff_note['id'])
                    if len(note_exists) == 0:
                        return True
                    if note_exists[0].note == staff_note['note']:
                        return False
                    return True
        return False

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
    def _send_rejected_email(submission: Submission, token) -> None:
        """Send an verification email.Throws error if fails."""
        user_id = submission.user_id
        user: UserModel = UserModel.get_user(user_id)

        template_id = current_app.config.get('REJECTED_EMAIL_TEMPLATE_ID', None)
        subject, body, args = SubmissionService._render_email_template(submission, token)
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
    def _render_email_template(submission: Submission, token):
        template = Template.get_template('email_rejected_comment.html')
        engagement: EngagementModel = EngagementModel.get_engagement(submission.engagement_id)
        engagement_name = engagement.name

        site_url = current_app.config.get('SITE_URL')
        submission_path = current_app.config.get('SUBMISSION_PATH'). \
            format(engagement_id=submission.engagement_id, submission_id=submission.id, token=token)
        subject = current_app.config.get('REJECTED_EMAIL_SUBJECT'). \
            format(engagement_name=engagement_name)
        args = {
            'engagement_name': engagement_name,
            'has_personal_info': 'yes' if submission.has_personal_info else '',
            'has_profanity': 'yes' if submission.has_profanity else '',
            'has_other_reason': 'yes' if submission.rejected_reason_other else '',
            'other_reason': submission.rejected_reason_other,
            'submission_url': f'{site_url}{submission_path}',
        }
        body = template.render(
            engagement_name=args.get('engagement_name'),
            has_personal_info=args.get('has_personal_info'),
            has_profanity=args.get('has_profanity'),
            has_other_reason=args.get('has_other_reason'),
            other_reason=args.get('other_reason'),
        )
        return subject, body, args
