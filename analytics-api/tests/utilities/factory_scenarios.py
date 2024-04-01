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

from analytics_api.config import get_named_config

fake = Faker()

CONFIG = get_named_config('testing')


class TestAvailableResponseOptionInfo(dict, Enum):
    """Test scenarios of available response option."""

    available_response_option1 = {
        'created_date': (datetime.today() - timedelta(days=1)).strftime('%Y-%m-%d'),
        'updated_date': (datetime.today() - timedelta(days=1)).strftime('%Y-%m-%d'),
        'is_active': True,
        'runcycle_id': 1,
        'participant_id': 1,
        'request_key': fake.word(),
        'value': fake.sentence(),
        'request_id': fake.word()
    }


class TestEmailVerificationInfo(dict, Enum):
    """Test scenarios of email verification."""

    emailverification1 = {
        'created_date': (datetime.today() - timedelta(days=1)).strftime('%Y-%m-%d'),
        'updated_date': (datetime.today() - timedelta(days=1)).strftime('%Y-%m-%d'),
        'is_active': True,
        'runcycle_id': 1,
        'source_email_ver_id': 1,
        'participant_id': 1,
        'engagement_id': 1,
        'survey_id': 1,
    }


class TestEngagementInfo(dict, Enum):
    """Test scenarios of engagement."""

    engagement1 = {
        'created_date': (datetime.today() - timedelta(days=1)).strftime('%Y-%m-%d'),
        'updated_date': (datetime.today() - timedelta(days=1)).strftime('%Y-%m-%d'),
        'is_active': True,
        'runcycle_id': 1,
        'source_engagement_id': 1,
        'name': fake.name(),
        'start_date': (datetime.today() - timedelta(days=1)).strftime('%Y-%m-%d'),
        'end_date': (datetime.today() + timedelta(days=1)).strftime('%Y-%m-%d'),
        'published_date': (datetime.today() + timedelta(days=1)).strftime('%Y-%m-%d'),
        'latitude': 50.44738861202791,
        'longitude': -120.5725377787922,
        'geojson': '',
        'marker_label': 'Project Location',
        'status_name': 'Published',
    }


class TestRequestTypeOptionInfo(dict, Enum):
    """Test scenarios of request type option."""

    request_type_option1 = {
        'created_date': (datetime.today() - timedelta(days=1)).strftime('%Y-%m-%d'),
        'updated_date': (datetime.today() - timedelta(days=1)).strftime('%Y-%m-%d'),
        'is_active': True,
        'runcycle_id': 1,
        'key': fake.word(),
        'type': fake.word(),
        'label': fake.sentence(),
        'request_id': fake.word(),
        'position': 1,
        'display': True
    }

    request_type_option2 = {
        'created_date': (datetime.today() - timedelta(days=1)).strftime('%Y-%m-%d'),
        'updated_date': (datetime.today() - timedelta(days=1)).strftime('%Y-%m-%d'),
        'is_active': True,
        'runcycle_id': 1,
        'key': fake.word(),
        'type': fake.word(),
        'label': fake.sentence(),
        'request_id': fake.word(),
        'position': 1,
        'display': True
    }

    request_type_option3 = {
        'created_date': (datetime.today() - timedelta(days=1)).strftime('%Y-%m-%d'),
        'updated_date': (datetime.today() - timedelta(days=1)).strftime('%Y-%m-%d'),
        'is_active': True,
        'runcycle_id': 1,
        'key': fake.word(),
        'type': fake.word(),
        'label': fake.sentence(),
        'request_id': fake.word(),
        'position': 1,
        'display': False
    }


class TestResponseTypeOptionInfo(dict, Enum):
    """Test scenarios of response type option."""

    response_type_option1 = {
        'created_date': (datetime.today() - timedelta(days=1)).strftime('%Y-%m-%d'),
        'updated_date': (datetime.today() - timedelta(days=1)).strftime('%Y-%m-%d'),
        'is_active': True,
        'runcycle_id': 1,
        'participant_id': 1,
        'request_key': fake.word(),
        'value': fake.sentence(),
        'request_id': fake.word()
    }

    response_type_option2 = {
        'created_date': (datetime.today() - timedelta(days=1)).strftime('%Y-%m-%d'),
        'updated_date': (datetime.today() - timedelta(days=1)).strftime('%Y-%m-%d'),
        'is_active': True,
        'runcycle_id': 1,
        'participant_id': 2,
        'request_key': fake.word(),
        'value': fake.sentence(),
        'request_id': fake.word()
    }


