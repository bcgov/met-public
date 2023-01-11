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
from met_api.constants.engagement_status import SubmissionStatus
from met_api.constants.feedback import CommentType, FeedbackSourceType, RatingType
from met_api.constants.widget import WidgetType
from met_api.utils.enums import LoginSource, UserType


fake = Faker()

CONFIG = get_named_config('testing')


class TestUserInfo(dict, Enum):
    """Test scenarios of user."""

    user = {
        'id': 123,
        'first_name': 'System',
    }

    user_public_1 = {
        'first_name': fake.name(),
        'middle_name': fake.name(),
        'last_name': fake.name(),
        'email_id': fake.email(),
        'access_type': UserType.PUBLIC_USER.value
    }

    user_public_2 = {
        'first_name': fake.name(),
        'middle_name': fake.name(),
        'last_name': fake.name(),
        'email_id': fake.email(),
        'access_type': UserType.PUBLIC_USER.value
    }

    user_staff_1 = {
        'first_name': fake.name(),
        'middle_name': fake.name(),
        'last_name': fake.name(),
        'email_id': fake.email(),
        'access_type': UserType.STAFF.value
    }


class TestSurveyInfo(dict, Enum):
    """Test scenarios of Survey."""

    survey1 = {
        'name': fake.name(),
        'created_date': datetime.now().strftime('%Y-%m-%d'),
        'updated_date': datetime.now().strftime('%Y-%m-%d'),
        'created_by': '123',
        'updated_by': '123',
        'form_json': {'display': 'form', 'components': []}
    }
    survey2 = {
        'name': fake.name(),
        'form_json': {'display': 'form', 'components': []}
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


class TestEngagementInfo(dict, Enum):
    """Test scenarios of engagement."""

    engagement1 = {
        'name': fake.name(),
        'start_date': (datetime.today() - timedelta(days=1)).strftime('%Y-%m-%d'),
        'end_date': (datetime.today() + timedelta(days=1)).strftime('%Y-%m-%d'),
        'banner_url': '',
        'created_by': '123',
        'updated_by': '123',
        'status': SubmissionStatus.Open.value,
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


class TestFeedbackInfo(dict, Enum):
    """Test scenarios of feedback."""

    feedback1 = {
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
        'realm_access': {
            'roles': [
            ]
        }
    }

    public_user_role = {
        'iss': CONFIG.JWT_OIDC_TEST_ISSUER,
        'sub': 'f7a4a1d3-73a8-4cbc-a40f-bb1145302064',
        'given_name': fake.first_name(),
        'family_name': fake.last_name(),
        'preferred_username': fake.user_name(),
        'email': fake.email(),
        'realm_access': {
            'roles': [
                'public_user'
            ]
        }
    }

    staff_admin_role = {
        'iss': CONFIG.JWT_OIDC_TEST_ISSUER,
        'sub': 'f7a4a1d3-73a8-4cbc-a40f-bb1145302064',
        'idp_userid': 'f7a4a1d3-73a8-4cbc-a40f-bb1145302064',
        'preferred_username': f'{fake.user_name()}@idir',
        'given_name': fake.first_name(),
        'family_name': fake.last_name(),
        'email': 'staff@gov.bc.ca',
        'identity_provider': LoginSource.IDIR.value,
        'realm_access': {
            'roles': [
                'staff',
                'view_engagement',
                'create_engagement',
                'edit_engagement',
                'create_survey',
                'view_users'
                ''
            ]
        }
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
    }


class TestSubmissionInfo(dict, Enum):
    """Test scenarios of submission."""

    submission1 = {
        'submission_json': {'simpletextarea': fake.paragraph(nb_sentences=3)},
        'created_by': '123',
        'updated_by': '123',
        'created_date': datetime.now().strftime('%Y-%m-%d'),
        'updated_date': datetime.now().strftime('%Y-%m-%d'),
        'comment_status_id': 1,  # Pending
        'review_by': 'John Doe',
        'review_date': datetime.now().strftime('%Y-%m-%d'),
    }


class TestCommentInfo(dict, Enum):
    """Test scenarios of comment."""

    comment1 = {
        'text': fake.paragraph(nb_sentences=3),
        'component_id': 'simpletextarea',
        'submission_date': datetime.now().strftime('%Y-%m-%d'),
    }


class TestWidgetDocumentInfo(dict, Enum):
    """Test scenarios of contact."""

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
