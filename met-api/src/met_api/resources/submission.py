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
"""API endpoints for managing a submission resource."""

from http import HTTPStatus

from flask import request
from flask_cors import cross_origin
from flask_restx import Namespace, Resource

from met_api.auth import auth
from met_api.models.pagination_options import PaginationOptions
from met_api.schemas import utils as schema_utils
from met_api.schemas.submission import SubmissionSchema
from met_api.services.submission_service import SubmissionService
from met_api.utils.action_result import ActionResult
from met_api.utils.token_info import TokenInfo
from met_api.utils.util import allowedorigins, cors_preflight


API = Namespace('submissions', description='Endpoints for submission Management')
"""Custom exception messages
"""


@cors_preflight('GET,OPTIONS')
@API.route('/<submission_id>')
class Submission(Resource):
    """Resource for managing a submission."""

    @staticmethod
    # @TRACER.trace()
    @cross_origin(origins=allowedorigins())
    @auth.require
    def get(submission_id):
        """Fetch a single submission."""
        try:
            submission = SubmissionService().get(submission_id)
            return ActionResult.success(submission_id, submission)
        except KeyError:
            return ActionResult.error('Submission not found')
        except ValueError as err:
            return ActionResult.error(str(err))

    @staticmethod
    @cross_origin(origins=allowedorigins())
    @auth.require
    def put(submission_id):
        """Update comment status by submission id."""
        try:
            requestjson = request.get_json()
            status_id = requestjson.get('status_id', None)
            external_user_id = TokenInfo.get_id()
            submission = SubmissionService().review_comment(submission_id, status_id, external_user_id)
            return ActionResult.success(submission_id, submission)
        except KeyError:
            return ActionResult.error('Submission was not found')
        except ValueError as err:
            return ActionResult.error(str(err))


@cors_preflight('POST, OPTIONS')
@API.route('/')
class Submissions(Resource):
    """Resource for managing all submissions."""

    @staticmethod
    # @TRACER.trace()
    @cross_origin(origins=allowedorigins())
    def post():
        """Create a new submission."""
        try:
            request_json = request.get_json()
            valid_format, errors = schema_utils.validate(request_json, 'submission')
            if not valid_format:
                return {'message': schema_utils.serialize(errors)}, HTTPStatus.BAD_REQUEST

            schema = SubmissionSchema().load(request_json)
            result = SubmissionService().create(schema)
            schema['id'] = result.identifier
            return ActionResult.success(result.identifier, schema)
        except KeyError as err:
            return ActionResult.error(str(err))
        except ValueError as err:
            return ActionResult.error(str(err))


@cors_preflight('GET, OPTIONS')
@API.route('/survey/<survey_id>')
class SurveySubmissions(Resource):
    """Resource for managing multiple submissions."""

    @staticmethod
    @cross_origin(origins=allowedorigins())
    @auth.require
    def get(survey_id):
        """Get submissions page."""
        try:
            args = request.args

            pagination_options = PaginationOptions(
                page=args.get('page', None, int),
                size=args.get('size', None, int),
                sort_key=args.get('sort_key', 'name', str),
                sort_order=args.get('sort_order', 'asc', str),
            )
            submission_page = SubmissionService()\
                .get_paginated(
                    survey_id,
                    pagination_options,
                    args.get('search_text', '', str),
            )
            return ActionResult.success(result=submission_page)
        except ValueError as err:
            return ActionResult.error(str(err))
