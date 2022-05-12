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
from app.schemas.Engagement import EngagementSchema
from flask import g, request

API = Namespace('engagement', description='Endpoints for Engagements Management')
"""Custom exception messages
"""

# @cors_preflight('GET,OPTIONS')
@API.route('/<engagement_id>')
class GetEngagement(Resource):
    """Resource for managing a single engagement."""
       
    # @TRACER.trace()
    # @cross_origin(origins=allowedorigins())
    # @auth.require
    @staticmethod
    def get(engagement_id):
        """Fetches a single engagement matching the provided id."""
        try:
            engagement_record = engagement_service().get_engagement(engagement_id)    
            return engagement_record, 200
        except KeyError as err:
            return {'status': False, 'message': "Engagement was not found"}, 400
        except ValueError as err:
            return {'status': False, 'message': err.messages}, 400

# @cors_preflight('GET,OPTIONS')
@API.route('/')
class GetEngagements(Resource):
    """Resource for managing all engagements."""
       
    # @TRACER.trace()
    # @cross_origin(origins=allowedorigins())
    # @auth.require
    @staticmethod
    def get():
        """Fetches all engagements."""
        try:
            engagement_records = engagement_service().get_all_engagements()    
            return engagement_records, 200
        except ValueError as err:
            return {'status': False, 'message': err.messages}, 400      
             
    @staticmethod
    # @TRACER.trace()
    # @cross_origin(origins=allowedorigins())
    # @auth.require
    def post():      
        """Creates a new engagement."""
        try:
            requestjson = request.get_json() 
            engagment_schema = EngagementSchema().load(requestjson)  
            result = engagement_service().create_engagement(engagment_schema)
            return {'status': result.success, 'message': result.message,'id': result.identifier} , 200
        except KeyError as err:
            return {'status': False, 'message': err.messages}, 400