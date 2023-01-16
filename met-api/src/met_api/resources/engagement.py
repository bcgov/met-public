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

from http import HTTPStatus

from flask import request
from flask_cors import cross_origin
from flask_restx import Namespace, Resource
from marshmallow import ValidationError

from met_api.auth import auth
from met_api.auth import jwt as _jwt
from met_api.models.pagination_options import PaginationOptions
from met_api.schemas.engagement import EngagementSchema
from met_api.services.engagement_service import EngagementService
from met_api.utils.roles import Role
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
                return engagement_record, HTTPStatus.OK

            return 'Engagement was not found', HTTPStatus.INTERNAL_SERVER_ERROR
        except KeyError:
            return 'Engagement was not found', HTTPStatus.INTERNAL_SERVER_ERROR
        except ValueError as err:
            return str(err), HTTPStatus.INTERNAL_SERVER_ERROR


@cors_preflight('GET, POST, PUT, PATCH, OPTIONS')
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
                page=args.get('page', None, int),
                size=args.get('size', None, int),
                sort_key=args.get('sort_key', 'name', str),
                sort_order=args.get('sort_order', 'asc', str),
            )

            engagement_records = EngagementService()\
                .get_engagements_paginated(
                    user_id,
                    pagination_options,
                    args.get('search_text', '', str)
            )

            return engagement_records, HTTPStatus.OK
        except ValueError as err:
            return str(err), HTTPStatus.INTERNAL_SERVER_ERROR

    @staticmethod
    @cross_origin(origins=allowedorigins())
    @_jwt.has_one_of_roles([Role.CREATE_ENGAGEMENT.value])
    @auth.require
    def post():
        """Create a new engagement."""
        try:
            requestjson = request.get_json()
            engagement_schema = EngagementSchema()
            engagement_model = EngagementService().create_engagement(requestjson)
            return engagement_schema.dump(engagement_model), HTTPStatus.OK
        except Exception as err:
            assert str(err) == 'ff'
            return str(err), HTTPStatus.INTERNAL_SERVER_ERROR            

    @staticmethod
    # @TRACER.trace()
    @cross_origin(origins=allowedorigins())
    @_jwt.has_one_of_roles([Role.EDIT_ENGAGEMENT.value])
    @auth.require
    def put():
        """Update saved engagement."""
        try:
            requestjson = request.get_json()
            engagment_schema = EngagementSchema().load(requestjson)
            user_id = TokenInfo.get_id()
            engagment_schema['updated_by'] = user_id
            EngagementService().update_engagement(engagment_schema)
            return engagment_schema, HTTPStatus.OK
        except KeyError as err:
            return str(err), HTTPStatus.INTERNAL_SERVER_ERROR
        except ValueError as err:
            return str(err), HTTPStatus.INTERNAL_SERVER_ERROR
        except ValidationError as err:
            return str(err.messages), HTTPStatus.INTERNAL_SERVER_ERROR

    @staticmethod
    # @TRACER.trace()
    @cross_origin(origins=allowedorigins())
    @_jwt.has_one_of_roles([Role.EDIT_ENGAGEMENT.value])
    @auth.require
    def patch():
        """Update saved engagement partially."""
        try:
            requestjson = request.get_json()
            user_id = TokenInfo.get_id()
            requestjson['updated_by'] = user_id

            engagement_schema = EngagementSchema()
            engagement_schema.load(requestjson, partial=True)
            engagement = EngagementService().edit_engagement(requestjson)

            return engagement_schema.dump(engagement), HTTPStatus.OK
        except KeyError as err:
            return str(err), HTTPStatus.INTERNAL_SERVER_ERROR
        except ValueError as err:
            return str(err), HTTPStatus.INTERNAL_SERVER_ERROR
        except ValidationError as err:
            return str(err.messages), HTTPStatus.INTERNAL_SERVER_ERROR
