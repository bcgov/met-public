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
from datetime import datetime, timedelta

from faker import Faker
from freezegun import freeze_time

from met_api.constants.engagement_status import Status
from met_api.models import Survey as SurveyModel
from met_api.models import db
from tests.utilities.factory_scenarios import TestEngagementInfo
from tests.utilities.factory_utils import factory_engagement_model, factory_survey_model

fake = Faker()


def test_survey(session):
    """Assert that an survey can be created and fetched."""
    survey = factory_survey_model()
    assert survey.id is not None
    survey_new = SurveyModel.find_by_id(survey.id)
    assert survey.name == survey_new.name


def test_get_open_survey(session):
    """Assert that an survey can be created and fetched."""
    survey = factory_survey_model()
    assert survey.id is not None
    survey_new = SurveyModel.get_open(survey.id)
    assert survey_new is None
    eng = factory_engagement_model(status=Status.Published.value)
    survey.engagement_id = eng.id
    db.session.add(survey)
    db.session.commit()
    survey_new_1 = SurveyModel.get_open(survey.id)
    assert survey_new_1 is not None


def test_get_open_survey_time_based(session):
    """Assert that an open survey can be retrieved."""
    now = datetime.now()
    eng_info: dict = TestEngagementInfo.engagement1
    eng_info['start_date'] = now - timedelta(days=1, hours=1)
    eng_info['end_date'] = now  # ends today
    eng_info['status'] = Status.Published.value

    engagement = factory_engagement_model(eng_info)
    survey = factory_survey_model()
    survey.engagement_id = engagement.id

    # Commit the survey and engagement to the session
    db.session.add(engagement)
    db.session.add(survey)
    db.session.commit()

    # Call the get_open method and assert that the survey is retrieved.
    survey_new = SurveyModel.get_open(survey.id)
    assert survey_new is not None, 'survey fetchable on the day of closure'

    # Move time forward by 1 day
    day_after_time_delay = now + timedelta(days=1)
    with freeze_time(day_after_time_delay):
        survey_new = SurveyModel.get_open(survey.id)
        assert survey_new is None, 'survey is not fetchable after one day of closure.'

    # Move time backward by 1 day
    day_before_time_delay = now - timedelta(days=1)
    with freeze_time(day_before_time_delay):
        survey_new = SurveyModel.get_open(survey.id)
        assert survey_new is not None, 'survey fetchable since one day before closure.'
