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
import datetime

from faker import Faker

from met_api.config import get_named_config

fake = Faker()

CONFIG = get_named_config('testing')


class TestEngagemntInfo(dict, Enum):
    """Test scenarios of engagement."""

    engagement1 = {
        'name': 'My Test Engagement',
        'description': 'My Test Engagement Description',
        'start_date': datetime.datetime.now().strftime('%m/%d/%Y, %H:%M:%S'),
        'end_date': datetime.datetime.now().strftime('%m/%d/%Y, %H:%M:%S'),
        'rich_description': 'Rich Description Sample',
        'content': 'Content Sample',
        'rich_content': 'Rich Content Sample',
        'banner_image_link': 'Rich Content Sample'
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
