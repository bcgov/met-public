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
from faker import Faker

from analytics_api import db
from analytics_api.config import get_named_config
from analytics_api.models.engagement import Engagement as EngagementModel
from analytics_api.models.email_verification import EmailVerification as EmailVerificationModel
from tests.utilities.factory_scenarios import TestEngagementInfo, TestEmailVerificationInfo

CONFIG = get_named_config('testing')
fake = Faker()


def factory_engagement_model(eng_info: dict = TestEngagementInfo.engagement1, status=None):
    """Produce a engagement model."""
    engagement = EngagementModel(
        created_date=eng_info.get('created_date'),
        updated_date=eng_info.get('updated_date'),
        is_active=eng_info.get('is_active'),
        runcycle_id=eng_info.get('runcycle_id'),
        source_engagement_id=eng_info.get('source_engagement_id'),
        name=eng_info.get('name'),
        start_date=eng_info.get('start_date'),
        end_date=eng_info.get('end_date'),
        published_date=eng_info.get('published_date'),
        latitude=eng_info.get('latitude'),
        longitude=eng_info.get('longitude'),
        geojson=eng_info.get('geojson'),
        marker_label=eng_info.get('marker_label')
    )
    db.session.add(engagement)
    db.session.commit()
    return engagement


def factory_email_verification_model(emailinfo: dict = TestEmailVerificationInfo.emailverification1, status=None):
    """Produce a email verification model."""
    emailverification = EmailVerificationModel(
        created_date=emailinfo.get('created_date'),
        updated_date=emailinfo.get('updated_date'),
        is_active=emailinfo.get('is_active'),
        runcycle_id=emailinfo.get('runcycle_id'),
        source_email_ver_id=emailinfo.get('source_email_ver_id'),
        user_id=emailinfo.get('user_id'),
        engagement_id=emailinfo.get('engagement_id'),
        survey_id=emailinfo.get('survey_id'),
    )
    db.session.add(emailverification)
    db.session.commit()
    return emailverification
