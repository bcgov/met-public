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

from flask import g
from flask_cors import cross_origin
from flask_restx import Namespace, Resource

from met_api.auth import auth
from met_api.schemas.user import UserSchema
from met_api.services.user_service import UserService
from met_api.utils.util import allowedorigins, cors_preflight


API = Namespace('user', description='Endpoints for User Management')
"""Custom exception messages
"""


@cors_preflight('PUT')
@API.route('/')
class UserController(Resource):
    """User controller class."""

    @staticmethod
    # @TRACER.trace()
    @cross_origin(origins=allowedorigins())
    @auth.require
    def put():
        """Update or create a user."""
        try:
            token_info = g.token_info
            user_data = {
                'external_id': token_info.get('sub', None),
                'first_name': token_info.get('given_name', None),
                'last_name': token_info.get('family_name', None),
                'email_id': token_info.get('email', None)
            }

            user_schema = UserSchema().load(user_data)
            result = UserService().create_or_update_user(user_schema)
            return {'status': result.success, 'message': result.message, 'id': result.identifier}, 200
        except KeyError as err:
            return {'status': False, 'message': str(err)}, 400
        except ValueError as err:
            return {'status': False, 'message': str(err)}, 400
