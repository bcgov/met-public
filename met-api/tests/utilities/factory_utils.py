# Copyright © 2019 Province of British Columbia
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
"""Test Utils.

Test Utility for creating model factory.
"""
from faker import Faker
from flask import current_app, g

from met_api.config import get_named_config
from met_api.constants.engagement_status import Status
from met_api.constants.widget import WidgetType
from met_api.models import Tenant
from met_api.models.comment import Comment as CommentModel
from met_api.models.email_verification import EmailVerification as EmailVerificationModel
from met_api.models.engagement import Engagement as EngagementModel
from met_api.models.engagement_settings import EngagementSettingsModel
from met_api.models.engagement_slug import EngagementSlug as EngagementSlugModel
from met_api.models.feedback import Feedback as FeedbackModel
from met_api.models.membership import Membership as MembershipModel
from met_api.models.participant import Participant as ParticipantModel
from met_api.models.report_setting import ReportSetting as ReportSettingModel
from met_api.models.staff_user import StaffUser as StaffUserModel
from met_api.models.submission import Submission as SubmissionModel
from met_api.models.subscription import Subscription as SubscriptionModel
from met_api.models.survey import Survey as SurveyModel
from met_api.models.widget import Widget as WidgetModal
from met_api.models.widget_documents import WidgetDocuments as WidgetDocumentModel
from met_api.models.widget_item import WidgetItem as WidgetItemModal
from met_api.utils.constants import TENANT_ID_HEADER
from met_api.utils.enums import MembershipStatus
from tests.utilities.factory_scenarios import (
    TestCommentInfo, TestEngagementInfo, TestEngagementSlugInfo, TestFeedbackInfo, TestParticipantInfo,
    TestReportSettingInfo, TestSubmissionInfo, TestSurveyInfo, TestTenantInfo, TestUserInfo, TestWidgetDocumentInfo,
    TestWidgetInfo, TestWidgetItemInfo)

CONFIG = get_named_config('testing')
fake = Faker()

JWT_HEADER = {
    'alg': CONFIG.JWT_OIDC_TEST_ALGORITHMS,
    'typ': 'JWT',
    'kid': CONFIG.JWT_OIDC_TEST_AUDIENCE
}


def set_global_tenant(tenant_id=1):
    """Set the global tenant id."""
    g.tenant_id = tenant_id


def factory_survey_model(survey_info: dict = TestSurveyInfo.survey1):
    """Produce a survey model."""
    survey = SurveyModel(
        name=fake.name(),
        form_json=survey_info.get('form_json'),
        created_by=survey_info.get('created_by'),
        updated_by=survey_info.get('updated_by'),
        created_date=survey_info.get('created_date'),
        updated_date=survey_info.get('updated_date'),
        is_hidden=survey_info.get('is_hidden'),
        is_template=survey_info.get('is_template')
    )
    survey.save()
    return survey


def factory_survey_and_eng_model(survey_info: dict = TestSurveyInfo.survey1):
    """Produce a survey model."""
    eng = factory_engagement_model(status=Status.Published.value)
    survey = SurveyModel(
        name=fake.name(),
        form_json=survey_info.get('form_json'),
        created_by=survey_info.get('created_by'),
        updated_by=survey_info.get('updated_by'),
        created_date=survey_info.get('created_date'),
        updated_date=survey_info.get('updated_date'),
        is_hidden=survey_info.get('is_hidden'),
        is_template=survey_info.get('is_template'),
        engagement_id=eng.id
    )
    survey.save()
    return survey, eng


def factory_subscription_model():
    """Produce a subscription model."""
    survey, eng = factory_survey_and_eng_model()
    participant = factory_participant_model()
    subscription = SubscriptionModel(
        engagement_id=eng.id,
        participant_id=participant.id,
        is_subscribed=True,
    )
    subscription.save()
    return subscription


def factory_email_verification(survey_id):
    """Produce a EmailVerification model."""
    email_verification = EmailVerificationModel(
        verification_token=fake.uuid4(),
        is_active=True
    )
    if survey_id:
        email_verification.survey_id = survey_id

    email_verification.save()
    return email_verification


def factory_engagement_model(eng_info: dict = TestEngagementInfo.engagement1, name=None, status=None):
    """Produce a engagement model."""
    engagement = EngagementModel(
        name=name if name else fake.name(),
        description=eng_info.get('description'),
        rich_description=eng_info.get('rich_description'),
        content=eng_info.get('content'),
        rich_content=eng_info.get('rich_content'),
        created_by=eng_info.get('created_by'),
        updated_by=eng_info.get('updated_by'),
        status_id=status if status else eng_info.get('status'),
        start_date=eng_info.get('start_date'),
        end_date=eng_info.get('end_date'),
        is_internal=eng_info.get('is_internal')
    )
    engagement.save()
    return engagement


def factory_tenant_model(tenant_info: dict = TestTenantInfo.tenant1):
    """Produce a tenant model."""
    tenant = Tenant(
        short_name=tenant_info.get('short_name'),
        name=tenant_info.get('name'),
        description=tenant_info.get('description'),
        title=tenant_info.get('title'),
        logo_url=tenant_info.get('logo_url'),
    )
    tenant.save()
    return tenant


def factory_staff_user_model(external_id=None, user_info: dict = TestUserInfo.user_staff_1):
    """Produce a staff user model."""
    # Generate a external id if not passed
    external_id = fake.random_number(
        digits=5) if external_id is None else external_id
    user = StaffUserModel(
        first_name=user_info['first_name'],
        last_name=user_info['last_name'],
        middle_name=user_info['middle_name'],
        email_address=user_info['email_address'],
        external_id=str(external_id),
        status_id=user_info['status_id'],
        tenant_id=user_info['tenant_id'],
    )
    user.save()
    return user


