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
"""Tests for the Survey model.

Test suite to ensure that the Survey model routines are working as expected.
"""

from analytics_api.models import Survey as SurveyModel
from tests.utilities.factory_utils import (
    factory_engagement_model, factory_survey_model)


def test_get_survey_data(session):
    """Assert that an survey can be created and fetched."""
    eng = factory_engagement_model()
    survey = factory_survey_model(eng)
    assert survey.id is not None
    survey_existing = SurveyModel.find_by_id(survey.id)
    assert survey.id == survey_existing.id


def test_create_engagement_by_source_id(session):
    """Test creating an survey by source identifier."""
    eng = factory_engagement_model()
    survey = factory_survey_model(eng)
    assert survey.id is not None

    # Check if the survey can be retrieved by source identifier
    survey_by_source_id = SurveyModel.find_by_source_id(survey.source_survey_id)
    assert len(survey_by_source_id) == 1
    assert survey_by_source_id[0].source_survey_id == survey.source_survey_id


def test_deactivate_survey_by_source_id(session):
    """Test deactivating an survey by source identifier."""
    eng = factory_engagement_model()
    survey = factory_survey_model(eng)
    assert survey.id is not None

    # Deactivate the survey by source identifier
    num_deactivated = SurveyModel.deactivate_by_source_id(survey.source_survey_id)
    assert num_deactivated == 1

    # Check if the deactivated survey is not active anymore
    eng_by_source_id = SurveyModel.find_by_source_id(survey.source_survey_id)
    assert len(eng_by_source_id) == 1
    assert not eng_by_source_id[0].is_active
