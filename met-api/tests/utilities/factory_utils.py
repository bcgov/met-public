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


from tests.utilities.factory_scenarios import (TestEngagemntInfo)
from met_api.models.engagement import Engagement
from met_api.config import get_named_config

CONFIG = get_named_config('testing')

JWT_HEADER = {
    'alg': CONFIG.JWT_OIDC_TEST_ALGORITHMS,
    'typ': 'JWT',
    'kid': CONFIG.JWT_OIDC_TEST_AUDIENCE
}

def factory_engagement_model(eng_info: dict = TestEngagemntInfo.engagement1):
    """Produce a engagement model."""
    engagement_model = Engagement(
        name=eng_info.get('name', None), description=eng_info.get('description', None)
    )

    engagement_model.save()
    return engagement_model

def factory_auth_header(jwt, claims):
    """Produce JWT tokens for use in tests."""
    return {'Authorization': 'Bearer ' + jwt.create_jwt(claims=claims, header=JWT_HEADER)}