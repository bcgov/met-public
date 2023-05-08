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

from flask import jsonify, request
from flask_cors import cross_origin
from flask_restx import Namespace, Resource
from marshmallow import ValidationError

from met_api.auth import jwt as _jwt
from met_api.schemas import utils as schema_utils
from met_api.schemas.contact import ContactSchema
from met_api.services.contact_service import ContactService
from met_api.utils.token_info import TokenInfo
from met_api.utils.util import allowedorigins, cors_preflight


API = Namespace('contacts', description='Endpoints for Widget Management')
"""Custom exception messages
"""


@cors_preflight('GET, OPTIONS')
@API.route('/<contact_id>')
class Contact(Resource):
    """Resource for managing a contacts."""

    @staticmethod
    @cross_origin(origins=allowedorigins())
    def get(contact_id):
        """Fetch a contact by id."""
        try:
            contact = ContactService().get_contact_by_id(contact_id)
            return contact, HTTPStatus.OK
        except (KeyError, ValueError) as err:
            return str(err), HTTPStatus.INTERNAL_SERVER_ERROR


@cors_preflight('GET, POST, OPTIONS, PATCH')
@API.route('/')
class Contacts(Resource):
    """Resource for managing contacts."""

    @staticmethod
    # @TRACER.trace()
    @cross_origin(origins=allowedorigins())
    @_jwt.requires_auth
    def post():
        """Create a new contact."""
        try:
            request_json = request.get_json()
            valid_format, errors = schema_utils.validate(request_json, 'contact')
            if not valid_format:
                return {'message': schema_utils.serialize(errors)}, HTTPStatus.BAD_REQUEST
            result = ContactService().create_contact(request_json)
            return ContactSchema().dump(result), HTTPStatus.OK
        except (KeyError, ValueError) as err:
            return str(err), HTTPStatus.INTERNAL_SERVER_ERROR
        except ValidationError as err:
            return str(err.messages), HTTPStatus.INTERNAL_SERVER_ERROR

    @staticmethod
    @cross_origin(origins=allowedorigins())
    def get():
        """Fetch list of contacts."""
        try:
            contacts = ContactService().get_contacts()
            return jsonify(contacts), HTTPStatus.OK
        except (KeyError, ValueError) as err:
            return str(err), HTTPStatus.INTERNAL_SERVER_ERROR

    @staticmethod
    # @TRACER.trace()
    @cross_origin(origins=allowedorigins())
    @_jwt.requires_auth
    def patch():
        """Update saved contact partially."""
        try:
            requestjson = request.get_json()
            user_id = TokenInfo.get_id()
            requestjson['updated_by'] = user_id

            contact_schema = ContactSchema()
            contact_schema.load(requestjson, partial=True)
            contact = ContactService().update_contact(requestjson)

            return contact_schema.dump(contact), HTTPStatus.OK
        except KeyError as err:
            return str(err), HTTPStatus.INTERNAL_SERVER_ERROR
        except ValueError as err:
            return str(err), HTTPStatus.INTERNAL_SERVER_ERROR
        except ValidationError as err:
            return str(err.messages), HTTPStatus.INTERNAL_SERVER_ERROR
