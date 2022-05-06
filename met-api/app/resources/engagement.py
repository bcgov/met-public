# Copyright © 2021 Province of British Columbia
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
"""API endpoints for managing a FOI Requests resource."""


from flask_restx import Namespace, Resource
from app.services.engagement_service import engagement_service

API = Namespace('Engagement', description='Endpoints for Engagements Management')
"""Custom exception messages
"""

# @cors_preflight('GET,OPTIONS')
@API.route('/engagement/<engagement_id>')
class GetFOIExtension(Resource):
    """Resource for managing Engagements."""
       
    # @TRACER.trace()
    # @cross_origin(origins=allowedorigins())
    # @auth.require
    @staticmethod
    def get(engagement_id):
        try:
            engagement_record = engagement_service().get_engagement(engagement_id)    
            return engagement_record, 200
        except KeyError as err:
            return {'status': False, 'message':err.messages}, 400
        except ValueError as err:
            return {'status': False, 'message':err.messages}, 400