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
"""API endpoints for managing an engagement resource."""

import json

from flask import request
from flask_cors import cross_origin
from flask_restx import Namespace, Resource

from met_api.auth import auth
from met_api.schemas.Engagement import EngagementSchema
from met_api.services.engagement_service import EngagementService
from met_api.utils.util import allowedorigins, cors_preflight


API = Namespace('engagement', description='Endpoints for Engagements Management')
"""Custom exception messages
"""


@cors_preflight('GET,OPTIONS')
@API.route('/<engagement_id>')
class GetEngagement(Resource):
    """Resource for managing a single engagement."""

    @staticmethod
    # @TRACER.trace()
    @cross_origin(origins=allowedorigins())
    @auth.require
    def get(engagement_id):
        """Fetch a single engagement matching the provided id."""
        try:
            engagement_record = EngagementService().get_engagement(engagement_id)
            return engagement_record, 200
        except KeyError:
            return {'status': False, 'message': 'Engagement was not found'}, 400
        except ValueError as err:
            return {'status': False, 'message': str(err)}, 400


@cors_preflight('GET, POST, PUT, OPTIONS')
@API.route('/')
class GetEngagements(Resource):
    """Resource for managing all engagements."""

    @staticmethod
    # @TRACER.trace()
    @cross_origin(origins=allowedorigins())
    @auth.require
    def get():
        """Fetch all engagements."""
        try:
            engagement_records = EngagementService().get_all_engagements()
            return json.dumps(engagement_records), 200
        except ValueError as err:
            return {'status': False, 'message': str(err)}, 400

    @staticmethod
    # @TRACER.trace()
    @cross_origin(origins=allowedorigins())
    @auth.require
    def post():
        """Create a new engagement."""
        try:
            requestjson = request.get_json()
            engagment_schema = EngagementSchema().load(requestjson)
            result = EngagementService().create_engagement(engagment_schema)
            return {'status': result.success, 'message': result.message, 'id': result.identifier}, 200
        except KeyError as err:
            return {'status': False, 'message': str(err)}, 400
        except ValueError as err:
            return {'status': False, 'message': str(err)}, 400

    @staticmethod
    # @TRACER.trace()
    @cross_origin(origins=allowedorigins())
    @auth.require
    def put():
        """Update saved engagement."""
        try:
            requestjson = request.get_json()
            engagment_schema = EngagementSchema().load(requestjson)
            result = EngagementService().update_engagement(engagment_schema)
            return {'status': result.success, 'message': result.message, 'id': result.identifier}, 200
        except KeyError as err:
            return {'status': False, 'message': str(err)}, 400
        except ValueError as err:
            return {'status': False, 'message': str(err)}, 400
