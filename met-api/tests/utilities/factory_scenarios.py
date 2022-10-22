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

from enum import Enum
from datetime import datetime, timedelta

from faker import Faker

from met_api.config import get_named_config
from met_api.constants.engagement_status import SubmissionStatus
from met_api.constants.feedback import CommentType, FeedbackSourceType, RatingType
from met_api.constants.widget import WidgetType

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
    }

    user_public_2 = {
        'first_name': fake.name(),
        'middle_name': fake.name(),
        'last_name': fake.name(),
        'email_id': fake.email(),
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


class TestWidgetInfo(dict, Enum):
    """Test scenarios of widget."""

    widget1 = {
        'widget_type_id':  WidgetType.WHO_IS_LISTENING,
        'engagement_id':  1,
        'created_by': '123',
        'updated_by': '123',
        'created_date': datetime.now().strftime('%Y-%m-%d'),
        'updated_date': datetime.now().strftime('%Y-%m-%d'),
    }


class TestWidgetItemInfo(dict, Enum):
    """Test scenarios of widget."""

    widget_item1 = {
        'widget_data_id':  1,
        'widget_id':  1,
        'created_by': '123',
        'updated_by': '123',
        'created_date': datetime.now().strftime('%Y-%m-%d'),
        'updated_date': datetime.now().strftime('%Y-%m-%d'),
    }
