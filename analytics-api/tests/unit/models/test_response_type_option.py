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
"""Tests for the Response Type Option model.

Test suite to ensure that the Response Type Option model routines are working as expected.
"""

from analytics_api.models.response_type_option import ResponseTypeOption as ResponseTypeOptionModel
from tests.utilities.factory_utils import (
    factory_available_response_option_model, factory_engagement_model, factory_response_type_option_model,
    factory_survey_model)


def test_response_type_option_data(session):
    """Assert that a response type option data can be created and fetched."""
    eng = factory_engagement_model()
    survey = factory_survey_model(eng)
    available_response_option = factory_available_response_option_model(survey)
    response_type_option = factory_response_type_option_model(survey, available_response_option.request_key,
                                                              available_response_option.value)
    assert response_type_option.id is not None

    # Assuming that the primary key for ResponseTypeOptionModel is a tuple
    # containing the ID and the request key
    primary_key = (response_type_option.id, available_response_option.request_key)
    retrieved_options = ResponseTypeOptionModel.find_by_id(primary_key)  # NOSONAR # for this table the primary key is a tuple
    assert available_response_option.request_key == retrieved_options.request_key
