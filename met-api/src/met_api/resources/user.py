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

from flask_cors import cross_origin
from flask_restx import Namespace, Resource

from met_api.auth import auth
from met_api.schemas.user import UserSchema
from met_api.services.user_service import UserService
from met_api.utils.action_result import ActionResult
from met_api.utils.token_info import TokenInfo
from met_api.utils.util import allowedorigins, cors_preflight


API = Namespace('user', description='Endpoints for User Management')
"""Custom exception messages
"""


@cors_preflight('PUT')
@API.route('/')
class User(Resource):
    """User controller class."""

    @staticmethod
    # @TRACER.trace()
    @cross_origin(origins=allowedorigins())
    @auth.require
    def put():
        """Update or create a user."""
        try:
            user_data = TokenInfo.get_user_data()
            user_schema = UserSchema().load(user_data)
            result = UserService().create_or_update_user(user_schema)
            user_schema['id'] = result.identifier
            return ActionResult.success(result.identifier, user_schema)
        except KeyError as err:
            return ActionResult.error(str(err))
        except ValueError as err:
            return ActionResult.error(str(err))
