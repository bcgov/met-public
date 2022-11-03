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

from http import HTTPStatus
from flask import request
from flask_cors import cross_origin
from flask_restx import Namespace, Resource
from marshmallow import ValidationError

from met_api.auth import auth
from met_api.schemas.contact import ContactSchema
from met_api.schemas import utils as schema_utils
from met_api.services.contact_service import ContactService
from met_api.utils.action_result import ActionResult
from met_api.utils.token_info import TokenInfo
from met_api.utils.util import allowedorigins, cors_preflight


API = Namespace('contacts', description='Endpoints for Widget Management')
"""Custom exception messages
"""


@cors_preflight('GET, OPTIONS')
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
        except (KeyError, ValueError) as err:
            return ActionResult.error(str(err))


@cors_preflight('GET, POST, OPTIONS')
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
            request_json = request.get_json()

            valid_format, errors = schema_utils.validate(request_json, 'contact')
            if not valid_format:
                return {'message': schema_utils.serialize(errors)}, HTTPStatus.BAD_REQUEST

            contact_schema = ContactSchema().load(request_json)
            result = ContactService().create_contact(contact_schema, user_id)
            contact_schema['id'] = result.id
            return ActionResult.success(result.id, contact_schema)
        except (KeyError, ValueError) as err:
            return ActionResult.error(str(err))
        except ValidationError as err:
            return ActionResult.error(str(err.messages))

    @staticmethod
    @cross_origin(origins=allowedorigins())
    @auth.require
    def get():
        """Fetch list of contacts."""
        try:
            widgets = ContactService().get_contacts()
            return ActionResult.success(result=widgets)
        except (KeyError, ValueError) as err:
            return ActionResult.error(str(err))


@cors_preflight('PUT')
@API.route('/')
class Contact(Resource):
    """Contact controller class."""

    @staticmethod
    # @TRACER.trace()
    @cross_origin(origins=allowedorigins())
    @auth.require
    def put():
        """Update Contact."""
        try:
            contact_data = TokenInfo.get_contact_data()
            contact_schema = ContactSchema().load(user_data)
            contact = ContactService().create_or_update_contact(contact_schema)
            contact_schema['id'] = contact.id
            return ActionResult.success(contact.id, contact_schema)
        except KeyError as err:
            return ActionResult.error(str(err))
        except ValueError as err:
            return ActionResult.error(str(err))