class TestSurveyInfo(dict, Enum):
    """Test scenarios of survey."""

    survey1 = {
        'created_date': (datetime.today() - timedelta(days=1)).strftime('%Y-%m-%d'),
        'updated_date': (datetime.today() - timedelta(days=1)).strftime('%Y-%m-%d'),
        'is_active': True,
        'runcycle_id': 1,
        'source_survey_id': 1,
        'name': fake.name(),
        'generate_dashboard': True
    }


class TestUserDetailsInfo(dict, Enum):
    """Test scenarios of user details."""

    user1 = {
        'created_date': (datetime.today() - timedelta(days=1)).strftime('%Y-%m-%d'),
        'updated_date': (datetime.today() - timedelta(days=1)).strftime('%Y-%m-%d'),
        'is_active': True,
        'runcycle_id': 1,
        'name': fake.name()
    }

    user2 = {
        'created_date': (datetime.today() - timedelta(days=1)).strftime('%Y-%m-%d'),
        'updated_date': (datetime.today() - timedelta(days=1)).strftime('%Y-%m-%d'),
        'is_active': False,
        'runcycle_id': 1,
        'name': fake.name()
    }


class TestUserFeedbackInfo(dict, Enum):
    """Test scenarios of user feedback."""

    feedback1 = {
        'created_date': (datetime.today() - timedelta(days=1)).strftime('%Y-%m-%d'),
        'updated_date': (datetime.today() - timedelta(days=1)).strftime('%Y-%m-%d'),
        'is_active': True,
        'runcycle_id': 1,
        'survey_id': 1,
        'user_id': 1,
        'comment': fake.paragraph(),
        'sentiment_analysis': 'Positive',
        'label': 'Positive Feedback',
        'source_comment_id': 12345
    }

    feedback2 = {
        'created_date': (datetime.today() - timedelta(days=1)).strftime('%Y-%m-%d'),
        'updated_date': (datetime.today() - timedelta(days=1)).strftime('%Y-%m-%d'),
        'is_active': False,
        'runcycle_id': 1,
        'survey_id': 2,
        'user_id': 2,
        'comment': fake.paragraph(),
        'sentiment_analysis': 'Negative',
        'label': 'Negative Feedback',
        'source_comment_id': 67890
    }


class TestUserResponseDetailInfo(dict, Enum):
    """Test scenarios of user response detail."""

    response1 = {
        'created_date': (datetime.today() - timedelta(days=1)).strftime('%Y-%m-%d'),
        'updated_date': (datetime.today() - timedelta(days=1)).strftime('%Y-%m-%d'),
        'is_active': True,
        'runcycle_id': 1,
        'survey_id': 1,
        'engagement_id': 1,
        'participant_id': 1
    }

    response2 = {
        'created_date': (datetime.today() - timedelta(days=1)).strftime('%Y-%m-%d'),
        'updated_date': (datetime.today() - timedelta(days=1)).strftime('%Y-%m-%d'),
        'is_active': False,
        'runcycle_id': 1,
        'survey_id': 2,
        'engagement_id': 2,
        'participant_id': 2
    }


class TestJwtClaims(dict, Enum):
    """Test scenarios of jwt claims."""
	
    staff_admin_role = {
    'sub': 'f7a4a1d3-73a8-4cbc-a40f-bb1145302064',
    'idp_userid': 'f7a4a1d3-73a8-4cbc-a40f-bb1145302064',
    'preferred_username': f'{fake.user_name()}@idir',
    'given_name': fake.first_name(),
    'family_name': fake.last_name(),
    'tenant_id': 1,
    'email': 'staff@gov.bc.ca',
    'identity_provider': 'idir',
    'client_roles': [
        'view_all_survey_results'
    ]
}
