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
"""API endpoints for managing documents resource."""

from http import HTTPStatus

from flask import jsonify, request
from flask_cors import cross_origin
from flask_restx import Namespace, Resource

from met_api.auth import jwt as _jwt
from met_api.schemas.document import Document
from met_api.services.object_storage_service import ObjectStorageService
from met_api.utils.roles import Role
from met_api.utils.util import allowedorigins, cors_preflight


API = Namespace('document', description='Endpoints for Document Storage Management')
"""Custom exception messages"""


@cors_preflight('GET,OPTIONS')
@API.route('/')
class DocumentStorage(Resource):
    """Document storage resource controller."""

    @staticmethod
    @cross_origin(origins=allowedorigins())
    @_jwt.has_one_of_roles([Role.EDIT_ENGAGEMENT.value])
    def post():
        """Retrieve authentication properties for document storage."""
        try:
            requestfilejson = request.get_json()
            documents = Document().load(requestfilejson, many=True)
            return jsonify(ObjectStorageService().get_auth_headers(documents)), HTTPStatus.OK
        except KeyError as err:
            return str(err), HTTPStatus.INTERNAL_SERVER_ERROR
        except ValueError as err:
            return str(err), HTTPStatus.INTERNAL_SERVER_ERROR
