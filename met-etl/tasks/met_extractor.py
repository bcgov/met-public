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

from turtle import st
from met_etl.models.survey import Survey
from datetime import datetime,timedelta
from met_etl.models.db import db
from met_api.models.engagement import Engagement as METEngagementModel
from met_etl.models.engagement import Engagement as ETLEngagementModel
from flask import current_app

class MetExtractor:  # pylint:disable=too-few-public-methods
    """Task to link routing slips."""

    @classmethod
    def do_etl(cls):
        """Perform the ETL."""

        print ('Starting Met Extractor',db.engine.table_names())
        
        TIME_DELTA_IN_MINUTES = current_app.config.get('TIME_DELTA_IN_MINUTES')
        current_app.logger.info('Time Delta %s.', TIME_DELTA_IN_MINUTES)
        print(METEngagementModel.get_engagement('1'))
        print('--each engagement-----')
        for eng in METEngagementModel.get_all_engagements():
            print(eng)
        cls._do_etl_engagement(TIME_DELTA_IN_MINUTES)

        
    @staticmethod
    def _do_etl_engagement(inteval_in_minutes):
        """Perform the ETL for Engagement.
        
        1). Find engagements using updated_date> now()
        2). Check if it already exists in DB 
        3). If Yes, Inactivate the existing one , Create new  one
        4). If No, create it
        """
        
        time_delta = datetime.utcnow() - timedelta(minutes=inteval_in_minutes)
        engagements = db.session.query(METEngagementModel).filter(METEngagementModel.updated_date > time_delta).all()
        engagement: METEngagementModel
        for engagement in engagements:
            current_app.logger.info('New Engagement: %s.', engagement.id)
            eng: ETLEngagementModel = ETLEngagementModel()
            eng.id = engagement.id
            eng.name = engagement.name
            eng.start_date = engagement.start_date
            eng.end_date = engagement.end_date
            # TODO refine this logic
            eng.status_name = 'Published' if engagement.status_id == 1  else 'Draft'
            eng.published_date = engagement.published_date
            db.session.add(eng)


        
       
