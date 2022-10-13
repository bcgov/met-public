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
"""API endpoints for managing an user resource."""

from flask import request
from flask_cors import cross_origin
from flask_restx import Namespace, Resource
from marshmallow import ValidationError

from met_api.auth import auth
from met_api.schemas.contact import ContactSchema
from met_api.services.contact_service import ContactService
from met_api.utils.action_result import ActionResult
from met_api.utils.token_info import TokenInfo
from met_api.utils.util import allowedorigins, cors_preflight


API = Namespace('contacts', description='Endpoints for Widget Management')
"""Custom exception messages
"""


@cors_preflight('GET,OPTIONS')
@API.route('/<contact_id>')
class SurveySubmission(Resource):
    """Resource for managing a contacts."""

    @staticmethod
    @cross_origin(origins=allowedorigins())
    @auth.require
    def get(contact_id):
        """Fetch a contact by id."""
        try:
            contact = ContactService().get_contact_by_id(contact_id)
            return ActionResult.success(contact_id, contact)
        except KeyError:
            return ActionResult.error('No submissions not found')
        except ValueError as err:
            return ActionResult.error(str(err))


@cors_preflight('POST')
@API.route('/')
class Surveys(Resource):
    """Resource for managing contacts."""

    @staticmethod
    # @TRACER.trace()
    @cross_origin(origins=allowedorigins())
    @auth.require
    def post():
        """Create a new contact."""
        try:
            user_id = TokenInfo.get_id()
            requestjson = request.get_json()
            contact_schema = ContactSchema().load(requestjson)
            contact_schema['created_by'] = user_id
            contact_schema['updated_by'] = user_id
            result = ContactService().create_contact(contact_schema)
            contact_schema['id'] = result.identifier
            return ActionResult.success(result.identifier, contact_schema)
        except KeyError as err:
            return ActionResult.error(str(err))
        except ValueError as err:
            return ActionResult.error(str(err))
        except ValidationError as err:
            return ActionResult.error(str(err.messages))
