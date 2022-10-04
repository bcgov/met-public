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
"""API endpoints for managing an feedback resource."""

from http import HTTPStatus
from flask import request
from flask_cors import cross_origin
from flask_restx import Namespace, Resource

from met_api.auth import auth
from met_api.models.pagination_options import PaginationOptions
from met_api.schemas.feedback import FeedbackSchema
from met_api.schemas import utils as schema_utils
from met_api.services.feedback_service import FeedbackService
from met_api.utils.action_result import ActionResult
from met_api.utils.util import allowedorigins, cors_preflight

API = Namespace('feedbacks', description='Endpoints for Feedbacks Management')
"""Custom exception messages
"""


@cors_preflight('GET, POST, OPTIONS')
@API.route('/')
class Feedback(Resource):
    """Resource for managing feedbacks."""

    @staticmethod
    @cross_origin(origins=allowedorigins())
    @auth.require
    def get():
        """Fetch feedbacks page."""
        try:
            args = request.args
            search_text = args.get('search_text', '', str)
            pagination_options = PaginationOptions(
                page=args.get('page', None, int),
                size=args.get('size', None, int),
                sort_key=args.get('sort_key', 'name', str),
                sort_order=args.get('sort_order', 'asc', str),
            )
            feedback_records = FeedbackService().get_feedback_paginated(pagination_options, search_text)

            return ActionResult.success(result=feedback_records)
        except ValueError as err:
            return ActionResult.error(str(err))

    @staticmethod
    @cross_origin(origins=allowedorigins())
    def post():
        """Create a new feedback."""
        try:
            request_json = request.get_json()
            valid_format, errors = schema_utils.validate(request_json, 'feedback')
            if not valid_format:
                return {'message': schema_utils.serialize(errors)}, HTTPStatus.BAD_REQUEST
            result = FeedbackService().create_feedback(request_json)
            return ActionResult.success(result.get('id'), result)
        except KeyError:
            return ActionResult.error('feedback was not found')
        except ValueError as err:
            return ActionResult.error(str(err))
