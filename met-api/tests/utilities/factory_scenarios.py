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

Test Utility for creating test scenarios.
"""

from datetime import datetime, timedelta
from enum import Enum

from faker import Faker

from met_api.config import get_named_config
from met_api.constants.comment_status import Status as CommentStatus
from met_api.constants.engagement_status import Status as EngagementStatus
from met_api.constants.engagement_status import SubmissionStatus
from met_api.constants.timeline_event_status import TimelineEventStatus
from met_api.constants.feedback import CommentType, FeedbackSourceType, FeedbackStatusType, RatingType
from met_api.constants.widget import WidgetType
from met_api.utils.enums import LoginSource, UserStatus


fake = Faker()

CONFIG = get_named_config('testing')


class TestUserInfo(dict, Enum):
    """Test scenarios of user."""

    user = {
        'id': 123,
        'first_name': 'System',
        'status_id': UserStatus.ACTIVE.value,
    }

    user_staff_1 = {
        'first_name': fake.name(),
        'middle_name': fake.name(),
        'last_name': fake.name(),
        'email_address': fake.email(),
        'status_id': UserStatus.ACTIVE.value,
        'tenant_id': '1'
    }

    user_staff_2 = {
        'first_name': fake.name(),
        'middle_name': fake.name(),
        'last_name': fake.name(),
        'email_address': fake.email(),
        'status_id': UserStatus.ACTIVE.value,
        'tenant_id': '2'
    }

    user_staff_3 = {
        'first_name': fake.name(),
        'middle_name': fake.name(),
        'last_name': fake.name(),
        'email_address': fake.email(),
        'status_id': UserStatus.ACTIVE.value,
        'tenant_id': '3'
    }


class TestParticipantInfo(dict, Enum):
    """Test scenarios of participant."""

    participant1 = {
        'email_address': fake.email(),
    }

    participant2 = {
        'email_address': fake.email(),
    }


class TestSurveyInfo(dict, Enum):
    """Test scenarios of Survey."""

    survey1 = {
        'name': fake.name(),
        'created_date': datetime.now().strftime('%Y-%m-%d'),
        'updated_date': datetime.now().strftime('%Y-%m-%d'),
        'created_by': '123',
        'updated_by': '123',
        'form_json': {'display': 'form', 'components': []},
        'is_hidden': False,
        'is_template': False
    }
    survey2 = {
        'name': fake.name(),
        'form_json': {'display': 'form', 'components': []}
    }
    survey3 = {
        'name': fake.name(),
        'created_date': datetime.now().strftime('%Y-%m-%d'),
        'updated_date': datetime.now().strftime('%Y-%m-%d'),
        'created_by': '123',
        'updated_by': '123',
        'form_json': {'display': 'form', 'components': [{'id': 'ex2zzg', 'key': 'simplecheckboxes',
                                                         'label': fake.name(), 'type': 'simplecheckboxes'}]},
        'is_hidden': False,
        'is_template': False
    }
    hidden_survey = {
        'name': fake.name(),
        'created_date': datetime.now().strftime('%Y-%m-%d'),
        'updated_date': datetime.now().strftime('%Y-%m-%d'),
        'created_by': '123',
        'updated_by': '123',
        'form_json': {'display': 'form', 'components': []},
        'is_hidden': True,
        'is_template': False
    }
    survey_template = {
        'name': fake.name(),
        'created_date': datetime.now().strftime('%Y-%m-%d'),
        'updated_date': datetime.now().strftime('%Y-%m-%d'),
        'created_by': '123',
        'updated_by': '123',
        'form_json': {'display': 'form', 'components': []},
        'is_hidden': False,
        'is_template': True
    }


class KeycloakScenario:
    """Keycloak scenario."""

    @staticmethod
    def create_user_request():
        """Return create user request.Sample request just to mock the data."""
        user_name = fake.simple_profile().get('username')
        create_user_request = {
            'username': user_name,
            'email': f'{user_name}@gov.bc.ca',
            'attributes': {},
            'enabled': True
        }

        return create_user_request


class TestTenantInfo(dict, Enum):
    """Test scenarios of tenants."""

    tenant1 = {
        'short_name': 'EAO',
        'name': fake.name(),
        'description': fake.text(max_nb_chars=300),
        'title': fake.text(max_nb_chars=20),
        'logo_url': None,
    }
    tenant2 = {
        'short_name': 'EMLI',
        'name': fake.name(),
        'description': fake.text(max_nb_chars=300),
        'title': fake.text(max_nb_chars=20),
        'logo_url': None,
    }


class TestEngagementInfo(dict, Enum):
    """Test scenarios of engagement."""

    engagement1 = {
        'name': fake.name(),
        'start_date': (datetime.today() - timedelta(days=1)).strftime('%Y-%m-%d'),
        'end_date': (datetime.today() + timedelta(days=1)).strftime('%Y-%m-%d'),
        'banner_url': '',
        'created_by': '123',
        'updated_by': '123',
        'status': EngagementStatus.Published.value,
        'is_internal': False,
        'description': 'My Test Engagement Description',
        'rich_description': '"{\"blocks\":[{\"key\":\"2ku94\",\"text\":\"Rich Description Sample\",\"type\":\"unstyled\",\
        \"depth\":0,\"inlineStyleRanges\":[],\"entityRanges\":[],\"data\":{}}],\"entityMap\":{}}"',
        'content': 'Content Sample',
        'rich_content': '"{\"blocks\":[{\"key\":\"fclgj\",\"text\":\"Rich Content Sample\",\"type\":\"unstyled\",\"depth\":0,\
        \"inlineStyleRanges\":[],\"entityRanges\":[],\"data\":{}}],\"entityMap\":{}}"'
    }

    engagement_draft = {
        'name': fake.name(),
        'start_date': (datetime.today() - timedelta(days=1)).strftime('%Y-%m-%d'),
        'end_date': (datetime.today() + timedelta(days=1)).strftime('%Y-%m-%d'),
        'banner_url': '',
        'created_by': '123',
        'updated_by': '123',
        'status': EngagementStatus.Draft.value,
        'is_internal': False,
        'description': 'My Test Engagement Description',
        'rich_description': '"{\"blocks\":[{\"key\":\"2ku94\",\"text\":\"Rich Description Sample\",\"type\":\"unstyled\",\
            \"depth\":0,\"inlineStyleRanges\":[],\"entityRanges\":[],\"data\":{}}],\"entityMap\":{}}"',
        'content': 'Content Sample',
        'rich_content': '"{\"blocks\":[{\"key\":\"fclgj\",\"text\":\"Rich Content Sample\",\"type\":\"unstyled\",\"depth\":0,\
            \"inlineStyleRanges\":[],\"entityRanges\":[],\"data\":{}}],\"entityMap\":{}}"'
    }

    engagement2 = {
        'name': fake.name(),
        'start_date': (datetime.today() - timedelta(days=1)).strftime('%Y-%m-%d'),
        'end_date': (datetime.today() + timedelta(days=1)).strftime('%Y-%m-%d'),
        'banner_url': '',
        'created_by': '123',
        'updated_by': '123',
        'status': SubmissionStatus.Open.value,
        'is_internal': False,
        'description': 'My Test Engagement Description',
        'rich_description': '"{\"blocks\":[{\"key\":\"2ku94\",\"text\":\"Rich Description Sample\",\"type\":\"unstyled\",\
            \"depth\":0,\"inlineStyleRanges\":[],\"entityRanges\":[],\"data\":{}}],\"entityMap\":{}}"',
        'content': 'Content Sample',
        'rich_content': '"{\"blocks\":[{\"key\":\"fclgj\",\"text\":\"Rich Content Sample\",\"type\":\"unstyled\",\"depth\":0,\
            \"inlineStyleRanges\":[],\"entityRanges\":[],\"data\":{}}],\"entityMap\":{}}"',
        'status_block': [{
            'survey_status': 'Upcoming',
            'block_text': '{\"blocks\":[{\"key\":\"fclgj\",\"text\":\"Rich Content Sample\",\"type\":\"unstyled\",\"depth\":0,\
            \"inlineStyleRanges\":[],\"entityRanges\":[],\"data\":{}}],\"entityMap\":{}}"'
        }
        ]
    }

    engagement3 = {
        'name': fake.name(),
        'start_date': (datetime.today() - timedelta(days=1)).strftime('%Y-%m-%d'),
        'end_date': (datetime.today() + timedelta(days=1)).strftime('%Y-%m-%d'),
        'banner_url': '',
        'tenant_id': 1,
        'created_by': '123',
        'updated_by': '123',
        'status': SubmissionStatus.Open.value,
        'is_internal': False,
        'description': 'My Test Engagement Description',
        'rich_description': '"{\"blocks\":[{\"key\":\"2ku94\",\"text\":\"Rich Description Sample\",\"type\":\"unstyled\",\
            \"depth\":0,\"inlineStyleRanges\":[],\"entityRanges\":[],\"data\":{}}],\"entityMap\":{}}"',
        'content': 'Content Sample',
        'rich_content': '"{\"blocks\":[{\"key\":\"fclgj\",\"text\":\"Rich Content Sample\",\"type\":\"unstyled\",\"depth\":0,\
            \"inlineStyleRanges\":[],\"entityRanges\":[],\"data\":{}}],\"entityMap\":{}}"'
    }


class TestEngagementMetadataInfo(dict, Enum):
    """Test data for engagement metadata."""

    metadata0 = {
        'engagement_id': None,
        'taxon_id': None,
        'value': fake.name()
    }
    metadata1 = {
        'engagement_id': 1,
        'taxon_id': 1,
        'value': fake.name()
    }
    metadata2 = {
        'engagement_id': 1,
        'taxon_id': 2,
        'value': fake.name()
    }
    metadata3 = {
        'engagement_id': 1,
        'taxon_id': 2,
        'value': fake.name()
    }
    metadata4 = {
        'engagement_id': 2,
        'taxon_id': 1,
        'value': fake.name()
    }


class TestEngagementMetadataTaxonInfo(dict, Enum):
    """Test data for engagement metadata taxa."""

    taxon1 = {
        'name': fake.name(),
        'description': fake.text(max_nb_chars=256),
        'data_type': 'string',
        'freeform': True,
        'one_per_engagement': False,
        'default_value': None,
        'position': 1
    }

    taxon2 = {
        'name': fake.name(),
        'description': fake.text(max_nb_chars=256),
        'tenant_id': 1,
        'data_type': 'url',
        'freeform': True,
        'one_per_engagement': False,
        'default_value': None,
        'position': 2
    }

    taxon3 = {
        'name': fake.name(),
        'description': fake.text(max_nb_chars=256),
        'tenant_id': 1,
        'data_type': 'string',
        'freeform': False,
        'one_per_engagement': True,
        'default_value': None,
        'position': 3
    }

    taxon4 = {
        'name': fake.name(),
        'description': fake.text(max_nb_chars=256),
        'tenant_id': 1,
        'data_type': 'string',
        'freeform': False,
        'one_per_engagement': False,
        'default_value': fake.name(),
        'position': 4
    }


class TestFeedbackInfo(dict, Enum):
    """Test scenarios of feedback."""

    feedback1 = {
        'status': FeedbackStatusType.Unreviewed,
        'comment': 'A feedback comment',
        'rating': RatingType.Satisfied,
        'comment_type': CommentType.Idea,
        'source': FeedbackSourceType.Public,
    }


class TestJwtClaims(dict, Enum):
    """Test scenarios of jwt claims."""

    no_role = {
        'iss': CONFIG.JWT_OIDC_TEST_ISSUER,
        'sub': 'f7a4a1d3-73a8-4cbc-a40f-bb1145302065',
        'firstname': fake.first_name(),
        'lastname': fake.last_name(),
        'preferred_username': fake.user_name(),
        'client_roles': [
        ]
    }

    public_user_role = {
        'iss': CONFIG.JWT_OIDC_TEST_ISSUER,
        'sub': 'f7a4a1d3-73a8-4cbc-a40f-bb1145302064',
        'given_name': fake.first_name(),
        'family_name': fake.last_name(),
        'preferred_username': fake.user_name(),
        'email': fake.email(),
        'tenant_id': 1,
        'client_roles': [
            'public_user'
        ]
    }

    met_admin_role = {
        'iss': CONFIG.JWT_OIDC_TEST_ISSUER,
        'sub': 'f7a4a1d3-73a8-4cbc-a40f-bb1145302064',
        'idp_userid': 'f7a4a1d3-73a8-4cbc-a40f-bb1145302064',
        'preferred_username': f'{fake.user_name()}@idir',
        'given_name': fake.first_name(),
        'family_name': fake.last_name(),
        'tenant_id': 1,
        'email': 'staff@gov.bc.ca',
        'identity_provider': LoginSource.IDIR.value,
        'client_roles': [
            'staff',
            'view_engagement',
            'create_survey',
            'view_users',
            'create_admin_user',
            'edit_members',
            'toggle_user_status',
            'export_to_csv',
            'update_user_group',
            'create_tenant'
        ]
    }

    staff_admin_role = {
        'iss': CONFIG.JWT_OIDC_TEST_ISSUER,
        'sub': 'f7a4a1d3-73a8-4cbc-a40f-bb1145302064',
        'idp_userid': 'f7a4a1d3-73a8-4cbc-a40f-bb1145302064',
        'preferred_username': f'{fake.user_name()}@idir',
        'given_name': fake.first_name(),
        'family_name': fake.last_name(),
        'tenant_id': 1,
        'email': 'staff@gov.bc.ca',
        'identity_provider': LoginSource.IDIR.value,
        'client_roles': [
            'staff',
            'view_engagement',
            'create_engagement',
            'edit_engagement',
            'create_survey',
            'view_users',
            'view_private_engagements',
            'create_admin_user',
            'view_all_surveys',
            'view_surveys',
            'edit_all_surveys',
            'edit_survey',
            'view_unapproved_comments',
            'clone_survey',
            'edit_members',
            'review_comments',
            'review_all_comments',
            'view_all_engagements',
            'toggle_user_status',
            'export_all_to_csv',
            'update_user_group',
            'export_proponent_comment_sheet',
            'export_internal_comment_sheet',
            'export_cac_form_to_sheet',
            'view_members'
        ]
    }
    team_member_role = {
        'iss': CONFIG.JWT_OIDC_TEST_ISSUER,
        'sub': 'f7a4a1d3-73a8-4cbc-a40f-bb1145302064',
        'idp_userid': 'f7a4a1d3-73a8-4cbc-a40f-bb1145302064',
        'preferred_username': f'{fake.user_name()}@idir',
        'given_name': fake.first_name(),
        'family_name': fake.last_name(),
        'email': 'staff@gov.bc.ca',
        'identity_provider': LoginSource.IDIR.value,
        'tenant_id': 1,
        'client_roles': [
            'staff',
            'view_engagement',
            'view_users',
            'clone_survey',
            'export_proponent_comment_sheet'
        ]
    }

    reviewer_role = {
        'iss': CONFIG.JWT_OIDC_TEST_ISSUER,
        'sub': 'f7a4a1d3-73a8-4cbc-a40f-bb1145302064',
        'idp_userid': 'f7a4a1d3-73a8-4cbc-a40f-bb1145302064',
        'preferred_username': f'{fake.user_name()}@idir',
        'given_name': fake.first_name(),
        'family_name': fake.last_name(),
        'email': 'staff@gov.bc.ca',
        'identity_provider': LoginSource.IDIR.value,
        'tenant_id': 1,
        'client_roles': [
            'staff',
            'view_users',
        ]
    }


class TestWidgetInfo(dict, Enum):
    """Test scenarios of widget."""

    widget1 = {
        'widget_type_id': WidgetType.WHO_IS_LISTENING.value,
        'created_by': '123',
        'updated_by': '123',
        'created_date': datetime.now().strftime('%Y-%m-%d'),
        'updated_date': datetime.now().strftime('%Y-%m-%d'),
    }
    widget2 = {
        'widget_type_id': WidgetType.DOCUMENTS.value,
        'created_by': '123',
        'updated_by': '123',
        'created_date': datetime.now().strftime('%Y-%m-%d'),
        'updated_date': datetime.now().strftime('%Y-%m-%d'),
    }
    widget_events = {
        'widget_type_id': WidgetType.EVENTS.value,
        'created_by': '123',
        'updated_by': '123',
        'created_date': datetime.now().strftime('%Y-%m-%d'),
        'updated_date': datetime.now().strftime('%Y-%m-%d'),
    }
    widget_subscribe = {
        'widget_type_id': WidgetType.SUBSCRIBE.value,
        'created_by': '123',
        'updated_by': '123',
        'created_date': datetime.now().strftime('%Y-%m-%d'),
        'updated_date': datetime.now().strftime('%Y-%m-%d'),
    }
    widget_map = {
        'widget_type_id': WidgetType.Map.value,
        'created_by': '123',
        'updated_by': '123',
        'created_date': datetime.now().strftime('%Y-%m-%d'),
        'updated_date': datetime.now().strftime('%Y-%m-%d'),
    }
    widget_video = {
        'widget_type_id': WidgetType.Video.value,
        'created_by': '123',
        'updated_by': '123',
        'created_date': datetime.now().strftime('%Y-%m-%d'),
        'updated_date': datetime.now().strftime('%Y-%m-%d'),
    }
    widget_timeline = {
        'widget_type_id': WidgetType.Timeline.value,
        'created_by': '123',
        'updated_by': '123',
        'created_date': datetime.now().strftime('%Y-%m-%d'),
        'updated_date': datetime.now().strftime('%Y-%m-%d'),
    }


class TestWidgetItemInfo(dict, Enum):
    """Test scenarios of widget item."""

    widget_item1 = {
        'widget_data_id': 1,
        'created_by': '123',
        'updated_by': '123',
        'created_date': datetime.now().strftime('%Y-%m-%d'),
        'updated_date': datetime.now().strftime('%Y-%m-%d'),
    }

    widget_item2 = {
        'widget_data_id': 2,
        'created_by': '123',
        'updated_by': '123',
        'created_date': datetime.now().strftime('%Y-%m-%d'),
        'updated_date': datetime.now().strftime('%Y-%m-%d'),
    }


class TestContactInfo(dict, Enum):
    """Test scenarios of contact."""

    contact1 = {
        'name': fake.name(),
        'title': fake.job(),
        'phone_number': fake.phone_number(),
        'email': fake.email(),
        'address': fake.address(),
        'bio': fake.paragraph(nb_sentences=3),
        'created_by': '123',
        'updated_by': '123',
        'created_date': datetime.now().strftime('%Y-%m-%d'),
        'updated_date': datetime.now().strftime('%Y-%m-%d'),
        'tenant_id': 1
    }


class TestSubmissionInfo(dict, Enum):
    """Test scenarios of submission."""

    submission1 = {
        'submission_json': {'simpletextarea': fake.paragraph(nb_sentences=3)},
        'created_by': '123',
        'updated_by': '123',
        'created_date': datetime.now().strftime('%Y-%m-%d'),
        'updated_date': datetime.now().strftime('%Y-%m-%d'),
        'comment_status_id': CommentStatus.Pending.value,
        'review_by': 'John Doe',
        'review_date': datetime.now().strftime('%Y-%m-%d'),
    }

    approved_submission = {
        'submission_json': {'simpletextarea': fake.paragraph(nb_sentences=3)},
        'created_by': str(fake.pyint()),
        'updated_by': str(fake.pyint()),
        'created_date': datetime.now().strftime('%Y-%m-%d'),
        'updated_date': datetime.now().strftime('%Y-%m-%d'),
        'comment_status_id': CommentStatus.Approved.value,
        'review_by': fake.first_name(),
        'review_date': datetime.now().strftime('%Y-%m-%d'),
    }

    rejected_submission = {
        'submission_json': {'simpletextarea': fake.paragraph(nb_sentences=3)},
        'created_by': str(fake.pyint()),
        'updated_by': str(fake.pyint()),
        'created_date': datetime.now().strftime('%Y-%m-%d'),
        'updated_date': datetime.now().strftime('%Y-%m-%d'),
        'comment_status_id': CommentStatus.Rejected.value,
        'review_by': fake.first_name(),
        'review_date': datetime.now().strftime('%Y-%m-%d'),
    }

    pending_submission = {
        'submission_json': {'simpletextarea': fake.paragraph(nb_sentences=3)},
        'created_by': str(fake.pyint()),
        'updated_by': str(fake.pyint()),
        'created_date': datetime.now().strftime('%Y-%m-%d'),
        'updated_date': datetime.now().strftime('%Y-%m-%d'),
        'comment_status_id': CommentStatus.Pending.value,
        'review_by': fake.first_name(),
        'review_date': datetime.now().strftime('%Y-%m-%d'),
    }

    needs_further_review_submission = {
        'submission_json': {'simpletextarea': fake.paragraph(nb_sentences=3)},
        'created_by': str(fake.pyint()),
        'updated_by': str(fake.pyint()),
        'created_date': datetime.now().strftime('%Y-%m-%d'),
        'updated_date': datetime.now().strftime('%Y-%m-%d'),
        'comment_status_id': CommentStatus.Needs_further_review.value,
        'review_by': fake.first_name(),
        'review_date': datetime.now().strftime('%Y-%m-%d'),
    }


class TestCommentInfo(dict, Enum):
    """Test scenarios of comment."""

    comment1 = {
        'text': fake.paragraph(nb_sentences=3),
        'component_id': 'simpletextarea',
        'submission_date': datetime.now().strftime('%Y-%m-%d'),
    }


class TestEventnfo(dict, Enum):
    """Test scenarios of event."""

    event_meetup = {
        'title': fake.name(),
        'type': 'MEETUP',
        'items': [
            {
                'description': fake.name(),
                'venue': 'Online',
                'location_address': 'location_address',
                'location_name': 'Anywhere',
                'start_date': datetime.now().strftime('%Y-%m-%d'),
                'end_date': (datetime.now() + timedelta(weeks=+1)).strftime('%Y-%m-%d'),
                'url': fake.url(),
                'url_label': fake.name(),
            }
        ]
    }

    event_openhouse = {
        'title': fake.name(),
        'type': 'OPENHOUSE',
        'items': [
            {
                'description': fake.name(),
                'venue': 'Online',
                'location_address': 'location_address',
                'location_name': 'Anywhere',
                'start_date': datetime.now().strftime('%Y-%m-%d'),
                'end_date': (datetime.now() + timedelta(weeks=+1)).strftime('%Y-%m-%d'),
                'url': fake.url(),
                'url_label': fake.name(),
            }
        ]
    }

    event_virtual = {
        'title': fake.name(),
        'type': 'VIRTUAL',
        'items': [
            {
                'description': fake.name(),
                'venue': 'Online',
                'location_address': '',
                'location_name': '',
                'start_date': datetime.now().strftime('%Y-%m-%d'),
                'end_date': (datetime.now() + timedelta(weeks=+1)).strftime('%Y-%m-%d'),
                'url': fake.url(),
                'url_label': fake.name(),
            }
        ]
    }


class TestWidgetDocumentInfo(dict, Enum):
    """Test scenarios of document."""

    document1 = {
        'id': '4',
        'title': fake.word(),
        'type': 'folder',
        'parent_document_id': None,
        'url': None,
        'sort_index': 1,
    }

    document2 = {
        'id': '2',
        'title': fake.file_name(extension='pdf'),
        'type': 'file',
        'parent_document_id': None,
        'url': fake.image_url(),
        'sort_index': 1,
    }

    document3 = {
        'id': '3',
        'title': fake.file_name(extension='pdf'),
        'type': 'file',
        'parent_document_id': None,
        'url': fake.image_url(),
        'sort_index': 1,
    }


class TestEngagementSlugInfo(dict, Enum):
    """Test scenarios of feedback."""

    slug1 = {
        'engagement_id': 1,
        'slug': fake.text(max_nb_chars=20),
        'created_date': datetime.now().strftime('%Y-%m-%d'),
    }


class TestReportSettingInfo(dict, Enum):
    """Test scenarios of feedback."""

    report_setting_1 = {
        'created_by': str(fake.pyint()),
        'created_date': datetime.now().strftime('%Y-%m-%d'),
        'display': True,
        'id': 1,
        'question': 'What is your opinion about this?',
        'question_id': str(fake.pyint()),
        'question_key': 'simpletextarea',
        'question_type': 'simpletextarea',
        'survey_id': 1,
        'updated_by': str(fake.pyint()),
        'updated_date': datetime.now().strftime('%Y-%m-%d')
    }


class TestSubscribeInfo(Enum):
    """Test scenarios of subscribe."""

    subscribe_info_1 = {
        'widget_id': 1,
        'type': 'EMAIL_LIST',
        'items': [
            {
                'description': '{\"blocks\":[{\"key\":\"2ku94\",\"text\":\
                    "Rich Description Sample\",\"type\":\"unstyled\", \
                    "depth\":0,\"inlineStyleRanges\":[],\
                    "entityRanges\":[],\"data\":{}}],\"entityMap\":{}}',
                'call_to_action_type': 'link',
                'call_to_action_text': 'Click here to sign up',
                'form_type': 'EMAIL_LIST'
            }
        ]
    }

    subscribe_info_2 = {
        'widget_id': 1,
        'type': 'SIGN_UP',
        'items': [
            {
                'description': '{\"blocks\":[{\"key\":\"2ku94\",\"text\":\
                    "Rich Description Sample\",\"type\":\"unstyled\", \
                    "depth\":0,\"inlineStyleRanges\":[],\
                    "entityRanges\":[],\"data\":{}}],\"entityMap\":{}}',
                'call_to_action_type': 'link',
                'call_to_action_text': 'Click here to sign up',
                'form_type': 'SIGN_UP'
            }
        ]
    }


class TestCACForm(dict, Enum):
    """Test scenarios of cac form."""

    form_data = {
        'understand': True,
        'terms_of_reference': True,
        'first_name': fake.name(),
        'last_name': fake.name(),
        'city': 'City',
        'email': fake.email(),
    }


class TestWidgetMap(dict, Enum):
    """Test scenarios of video widget."""

    map1 = {
        'longitude': fake.longitude(),
        'latitude': fake.latitude(),
        'marker_label': fake.name()
    }

    map2 = {
        'longitude': fake.longitude(),
        'latitude': fake.latitude(),
        'marker_label': fake.name()
    }


class TestWidgetVideo(dict, Enum):
    """Test scenarios of video widget."""

    video1 = {
        'id': '1',
        'video_url': fake.url(),
        'description': fake.text(max_nb_chars=50),
    }


class TestTimelineInfo(dict, Enum):
    """Test scenarios of event."""

    widget_timeline = {
        'title': fake.name(),
        'description': fake.text(max_nb_chars=50),
    }

    timeline_event = {
        'timeline_id': '1',
        'description': fake.text(max_nb_chars=50),
        'time': datetime.now().strftime('%Y-%m-%d'),
        'position': 1,
        'status': TimelineEventStatus.Pending.value
    }


class TestWidgetPollInfo(dict, Enum):
    """Test scenarios of widget polls."""

    poll1 = {
        'title': fake.sentence(),
        'description': fake.text(),
        'status': 'active',
        'engagement_id': 1  # Placeholder, should be replaced with actual engagement ID in tests
    }

    poll2 = {
        'title': fake.sentence(),
        'description': fake.text(),
        'status': 'inactive',
        'engagement_id': 1  # Placeholder, should be replaced with actual engagement ID in tests
    }

    poll3 = {
        'title': fake.sentence(),
        'description': fake.text(),
        'status': 'active',
        'engagement_id': 2  # Placeholder, should be replaced with another engagement ID in tests
    }


class TestPollAnswerInfo(dict, Enum):
    """Test scenarios for poll answers."""

    answer1 = {
        'answer_text': 'Answer 1'
    }

    answer2 = {
        'answer_text': 'Answer 2'
    }

    answer3 = {
        'answer_text': 'Answer 3'
    }


class TestPollResponseInfo(dict, Enum):
    """Test scenarios for poll responses."""

    response1 = {
        'participant_id': fake.uuid4(),
        'selected_answer_id': 1,  # should be replaced with an actual answer ID in tests
        'poll_id': 1,            # should be replaced with an actual poll ID in tests
        'widget_id': 1,          # Placeholder, should be replaced with an actual widget ID in tests
    }

    response2 = {
        'participant_id': fake.uuid4(),
        'selected_answer_id': 2,  # should be replaced with an actual answer ID in tests
        'poll_id': 1,            # should be replaced with an actual poll ID in tests
        'widget_id': 1,          # should be replaced with an actual widget ID in tests
    }
