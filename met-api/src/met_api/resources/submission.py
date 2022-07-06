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

from flask import request
from flask_cors import cross_origin
from flask_restx import Namespace, Resource

from met_api.auth import auth
from met_api.schemas.submission import SubmissionSchema
from met_api.services.submission_service import SubmissionService
from met_api.utils.action_result import ActionResult
from met_api.utils.token_info import TokenInfo
from met_api.utils.util import allowedorigins, cors_preflight


API = Namespace('submission', description='Endpoints for submission Management')
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


@cors_preflight('GET, POST, PUT, OPTIONS')
@API.route('/')
class Submissions(Resource):
    """Resource for managing all submissions."""

    @staticmethod
    # @TRACER.trace()
    @cross_origin(origins=allowedorigins())
    def post():
        """Create a new submission."""
        try:
            user_id = TokenInfo.get_id()
            requestjson = request.get_json()
            schema = SubmissionSchema().load(requestjson)
            schema['created_by'] = user_id
            schema['updated_by'] = user_id
            result = SubmissionService().create(schema)
            schema['id'] = result.identifier
            return ActionResult.success(result.identifier, schema)
        except KeyError as err:
            return ActionResult.error(str(err))
        except ValueError as err:
            return ActionResult.error(str(err))

    @staticmethod
    # @TRACER.trace()
    @cross_origin(origins=allowedorigins())
    @auth.require
    def put():
        """Update a existing submission."""
        try:
            requestjson = request.get_json()
            schema = SubmissionSchema().load(requestjson)
            user_id = TokenInfo.get_id()
            schema['updated_by'] = user_id
            result = SubmissionService().update(schema)
            return ActionResult.success(result.identifier, schema)
        except KeyError as err:
            return ActionResult.error(str(err))
        except ValueError as err:
            return ActionResult.error(str(err))
