"""Service for submission management."""
from datetime import datetime
from http import HTTPStatus

from flask import current_app

from met_api.constants.comment_status import Status
from met_api.constants.email_verification import EmailVerificationType
from met_api.constants.engagement_status import SubmissionStatus
from met_api.constants.staff_note_type import StaffNoteType
from met_api.exceptions.business_exception import BusinessException
from met_api.models import Engagement as EngagementModel
from met_api.models import Survey as SurveyModel
from met_api.models import Tenant as TenantModel
from met_api.models.comment import Comment
from met_api.models.comment_status import CommentStatus
from met_api.models.db import session_scope
from met_api.models.pagination_options import PaginationOptions
from met_api.models.staff_note import StaffNote
from met_api.models.submission import Submission
from met_api.models.user import User as UserModel
from met_api.schemas.submission import PublicSubmissionSchema, SubmissionSchema
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
        return SubmissionSchema(exclude=['submission_json']).dump(db_data)

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
        survey: SurveyModel = SurveyModel.find_by_id(survey_id)
        engagement: EngagementModel = EngagementModel.find_by_id(survey.engagement_id)
        if not engagement:
            raise ValueError('Survey not linked to an Engagement')

        if engagement.status_id != SubmissionStatus.Open.value:
            raise ValueError('Engagement not open to submissions')

    @classmethod
    def review_comment(cls, submission_id, staff_review_details: dict, external_user_id) -> SubmissionSchema:
        """Review comment."""
        user = UserService.get_user_by_external_id(external_user_id)

        cls.validate_review(staff_review_details, user)
        reviewed_by = ' '.join([user.get('first_name', ''), user.get('last_name', '')])

        staff_review_details['reviewed_by'] = reviewed_by
        staff_review_details['user_id'] = user.get('id')

        with session_scope() as session:
            should_send_email = SubmissionService._should_send_email(submission_id, staff_review_details)
            submission = Submission.update_comment_status(submission_id, staff_review_details, session)
            if staff_notes := staff_review_details.get('staff_note', []):
                cls.add_or_update_staff_note(submission.survey_id, submission_id, staff_notes)

            if should_send_email:
                rejection_review_note = StaffNote.get_staff_note_by_type(submission_id, StaffNoteType.Review.name)
                SubmissionService._trigger_email(rejection_review_note[0].note, session, submission)
        session.commit()
        return SubmissionSchema().dump(submission)

    @staticmethod
    def _trigger_email(review_note, session, submission):
        email_verification = EmailVerificationService().create({
            'user_id': submission.user_id,
            'survey_id': submission.survey_id,
            'submission_id': submission.id,
            'type': EmailVerificationType.RejectedComment,
        }, session)
        SubmissionService._send_rejected_email(submission, review_note, email_verification.get('verification_token'))

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

        if status_id == Status.Rejected.value and \
                not any(set((has_personal_info, has_profanity, has_threat))) and \
                not rejected_reason_other:
            raise ValueError('A rejection reason is required.')

    @classmethod
    def add_or_update_staff_note(cls, survey_id, submission_id, staff_notes):
        """Process staff note for a comment."""
        for staff_note in staff_notes:
            note = StaffNote.get_staff_note_by_type(submission_id, staff_note.get('note_type'))
            if note:
                note[0].note = staff_note['note']
                note[0].flush()
            else:
                doc = SubmissionService._create_staff_notes(survey_id, submission_id, staff_note)
                doc.flush()

    @staticmethod
    def _create_staff_notes(survey_id, submission_id, staff_note):
        doc: StaffNote = StaffNote()
        doc.note = staff_note['note']
        doc.note_type = staff_note['note_type']
        doc.survey_id = survey_id
        doc.submission_id = submission_id
        return doc

    @staticmethod
    def _should_send_email(submission_id: int, staff_comment_details: dict) -> bool:
        """Check if an email should be sent for a rejected submission."""
        # Dont send the mail
        #   if the comment has threat
        #   if notify_email is false
        # Send the mail
        #   if the status of the comment is rejected
        #      if review note has changed
        #      if review reason has changed

        if staff_comment_details.get('has_threat') is True:
            return False
        if staff_comment_details.get('notify_email') is False:
            return False
        if staff_comment_details.get('status_id') == Status.Rejected.value:
            has_review_note_changed = SubmissionService.is_review_note_changed(submission_id, staff_comment_details)
            if has_review_note_changed:
                return True
            has_reason_changed = SubmissionService.is_rejection_reason_changed(submission_id, staff_comment_details)
            if has_reason_changed:
                return True
        return False

    @staticmethod
    def is_rejection_reason_changed(submission_id, values: dict):
        """Check if rejection reason has changed."""
        submission = Submission.get(submission_id)
        if submission.has_personal_info == values.get('has_personal_info') and \
                submission.has_profanity == values.get('has_profanity') and \
                submission.has_threat == values.get('has_threat') and \
                submission.rejected_reason_other == values.get('rejected_reason_other'):
            return False

        return True

    @staticmethod
    def is_review_note_changed(submission_id: int, values: dict) -> bool:
        """Check if review note has changed for a submission."""
        staff_notes = values.get('staff_note', [])
        for staff_note in staff_notes:
            if staff_note['note_type'] == StaffNoteType.Review.name:
                note = StaffNote.get_staff_note_by_type(submission_id, StaffNoteType.Review.name)
                if not note or note[0].note != staff_note.get('note'):
                    return True
        return False

    @classmethod
    def get_paginated(
            cls,
            survey_id,
            pagination_options: PaginationOptions,
            search_text: str,
            advanced_search_filters: dict
    ):
        """Get submissions by survey id paginated."""
        if not CommentService.can_view_unapproved_comments(survey_id):
            if 'status' in advanced_search_filters:
                if advanced_search_filters['status'] in (Status.Rejected.value, Status.Pending.value):
                    # Cant view any Rejected/Pending
                    return {'items': [], 'total': 0}
                if not advanced_search_filters['status']:
                    # No blanket search.Return only approved if filter doesnt have any status
                    advanced_search_filters['status'] = Status.Approved.value

        items, total = Submission.get_by_survey_id_paginated(
            survey_id,
            pagination_options,
            search_text,
            advanced_search_filters if any(advanced_search_filters.values()) else None
        )
        return {
            'items': SubmissionSchema(many=True, exclude=['submission_json']).dump(items),
            'total': total
        }

    @staticmethod
    def _send_rejected_email(submission: Submission, review_note, token) -> None:
        """Send an verification email.Throws error if fails."""
        user_id = submission.user_id
        user: UserModel = UserModel.find_by_id(user_id)

        template_id = current_app.config.get('REJECTED_EMAIL_TEMPLATE_ID', None)
        subject, body, args = SubmissionService._render_email_template(submission, review_note, token)
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
    def _render_email_template(submission: Submission, review_note, token):
        template = Template.get_template('email_rejected_comment.html')
        engagement: EngagementModel = EngagementModel.find_by_id(submission.engagement_id)
        survey: SurveyModel = SurveyModel.find_by_id(submission.survey_id)
        engagement_name = engagement.name
        survey_name = survey.name

        submission_path = current_app.config.get('SUBMISSION_PATH'). \
            format(engagement_id=submission.engagement_id, submission_id=submission.id, token=token)
        submission_url = notification.get_tenant_site_url(engagement.tenant_id, submission_path)
        subject = current_app.config.get('REJECTED_EMAIL_SUBJECT'). \
            format(engagement_name=engagement_name)
        args = {
            'engagement_name': engagement_name,
            'survey_name': survey_name,
            'has_personal_info': 'yes' if submission.has_personal_info else '',
            'has_profanity': 'yes' if submission.has_profanity else '',
            'has_other_reason': 'yes' if submission.rejected_reason_other else '',
            'other_reason': submission.rejected_reason_other,
            'submission_url': submission_url,
            'review_note': review_note,
            'end_date': datetime.strftime(engagement.end_date, EmailVerificationService.full_date_format),
        }
        body = template.render(
            engagement_name=args.get('engagement_name'),
            survey_name=args.get('survey_name'),
            has_personal_info=args.get('has_personal_info'),
            has_profanity=args.get('has_profanity'),
            has_other_reason=args.get('has_other_reason'),
            other_reason=args.get('other_reason'),
            review_note=args.get('review_note'),
            end_date=args.get('end_date'),
        )
        return subject, body, args
