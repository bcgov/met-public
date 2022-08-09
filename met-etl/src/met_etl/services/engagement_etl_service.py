# Copyright © 2019 Province of British Columbia
#
# Licensed under the Apache License, Version 2.0 (the 'License');
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an 'AS IS' BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
"""Service to do ETL on e."""
from typing import List

from flask import current_app
from met_api.models.engagement import Engagement as MetEngagementModel

from met_etl.models.db import db
from met_etl.models.engagement import Engagement as EtlEngagementModel


class EngagementEtlService:  # pylint: disable=too-few-public-methods
    """ETL Service on Engagement."""

    @staticmethod
    def do_etl_engagement(updated_engagements: List[MetEngagementModel]):
        """Perform the ETL for Engagement.

        1). Find engagements
                    which are updated in last x mins.
                    which are not Draft
        2). Check if it already exists in DB
        3). If Yes, Inactivate the existing one , Create new  one
        4). If No, create it
        """
        engagement: MetEngagementModel
        for engagement in updated_engagements:
            existing_eng: EtlEngagementModel
            current_app.logger.info('Processing updated Engagement: %s.', engagement.id)
            if existing_eng := EtlEngagementModel.find_by_id(engagement.id):
                # deactivate the existing one
                current_app.logger.info('Found existing engagement Engagement in Analytics DB: %s.', engagement.id)
                existing_eng.active_flag = 'M'
                db.session.add(existing_eng)
            eng = EngagementEtlService._build_engagement(engagement)
            db.session.add(eng)
            db.session.commit()

    @staticmethod
    def _build_engagement(engagement):
        """Helper to Build the engagement."""
        eng: EtlEngagementModel = EtlEngagementModel()
        eng.name = engagement.name
        eng.start_date = engagement.start_date
        eng.end_date = engagement.end_date
        eng.status_name = 'Published'  # TODO remove hardcoded
        eng.active_flag = 'T'
        eng.published_date = engagement.published_date
        return eng
