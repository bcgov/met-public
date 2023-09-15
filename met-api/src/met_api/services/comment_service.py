"""Service for comment management."""
import itertools

from met_api.constants.comment_status import Status
from met_api.constants.membership_type import MembershipType
from met_api.constants.export_comments import RejectionReason
from met_api.models import Survey as SurveyModel
from met_api.models.comment import Comment
from met_api.models.engagement_metadata import EngagementMetadataModel
from met_api.models.membership import Membership as MembershipModel
from met_api.models.pagination_options import PaginationOptions
from met_api.models.submission import Submission as SubmissionModel
from met_api.models.staff_user import StaffUser as StaffUserModel
from met_api.schemas.comment import CommentSchema
from met_api.schemas.submission import SubmissionSchema
from met_api.schemas.survey import SurveySchema
from met_api.services import authorization
from met_api.services.document_generation_service import DocumentGenerationService
from met_api.utils.roles import Role
from met_api.utils.token_info import TokenInfo
from met_api.utils.enums import GeneratedDocumentTypes, MembershipStatus


class CommentService:
    """Comment management service."""

    otherdateformat = '%Y-%m-%d'

    wizard_display = 'wizard'
    form_display = 'form'

    @staticmethod
    def get_comment(comment_id) -> CommentSchema:
        """Get Comment by the id."""
        comment = Comment.find_by_id(comment_id)
        comment_schema = CommentSchema()
        return comment_schema.dump(comment)

    @staticmethod
    def get_comments_by_submission(submission_id) -> CommentSchema:
        """Get Comment by the id."""
        comments = Comment.get_by_submission(submission_id)
        submission = SubmissionModel.find_by_id(submission_id)
        if submission.comment_status_id != Status.Approved.value:
            can_view_unapproved_comments = CommentService.can_view_unapproved_comments(submission.survey_id)
            if not can_view_unapproved_comments:
                return {}
        comment_schema = CommentSchema(many=True)
        return comment_schema.dump(comments)

    @staticmethod
    def can_view_unapproved_comments(survey_id: int) -> bool:
        """Return if the current user can see the comments in the survey."""
        if not survey_id:
            return False

        user_roles = TokenInfo.get_user_roles()
        if Role.REVIEW_COMMENTS.value in user_roles:
            return True

        engagement = SurveyModel.find_by_id(survey_id)
        if not engagement:
            return False

        if not (user_id := TokenInfo.get_id()):
            return False

        user = StaffUserModel.get_user_by_external_id(user_id)
        if user:
            membership = MembershipModel.find_by_engagement_and_user_id(
                engagement.engagement_id,
                user.id,
                status=MembershipStatus.ACTIVE.value
            )
            if membership:
                return membership.type == MembershipType.TEAM_MEMBER

        return False

    @classmethod
    def get_comments_paginated(cls, survey_id, pagination_options: PaginationOptions, search_text=''):
        """Get comments paginated."""
        can_view_unapproved_comments = CommentService.can_view_unapproved_comments(survey_id)

        if not can_view_unapproved_comments:
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
        empty_fields = [not data[field] for field in ['text', 'survey_id', 'participant_id']]

        if any(empty_fields):
            raise ValueError('Some required fields for comments are missing')

    @staticmethod
    def __form_comment(component_id, comment_text, survey_submission: SubmissionSchema, survey: SurveySchema):
        """Create a comment dict."""
        return {
            'component_id': component_id,
            'text': comment_text,
            'survey_id': survey.get('id', None),
            'participant_id': survey_submission.get('participant_id', None),
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
    def export_comments_to_spread_sheet(cls, survey_id):
        """Export comments to spread sheet."""
        engagement = SurveyModel.find_by_id(survey_id)
        one_of_roles = (
            MembershipType.TEAM_MEMBER.name,
            Role.EXPORT_TO_CSV.value
        )
        authorization.check_auth(one_of_roles=one_of_roles, engagement_id=engagement.engagement_id)
        comments = Comment.get_comments_by_survey_id(survey_id)
        metadata_model = EngagementMetadataModel.find_by_id(engagement.engagement_id)
        project_name = metadata_model.project_metadata.get('project_name') if metadata_model else None

        titles = cls.get_titles(comments)
        data_rows = cls.get_data_rows(titles, comments, project_name)

        formatted_comments = {
            'titles': titles,
            'comments': data_rows
        }
        document_options = {
            'document_type': GeneratedDocumentTypes.COMMENT_SHEET.value,
            'template_name': 'staff_comments_sheet.xlsx',
            'convert_to': 'csv',
            'report_name': 'comments_sheet'
        }
        return DocumentGenerationService().generate_document(data=formatted_comments, options=document_options)

    @classmethod
    def get_titles(cls, comments):
        """Get the titles to be displayed on the sheet."""
        # Title could be dynamic based on the number of comment type questions on the survey
        return [{'label': label.get('label', None)} for label in comments[0].get('comments')]

    @classmethod
    def get_data_rows(cls, titles, comments, project_name):
        """Get the content to be exported on to the sheet."""
        data_rows = []

        for comment in comments:
            comment_text = cls.get_comment_text(titles, comment)

            rejection_note = cls.get_rejection_note(comment)

            data_rows.append({
                'commentNumber': comment.get('id'),
                'dateSubmitted': str(comment.get('created_date')),
                'commentText': comment_text,
                'status': Status(comment.get('comment_status_id')).name,
                'datePublished': str(comment.get('review_date')),
                'rejectionNote': rejection_note,
                'reviewer': comment.get('reviewed_by'),
                'projectName': project_name
            })

        return data_rows

    @classmethod
    def get_comment_text(cls, titles, comment):
        """Get the comments to be exported to the sheet."""
        comments = [{'text': text.get('text', None)} for text in comment.get('comments')]
        # Making sure that the number of comments matches the number of questions on the comment to keep
        # the layout intact. In case user has not responded to a question the column value should be
        # blank.
        comments.extend([{'text': ''}] * (len(titles) - len(comments)))

        return comments

    @classmethod
    def get_rejection_note(cls, comment):
        """Get the rejection note."""
        rejection_note = []

        if comment.get('has_personal_info'):
            rejection_note.append(RejectionReason.has_personal_info.value)
        if comment.get('has_profanity'):
            rejection_note.append(RejectionReason.has_profanity.value)
        if comment.get('has_threat'):
            rejection_note.append(RejectionReason.has_threat.value)
        if comment.get('rejected_reason_other'):
            rejection_note.append(comment.get('rejected_reason_other'))

        return ', '.join(rejection_note)