def factory_participant_model(participant: dict = TestParticipantInfo.participant1):
    """Produce a participant model."""
    participant = ParticipantModel(
        email_address=ParticipantModel.encode_email(
            participant['email_address']),
    )
    participant.save()
    return participant


def factory_membership_model(user_id, engagement_id, member_type='TEAM_MEMBER', status=MembershipStatus.ACTIVE.value):
    """Produce a Membership model."""
    membership = MembershipModel(user_id=user_id,
                                 engagement_id=engagement_id,
                                 type=member_type,
                                 is_latest=True,
                                 version=1,
                                 status=status)

    membership.created_by_id = user_id
    membership.save()
    return membership


def factory_feedback_model(feedback_info: dict = TestFeedbackInfo.feedback1, status=None):
    """Produce a feedback model."""
    feedback = FeedbackModel(
        status=feedback_info.get('status'),
        comment=fake.text(),
        rating=feedback_info.get('rating'),
        comment_type=feedback_info.get('comment_type'),
        source=feedback_info.get('source'),
    )
    feedback.save()
    return feedback


def factory_auth_header(jwt, claims):
    """Produce JWT tokens for use in tests."""
    return {
        'Authorization': 'Bearer ' + jwt.create_jwt(claims=claims, header=JWT_HEADER),
        TENANT_ID_HEADER: current_app.config.get('DEFAULT_TENANT_SHORT_NAME'),
    }


def factory_widget_model(widget_info: dict = TestWidgetInfo.widget1):
    """Produce a widget model."""
    widget = WidgetModal(
        widget_type_id=WidgetType.WHO_IS_LISTENING.value,
        engagement_id=widget_info.get('engagement_id'),
        created_by=widget_info.get('created_by'),
        updated_by=widget_info.get('updated_by'),
        created_date=widget_info.get('created_date'),
        updated_date=widget_info.get('updated_date'),
    )
    widget.save()
    return widget


def factory_widget_item_model(widget_info: dict = TestWidgetItemInfo.widget_item1):
    """Produce a widget model."""
    widget = WidgetItemModal(
        widget_id=widget_info.get('widget_id'),
        widget_data_id=widget_info.get('widget_data_id'),
        created_by=widget_info.get('created_by'),
        updated_by=widget_info.get('updated_by'),
        created_date=widget_info.get('created_date'),
        updated_date=widget_info.get('updated_date'),
    )
    widget.save()
    return widget


def factory_submission_model(survey_id, engagement_id, participant_id,
                             submission_info: dict = TestSubmissionInfo.submission1):
    """Produce a submission model."""
    submission = SubmissionModel(
        survey_id=survey_id,
        engagement_id=engagement_id,
        participant_id=participant_id,
        submission_json=submission_info.get('submission_json'),
        created_by=submission_info.get('created_by'),
        updated_by=submission_info.get('updated_by'),
        created_date=submission_info.get('created_date'),
        updated_date=submission_info.get('updated_date'),
        comment_status_id=submission_info.get('comment_status_id'),
        reviewed_by=submission_info.get('reviewed_by'),
        review_date=submission_info.get('review_date'),
    )
    submission.save()
    return submission


def factory_comment_model(survey_id, submission_id, comment_info: dict = TestCommentInfo.comment1):
    """Produce a comment model."""
    comment = CommentModel(
        survey_id=survey_id,
        submission_id=submission_id,
        component_id=comment_info.get('component_id'),
        text=comment_info.get('text'),
        submission_date=comment_info.get('submission_date'),
    )
    comment.save()
    return comment


def factory_document_model(document_info: dict = TestWidgetDocumentInfo.document1):
    """Produce a comment model."""
    document = WidgetDocumentModel(
        title=document_info.get('title'),
        type=document_info.get('type'),
        parent_document_id=document_info.get('parent_document_id'),
        url=document_info.get('url'),
        sort_index=document_info.get('sort_index'),
        widget_id=document_info.get('widget_id'),
    )
    document.save()
    return document


def patch_token_info(claims, monkeypatch):
    """Patch token info to mimic g."""

    def token_info():
        """Return token info."""
        return claims

    monkeypatch.setattr(
        'met_api.utils.user_context._get_token_info', token_info)


def factory_engagement_slug_model(eng_slug_info: dict = TestEngagementSlugInfo.slug1):
    """Produce a engagement model."""
    slug = EngagementSlugModel(
        slug=eng_slug_info.get('slug'),
        engagement_id=eng_slug_info.get('engagement_id'),
        created_date=eng_slug_info.get('created_date'),
    )
    slug.save()
    return slug


def factory_survey_report_setting_model(report_setting_info: dict = TestReportSettingInfo.report_setting_1):
    """Produce a engagement model."""
    setting = ReportSettingModel(
        survey_id=report_setting_info.get('survey_id'),
        question_id=report_setting_info.get('question_id'),
        question_key=report_setting_info.get('question_key'),
        question_type=report_setting_info.get('question_type'),
        question=report_setting_info.get('question'),
        display=report_setting_info.get('display'),
    )
    setting.save()
    return setting


def factory_engagement_setting_model(engagement_id):
    """Produce a engagement setting model."""
    setting = EngagementSettingsModel(
        engagement_id=engagement_id,
        send_report=False,
    )
    setting.save()
    return setting
