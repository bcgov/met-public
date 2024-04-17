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

from typing import Optional

from faker import Faker
from flask import current_app, g

from met_api.auth import Auth
from met_api.config import get_named_config
from met_api.constants.email_verification import EmailVerificationType
from met_api.constants.engagement_status import Status
from met_api.constants.widget import WidgetType
from met_api.models import Tenant
from met_api.models.comment import Comment as CommentModel
from met_api.models.email_verification import EmailVerification as EmailVerificationModel
from met_api.models.engagement import Engagement as EngagementModel
from met_api.models.engagement_content import EngagementContent as EngagementContentModel
from met_api.models.engagement_content_translation import \
    EngagementContentTranslation as EngagementContentTranslationModel
from met_api.models.engagement_metadata import EngagementMetadata, MetadataTaxon
from met_api.models.engagement_settings import EngagementSettingsModel
from met_api.models.engagement_slug import EngagementSlug as EngagementSlugModel
from met_api.models.engagement_translation import EngagementTranslation as EngagementTranslationModel
from met_api.models.event_item import EventItem as EventItemModel
from met_api.models.event_item_translation import EventItemTranslation as EventItemTranslationModel
from met_api.models.feedback import Feedback as FeedbackModel
from met_api.models.language import Language as LanguageModel
from met_api.models.membership import Membership as MembershipModel
from met_api.models.participant import Participant as ParticipantModel
from met_api.models.poll_answer_translation import PollAnswerTranslation as PollAnswerTranslationModel
from met_api.models.poll_answers import PollAnswer as PollAnswerModel
from met_api.models.poll_responses import PollResponse as PollResponseModel
from met_api.models.report_setting import ReportSetting as ReportSettingModel
from met_api.models.staff_user import StaffUser as StaffUserModel
from met_api.models.submission import Submission as SubmissionModel
from met_api.models.subscribe_item import SubscribeItem as SubscribeItemModel
from met_api.models.subscribe_item_translation import SubscribeItemTranslation as SubscribeItemTranslationModel
from met_api.models.subscription import Subscription as SubscriptionModel
from met_api.models.survey import Survey as SurveyModel
from met_api.models.survey_translation import SurveyTranslation as SurveyTranslationModel
from met_api.models.timeline_event import TimelineEvent as TimelineEventModel
from met_api.models.timeline_event_translation import TimelineEventTranslation as TimelineEventTranslationModel
from met_api.models.user_group_membership import UserGroupMembership as UserGroupMembershipModel
from met_api.models.widget import Widget as WidgetModal
from met_api.models.widget_documents import WidgetDocuments as WidgetDocumentModel
from met_api.models.widget_events import WidgetEvents as WidgetEventsModel
from met_api.models.widget_item import WidgetItem as WidgetItemModal
from met_api.models.widget_map import WidgetMap as WidgetMapModel
from met_api.models.widget_poll import Poll as WidgetPollModel
from met_api.models.widget_timeline import WidgetTimeline as WidgetTimelineModel
from met_api.models.widget_translation import WidgetTranslation as WidgetTranslationModel
from met_api.models.widget_video import WidgetVideo as WidgetVideoModel
from met_api.models.widgets_subscribe import WidgetSubscribe as WidgetSubscribeModel
from met_api.utils.constants import TENANT_ID_HEADER
from met_api.utils.enums import CompositeRoleId, MembershipStatus
from tests.utilities.factory_scenarios import (
    TestCommentInfo, TestEngagementContentInfo, TestEngagementContentTranslationInfo, TestEngagementInfo,
    TestEngagementMetadataInfo, TestEngagementMetadataTaxonInfo, TestEngagementSlugInfo, TestEngagementTranslationInfo,
    TestEventItemTranslationInfo, TestEventnfo, TestFeedbackInfo, TestJwtClaims, TestLanguageInfo, TestParticipantInfo,
    TestPollAnswerInfo, TestPollAnswerTranslationInfo, TestPollResponseInfo, TestReportSettingInfo, TestSubmissionInfo,
    TestSubscribeInfo, TestSubscribeItemTranslationInfo, TestSurveyInfo, TestSurveyTranslationInfo, TestTenantInfo,
    TestTimelineEventTranslationInfo, TestTimelineInfo, TestUserInfo, TestWidgetDocumentInfo, TestWidgetInfo,
    TestWidgetItemInfo, TestWidgetMap, TestWidgetPollInfo, TestWidgetTranslationInfo, TestWidgetVideo)


