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

"""Tests to verify the Report setting API end-point.

Test-Suite to ensure that the Report setting endpoint is working as expected.
"""
from met_api.utils.enums import ContentType
from tests.utilities.factory_scenarios import TestJwtClaims, TestReportSettingInfo, TestSurveyInfo
from tests.utilities.factory_utils import (
    factory_auth_header, factory_survey_and_eng_model, factory_survey_report_setting_model)


def test_get_report_setting(client, jwt, session):  # pylint:disable=unused-argument
    """Assert that report setting can be fetched."""
    headers = factory_auth_header(jwt=jwt, claims=TestJwtClaims.staff_admin_role)
    survey, _ = factory_survey_and_eng_model(TestSurveyInfo.survey3)

    report_setting_data = {
        **TestReportSettingInfo.report_setting_1,
        'survey_id': survey.id,
    }
    factory_survey_report_setting_model(report_setting_data)

    rv = client.get(
        f'/api/surveys/{survey.id}/reportsettings',
        headers=headers,
        content_type=ContentType.JSON.value
    )

    assert rv.status_code == 200
