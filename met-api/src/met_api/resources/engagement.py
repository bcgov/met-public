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

from flask import request
from flask_cors import cross_origin
from flask_restx import Namespace, Resource

from met_api.auth import auth
from met_api.models.data_class import PaginationOptions
from met_api.schemas.engagement import EngagementSchema
from met_api.services.engagement_service import EngagementService
from met_api.utils.action_result import ActionResult
from met_api.utils.token_info import TokenInfo
from met_api.utils.util import allowedorigins, cors_preflight


API = Namespace('engagements', description='Endpoints for Engagements Management')
"""Custom exception messages
"""


@cors_preflight('GET,OPTIONS')
@API.route('/<engagement_id>')
class Engagement(Resource):
    """Resource for managing a single engagement."""

    @staticmethod
    @cross_origin(origins=allowedorigins())
    @auth.optional
    def get(engagement_id):
        """Fetch a single engagement matching the provided id."""
        try:
            user_id = TokenInfo.get_id()
            engagement_record = EngagementService().get_engagement(engagement_id, user_id)

            if engagement_record:
                return ActionResult.success(engagement_id, engagement_record)

            return ActionResult.error('Engagement was not found')
        except KeyError:
            return ActionResult.error('Engagement was not found')
        except ValueError as err:
            return ActionResult.error(str(err))


@cors_preflight('GET, POST, PUT, OPTIONS')
@API.route('/')
class Engagements(Resource):
    """Resource for managing engagements."""

    @staticmethod
    @cross_origin(origins=allowedorigins())
    @auth.optional
    def get():
        """Fetch engagements."""
        try:
            args = request.args
            user_id = TokenInfo.get_id()

            pagination_options = PaginationOptions(
                page=args.get('page', 1, int),
                size=args.get('size', 10, int),
                sort_key=args.get('sort_key', 'name', int),
                sort_order=args.get('sort_order', 'asc', str),
            )

            engagement_records = EngagementService()\
                .get_engagements_paginated(
                    user_id,
                    pagination_options,
                    args.get('search_text', '', str)
            )

            return ActionResult.success(result=engagement_records)
        except ValueError as err:
            return ActionResult.error(str(err))

    @staticmethod
    # @TRACER.trace()
    @cross_origin(origins=allowedorigins())
    @auth.require
    def post():
        """Create a new engagement."""
        try:
            user_id = TokenInfo.get_id()
            requestjson = request.get_json()
            engagment_schema = EngagementSchema().load(requestjson)
            engagment_schema['created_by'] = user_id
            engagment_schema['updated_by'] = user_id
            result = EngagementService().create_engagement(engagment_schema)
            engagment_schema['id'] = result.identifier
            return ActionResult.success(result.identifier, engagment_schema)
        except KeyError as err:
            return ActionResult.error(str(err))
        except ValueError as err:
            return ActionResult.error(str(err))

    @staticmethod
    # @TRACER.trace()
    @cross_origin(origins=allowedorigins())
    @auth.require
    def put():
        """Update saved engagement."""
        try:
            requestjson = request.get_json()
            engagment_schema = EngagementSchema().load(requestjson)
            user_id = TokenInfo.get_id()
            engagment_schema['updated_by'] = user_id
            result = EngagementService().update_engagement(engagment_schema)
            return ActionResult.success(result.identifier, engagment_schema)
        except KeyError as err:
            return ActionResult.error(str(err))
        except ValueError as err:
            return ActionResult.error(str(err))