fake = Faker()

CONFIG = get_named_config('testing')

JWT_HEADER = {
    'alg': CONFIG.JWT_OIDC_TEST_ALGORITHMS,
    'typ': 'JWT',
    'kid': CONFIG.JWT_OIDC_TEST_AUDIENCE,
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
        is_template=survey_info.get('is_template'),
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
        engagement_id=eng.id,
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


def factory_email_verification(survey_id, type=None, submission_id=None):
    """Produce a EmailVerification model."""
    email_verification = EmailVerificationModel(
        verification_token=fake.uuid4(),
        is_active=True,
    )
    if type:
        email_verification.type = type
    else:
        email_verification.type = EmailVerificationType.Survey

    if survey_id:
        email_verification.survey_id = survey_id

    if submission_id:
        email_verification.submission_id = submission_id

    email_verification.save()
    return email_verification


def factory_engagement_model(eng_info: dict = TestEngagementInfo.engagement1, name=None, status=None):
    """Produce a engagement model."""
    engagement = EngagementModel(
        name=name if name else fake.name(),
        description=eng_info.get('description'),
        rich_description=eng_info.get('rich_description'),
        created_by=eng_info.get('created_by'),
        updated_by=eng_info.get('updated_by'),
        status_id=status if status else eng_info.get('status'),
        start_date=eng_info.get('start_date'),
        end_date=eng_info.get('end_date'),
        is_internal=eng_info.get('is_internal'),
    )
    if tenant_id := eng_info.get('tenant_id'):
        engagement.tenant_id = tenant_id
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


def factory_engagement_metadata_model(
    metadata_info: dict = TestEngagementMetadataInfo.metadata0,
):
    """Produce a test-ready engagement metadata model."""
    metadata = EngagementMetadata(
        engagement_id=metadata_info.get('engagement_id'),
        taxon_id=metadata_info.get('taxon_id'),
        value=metadata_info.get('value', fake.text()),
    )
    metadata.save()
    return metadata


def factory_metadata_requirements(auth: Optional[Auth] = None):
    """Create a tenant, an associated staff user, and engagement, for tests."""
    tenant = factory_tenant_model()
    tenant.short_name = fake.lexify(text='????').upper()
    (engagement_info := TestEngagementInfo.engagement1.copy())['tenant_id'] = tenant.id
    engagement = factory_engagement_model(engagement_info)
    (staff_info := TestUserInfo.user_staff_1.copy())['tenant_id'] = tenant.id
    factory_staff_user_model(TestJwtClaims.staff_admin_role['sub'], staff_info)
    factory_user_group_membership_model(TestJwtClaims.staff_admin_role['sub'], tenant.id)
    taxon = factory_metadata_taxon_model(tenant.id)
    if auth:
        headers = factory_auth_header(
            auth,
            claims=TestJwtClaims.staff_admin_role,
            tenant_id=tenant.short_name,
        )
        return taxon, engagement, tenant, headers
    return taxon, engagement, tenant, None


def factory_taxon_requirements(auth: Optional[Auth] = None):
    """Create a tenant and staff user, and headers for auth."""
    tenant = factory_tenant_model()
    tenant.short_name = fake.lexify(text='????').upper()
    (staff_info := TestUserInfo.user_staff_1.copy())['tenant_id'] = tenant.id
    factory_staff_user_model(TestJwtClaims.staff_admin_role.get('sub'), staff_info)
    factory_user_group_membership_model(TestJwtClaims.staff_admin_role['sub'], tenant.id)
    if auth:
        headers = factory_auth_header(
            auth,
            claims=TestJwtClaims.staff_admin_role,
            tenant_id=tenant.short_name,
        )
        return tenant, headers
    return tenant, None


def factory_metadata_taxon_model(
    tenant_id: int = 1,
    taxon_info: dict = TestEngagementMetadataTaxonInfo.taxon1,
):
    """Produce a test-ready metadata taxon model."""
    taxon = MetadataTaxon(
        tenant_id=tenant_id,
        name=taxon_info.get('name'),
        description=taxon_info.get('description'),
        freeform=taxon_info.get('freeform'),
        data_type=taxon_info.get('data_type'),
        one_per_engagement=taxon_info.get('one_per_engagement'),
        position=taxon_info.get('position'),
    )
    taxon.save()
    return taxon


def factory_staff_user_model(external_id=None, user_info: dict = TestUserInfo.user_staff_1):
    """Produce a staff user model."""
    # Generate a external id if not passed
    external_id = external_id or fake.uuid4()
    user = StaffUserModel(
        external_id=str(external_id),
        first_name=user_info['first_name'],
        last_name=user_info['last_name'],
        middle_name=user_info['middle_name'],
        email_address=user_info['email_address'],
        status_id=user_info['status_id'],
        tenant_id=user_info['tenant_id'],
    )
    user.save()
    return user


def factory_user_group_membership_model(external_id=None, tenant_id=None, group_id=None):
    """Produce a user group membership model."""
    # Generate a external id if not passed
    external_id = external_id or fake.uuid4()
    # Generate a group id if not passed
    group_id = group_id or CompositeRoleId.ADMIN.value
    # Check if tenant_id is provided, otherwise use a default value
    if tenant_id is None:
        tenant_id = '1'
    membership = UserGroupMembershipModel(
        staff_user_external_id=str(external_id),
        group_id=group_id,
        tenant_id=tenant_id,
        is_active=True,
    )
    membership.save()
    return membership


def factory_participant_model(
    participant: dict = TestParticipantInfo.participant1,
):
    """Produce a participant model."""
    participant = ParticipantModel(
        email_address=ParticipantModel.encode_email(participant['email_address']),
    )
    participant.save()
    return participant


def factory_membership_model(
    user_id,
    engagement_id,
    member_type='TEAM_MEMBER',
    status=MembershipStatus.ACTIVE.value,
):
    """Produce a Membership model."""
    membership = MembershipModel(
        user_id=user_id,
        engagement_id=engagement_id,
        type=member_type,
        is_latest=True,
        version=1,
        status=status,
    )

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


def factory_auth_header(jwt, claims, tenant_id=None):
    """Produce JWT tokens for use in tests."""
    return {
        'Authorization': 'Bearer ' + jwt.create_jwt(claims=claims, header=JWT_HEADER),
        TENANT_ID_HEADER: (tenant_id or current_app.config.get('DEFAULT_TENANT_SHORT_NAME')),
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


def factory_widget_item_model(
    widget_info: dict = TestWidgetItemInfo.widget_item1,
):
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


def factory_submission_model(
    survey_id,
    engagement_id,
    participant_id,
    submission_info: dict = TestSubmissionInfo.submission1,
):
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


def factory_document_model(
    document_info: dict = TestWidgetDocumentInfo.document1,
):
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

    monkeypatch.setattr('met_api.utils.user_context._get_token_info', token_info)

    # Add a database user that matches the token
    # factory_staff_user_model(external_id=claims.get('sub'))


def factory_engagement_slug_model(
    eng_slug_info: dict = TestEngagementSlugInfo.slug1,
):
    """Produce a engagement model."""
    slug = EngagementSlugModel(
        slug=eng_slug_info.get('slug'),
        engagement_id=eng_slug_info.get('engagement_id'),
        created_date=eng_slug_info.get('created_date'),
    )
    slug.save()
    return slug


def factory_survey_report_setting_model(
    report_setting_info: dict = TestReportSettingInfo.report_setting_1,
):
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


def factory_poll_model(widget, poll_info: dict = TestWidgetPollInfo.poll1):
    """Produce a Poll  model."""
    poll = WidgetPollModel(
        title=poll_info.get('title'),
        description=poll_info.get('description'),
        status=poll_info.get('status'),
        engagement_id=widget.engagement_id,
        widget_id=widget.id,
    )
    poll.save()
    return poll


def factory_poll_answer_model(poll, answer_info: dict = TestPollAnswerInfo.answer1):
    """Produce a Poll  model."""
    answer = PollAnswerModel(answer_text=answer_info.get('answer_text'), poll_id=poll.id)
    answer.save()
    return answer


def factory_poll_response_model(poll, answer, response_info: dict = TestPollResponseInfo.response1):
    """Produce a Poll  model."""
    response = PollResponseModel(
        participant_id=response_info.get('participant_id'),
        selected_answer_id=answer.id,
        poll_id=poll.id,
        widget_id=poll.widget_id,
    )
    response.save()
    return response


def factory_video_model(video_info: dict = TestWidgetVideo.video1):
    """Produce a comment model."""
    video = WidgetVideoModel(
        video_url=video_info.get('video_url'),
        description=video_info.get('description'),
        widget_id=video_info.get('widget_id'),
        engagement_id=video_info.get('engagement_id'),
    )
    video.save()
    return video


def factory_widget_timeline_model(
    widget_timeline: dict = TestTimelineInfo.widget_timeline,
):
    """Produce a widget timeline model."""
    widget_timeline = WidgetTimelineModel(
        widget_id=widget_timeline.get('widget_id'),
        engagement_id=widget_timeline.get('engagement_id'),
        title=widget_timeline.get('title'),
        description=widget_timeline.get('description'),
    )
    widget_timeline.save()
    return widget_timeline


def factory_timeline_event_model(
    timeline_event: dict = TestTimelineInfo.timeline_event,
):
    """Produce a widget timeline model."""
    timeline_event = TimelineEventModel(
        widget_id=timeline_event.get('widget_id'),
        engagement_id=timeline_event.get('engagement_id'),
        timeline_id=timeline_event.get('timeline_id'),
        status=timeline_event.get('status'),
        position=timeline_event.get('position'),
        description=timeline_event.get('description'),
        time=timeline_event.get('time'),
    )
    timeline_event.save()
    return timeline_event


def factory_widget_map_model(widget_map: dict = TestWidgetMap.map1):
    """Produce a widget map model."""
    widget_map = WidgetMapModel(
        widget_id=widget_map.get('widget_id'),
        engagement_id=widget_map.get('engagement_id'),
        longitude=widget_map.get('longitude'),
        latitude=widget_map.get('latitude'),
        marker_label=widget_map.get('marker_label'),
    )
    widget_map.save()
    return widget_map


def factory_language_model(lang_info: dict = TestLanguageInfo.language1):
    """Produce a Language model."""
    language_model = LanguageModel(
        name=lang_info.get('name'),
        code=lang_info.get('code'),
        right_to_left=lang_info.get('right_to_left'),
    )
    language_model.save()
    return language_model


def factory_widget_translation_model(
    widget_translation: dict = TestWidgetTranslationInfo.widgettranslation1,
):
    """Produce a widget translation model."""
    widget_translation = WidgetTranslationModel(
        widget_id=widget_translation.get('widget_id'),
        language_id=widget_translation.get('language_id'),
        title=widget_translation.get('title'),
        map_marker_label=widget_translation.get('map_marker_label'),
    )
    widget_translation.save()
    return widget_translation


def factory_survey_translation_model(
    translate_info: dict = TestSurveyTranslationInfo.survey_translation1,
):
    """Produce a translation  model."""
    translation = SurveyTranslationModel(
        survey_id=translate_info.get('survey_id'),
        language_id=translate_info.get('language_id'),
        name=translate_info.get('name'),
        form_json=translate_info.get('form_json'),
    )
    translation.save()
    return translation


def factory_survey_translation_and_engagement_model():
    """Produce a translation model along with survey and language."""
    survey, eng = factory_survey_and_eng_model()
    lang = factory_language_model()

    translation = SurveyTranslationModel(
        survey_id=survey.id,
        language_id=lang.id,
        name=TestSurveyTranslationInfo.survey_translation1.get('name'),
        form_json=TestSurveyTranslationInfo.survey_translation1.get('form_json'),
    )
    translation.save()
    return translation, survey, lang


def factory_poll_answer_translation_model(
    translate_info: dict = TestPollAnswerTranslationInfo.translation1,
):
    """Produce a translation  model."""
    translation = PollAnswerTranslationModel(
        poll_answer_id=translate_info.get('poll_answer_id'),
        language_id=translate_info.get('language_id'),
        answer_text=translate_info.get('answer_text'),
    )
    translation.save()
    return translation


def poll_answer_model_with_poll_enagement():
    """Produce a poll answer model along with related engagement and poll models."""
    engagement = factory_engagement_model()
    widget_model = factory_widget_model({'engagement_id': engagement.id})
    poll_model = factory_poll_model(widget_model)
    answer = factory_poll_answer_model(poll_model)
    language = factory_language_model({'code': 'en', 'name': 'English'})
    return answer, poll_model, language


def factory_widget_subscribe_model(widget_model=None):
    """Produce a SubscribeItemTranslation model instance."""
    engagement = factory_engagement_model()

    TestWidgetInfo.widget1['engagement_id'] = engagement.id
    if widget_model is None:
        widget_model = factory_widget_model(TestWidgetInfo.widget1)

    subscribe_info = {
        **TestSubscribeInfo.subscribe_info_1.value,
    }

    widget_subcribe_model = WidgetSubscribeModel(
        widget_id=widget_model.id,
        type=subscribe_info.get('type'),
        sort_index=subscribe_info.get('sort_index'),
    )

    widget_subcribe_model.save()
    return widget_subcribe_model


def factory_subscribe_item_model(widget_subscribe=None, subscribe_item_info: dict = None):
    """Produce a SubscribeItem model instance."""
    if subscribe_item_info is None:
        subscribe_item_info = TestSubscribeInfo.subscribe_info_1.value['items'][0]

    if widget_subscribe is None:
        widget_subscribe = factory_widget_subscribe_model()

    subscribe_item = SubscribeItemModel(
        description=subscribe_item_info.get('description', ''),
        rich_description=subscribe_item_info.get('rich_description', ''),
        call_to_action_text=subscribe_item_info.get('call_to_action_text', ''),
        call_to_action_type=subscribe_item_info.get('call_to_action_type', ''),
        sort_index=subscribe_item_info.get('sort_index', 1),
        widget_subscribe_id=widget_subscribe.id,
    )
    subscribe_item.save()
    return subscribe_item


def factory_subscribe_item_translation_model(
    translate_info: dict = TestSubscribeItemTranslationInfo.translate_info1,
):
    """Produce a translation model for Subscribe items."""
    translation = SubscribeItemTranslationModel(
        subscribe_item_id=translate_info.get('subscribe_item_id'),
        language_id=translate_info.get('language_id'),
        description=translate_info.get('description'),
    )
    translation.save()
    return translation


def factory_subscribe_item_model_with_enagement():
    """Produce a SubscribeItem model instance with engagement."""
    engagement = factory_engagement_model()
    widget_model = factory_widget_model({'engagement_id': engagement.id})
    widget_subscribe = factory_widget_subscribe_model(widget_model)
    subscribe_item_model = factory_subscribe_item_model(widget_subscribe)
    language_model = factory_language_model({'code': 'en', 'name': 'English'})
    return subscribe_item_model, language_model


def factory_widget_event_model(widget_model=None):
    """Produce a Widget Event model instance."""
    engagement = factory_engagement_model()

    TestWidgetInfo.widget1['engagement_id'] = engagement.id
    if widget_model is None:
        widget_model = factory_widget_model(TestWidgetInfo.widget1)

    event_info = {
        **TestEventnfo.event_meetup.value,
    }

    widget_event_model = WidgetEventsModel(
        widget_id=widget_model.id,
        type=event_info.get('type'),
        sort_index=event_info.get('sort_index'),
        title=event_info.get('title'),
    )

    widget_event_model.save()
    return widget_event_model


def factory_event_item_model(widget_event=None, event_item_info: dict = None):
    """Produce a EventItem model instance."""
    if event_item_info is None:
        event_item_info = TestEventnfo.event_meetup.value['items'][0]

    if widget_event is None:
        widget_event = factory_widget_event_model()

    event_item = EventItemModel(
        description=event_item_info.get('description', ''),
        location_name=event_item_info.get('location_name', ''),
        location_address=event_item_info.get('location_address', ''),
        start_date=event_item_info.get('start_date', ''),
        end_date=event_item_info.get('end_date', ''),
        url=event_item_info.get('url', ''),
        url_label=event_item_info.get('url_label', ''),
        sort_index=event_item_info.get('sort_index', 1),
        widget_events_id=widget_event.id,
    )
    event_item.save()
    return event_item


def event_item_model_with_language():
    """Produce an event item model instance with language."""
    engagement = factory_engagement_model()
    widget_model = factory_widget_model({'engagement_id': engagement.id})
    widget_event = factory_widget_event_model(widget_model)
    event_item_model = factory_event_item_model(widget_event)
    language_model = factory_language_model({'code': 'en', 'name': 'English'})
    return event_item_model, widget_event, language_model


def factory_event_item_translation_model(
    event_translation_info: dict = TestEventItemTranslationInfo.event_item_info1,
):
    """Produce a translation model for Event items."""
    event_translation = EventItemTranslationModel(
        event_item_id=event_translation_info.get('event_item_id'),
        language_id=event_translation_info.get('language_id'),
        description=event_translation_info.get('description'),
        location_name=event_translation_info.get('location_name'),
        location_address=event_translation_info.get('location_address'),
        url=event_translation_info.get('url'),
        url_label=event_translation_info.get('url_label'),
    )
    event_translation.save()
    return event_translation


def timeline_event_model_with_language():
    """Produce a timeline event model instance with language."""
    engagement = factory_engagement_model()
    widget_model = factory_widget_model({'engagement_id': engagement.id})
    widget_timeline = factory_widget_timeline_model(
        {
            **TestTimelineInfo.widget_timeline.value,
            'widget_id': widget_model.id,
            'engagement_id': engagement.id,
        }
    )
    timeline_event = factory_timeline_event_model(
        {
            **TestTimelineInfo.timeline_event.value,
            'timeline_id': widget_timeline.id,
            'widget_id': widget_model.id,
            'engagement_id': engagement.id,
        }
    )
    language_model = factory_language_model({'code': 'en', 'name': 'English'})
    return timeline_event, widget_timeline, language_model


def factory_timeline_event_translation_model(
    timeline_translation_info: dict = TestTimelineEventTranslationInfo.timeline_event_info1,
):
    """Produce a translation model for Timeline items."""
    timeline_translation = TimelineEventTranslationModel(
        timeline_event_id=timeline_translation_info.get('timeline_event_id'),
        language_id=timeline_translation_info.get('language_id'),
        time=timeline_translation_info.get('time'),
        description=timeline_translation_info.get('description'),
    )
    timeline_translation.save()
    return timeline_translation


def subscribe_item_model_with_language():
    """Produce a subscribe item model instance with language."""
    engagement = factory_engagement_model()
    widget_model = factory_widget_model({'engagement_id': engagement.id})
    widget_subscribe = factory_widget_subscribe_model(widget_model)
    subscribe_item_model = factory_subscribe_item_model(widget_subscribe)
    language_model = factory_language_model({'code': 'en', 'name': 'English'})
    return subscribe_item_model, widget_subscribe, language_model


def factory_engagement_translation_model(
    engagement_translation: dict = TestEngagementTranslationInfo.engagementtranslation1,
):
    """Produce a engagement translation model."""
    engagement_translation = EngagementTranslationModel(
        engagement_id=engagement_translation.get('engagement_id'),
        language_id=engagement_translation.get('language_id'),
        name=engagement_translation.get('name'),
        description=engagement_translation.get('description'),
        content=engagement_translation.get('content'),
        rich_content=engagement_translation.get('rich_content'),
    )
    engagement_translation.save()
    return engagement_translation


def factory_enagement_content_model(
    engagement_id: int = None, engagement_content: dict = TestEngagementContentInfo.content1
):
    """Produce a engagement content model instance."""
    if engagement_id is None:
        engagement_id = factory_engagement_model().id

    engagement_content = EngagementContentModel(
        title=engagement_content.get('title'),
        icon_name=engagement_content.get('icon_name'),
        content_type=engagement_content.get('content_type'),
        engagement_id=engagement_id,
        is_internal=engagement_content.get('is_internal', False),
    )
    engagement_content.save()
    return engagement_content


def engagement_content_model_with_language():
    """Produce a engagement content model instance with language."""
    content_model = factory_enagement_content_model()
    language_model = factory_language_model({'code': 'en', 'name': 'English'})
    return content_model, language_model


def factory_engagement_content_translation_model(
    engagement_content_translation: dict = TestEngagementContentTranslationInfo.translation_info1,
):
    """Produce a engagement content translation model."""
    engagement_content_translation = EngagementContentTranslationModel(
        engagement_content_id=engagement_content_translation.get('engagement_content_id'),
        language_id=engagement_content_translation.get('language_id'),
        content_title=engagement_content_translation.get('content_title'),
    )
    engagement_content_translation.save()
    return engagement_content_translation
