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
    }


class TestEmailVerificationInfo(dict, Enum):
    """Test scenarios of email verification."""

    emailverification1 = {
        'created_date': (datetime.today() - timedelta(days=1)).strftime('%Y-%m-%d'),
        'updated_date': (datetime.today() - timedelta(days=1)).strftime('%Y-%m-%d'),
        'is_active': True,
        'runcycle_id': 1,
        'source_email_ver_id': 1,
        'user_id': 1,
        'engagement_id': 1,
        'survey_id': 1,
    }


class TestUserResponseDetailInfo(dict, Enum):
    """Test scenarios of user response detail verification."""

    userresponsedetail1 = {
        'created_date': '2023-02-04 22:03:19.584549',
        'updated_date': '2023-02-04 22:03:19.584549',
        'is_active': True,
        'runcycle_id': 1,
        'user_id': 1,
        'engagement_id': 1,
    }


class TestSurveyInfo(dict, Enum):
    """Test scenarios of survey verification."""

    survey1 = {
        'created_date': '2023-02-04 22:03:19.584549',
        'updated_date': '2023-02-04 22:03:19.584549',
        'is_active': True,
        'runcycle_id': 1,
        'source_survey_id': 1,
        'engagement_id': 1,
    }
