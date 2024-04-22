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
"""Tests for the Survey service.

Test suite to ensure that the Survey service routines are working as expected.
"""

from met_api.services.survey_service import SurveyService
from tests.utilities.factory_scenarios import TestJwtClaims, TestSurveyInfo
from tests.utilities.factory_utils import (
    factory_staff_user_model, factory_user_group_membership_model, patch_token_info, set_global_tenant)


def test_create_survey(session, monkeypatch,):  # pylint:disable=unused-argument
    """Assert that a survey can be created."""
    survey_data = {
        'name': TestSurveyInfo.survey1.get('name'),
        'display': TestSurveyInfo.survey1.get('form_json').get('display'),
    }
    patch_token_info(TestJwtClaims.staff_admin_role, monkeypatch)
    set_global_tenant()
    user = factory_staff_user_model(external_id=TestJwtClaims.staff_admin_role['sub'])
    factory_user_group_membership_model(str(user.external_id), user.tenant_id)
    saved_survey = SurveyService().create(survey_data)
    # fetch the survey with id and assert
    fetched_survey = SurveyService().get(saved_survey.id)
    assert fetched_survey.get('id') == saved_survey.id
    assert fetched_survey.get('name') == survey_data.get('name')
