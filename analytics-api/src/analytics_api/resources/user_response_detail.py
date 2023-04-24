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
"""API endpoints for managing a user response detail resource."""

from http import HTTPStatus

from flask_cors import cross_origin
from flask_restx import Namespace, Resource

from analytics_api.auth import auth
from analytics_api.services.user_response_detail import UserResponseDetailService
from analytics_api.utils.util import allowedorigins, cors_preflight


API = Namespace('responses', description='Endpoints for User Response Management')
"""Custom exception messages
"""


@cors_preflight('GET,OPTIONS')
@API.route('/month/<engagement_id>')
class UserResponseDetailByMonth(Resource):
    """Resource for managing User Responses by month."""

    @staticmethod
    @cross_origin(origins=allowedorigins())
    @auth.optional
    def get(engagement_id):
        """Fetch a user responses matching the provided engagement id."""
        try:
            user_response_record = UserResponseDetailService().get_response_count_by_created_month(engagement_id)

            if user_response_record:
                return user_response_record, HTTPStatus.OK

            return 'User Response was not found', HTTPStatus.INTERNAL_SERVER_ERROR
        except KeyError:
            return 'User Response was not found', HTTPStatus.INTERNAL_SERVER_ERROR
        except ValueError as err:
            return str(err), HTTPStatus.INTERNAL_SERVER_ERROR


@cors_preflight('GET,OPTIONS')
@API.route('/week/<engagement_id>')
class UserResponseDetailByWeek(Resource):
    """Resource for managing User Responses by week."""

    @staticmethod
    @cross_origin(origins=allowedorigins())
    @auth.optional
    def get(engagement_id):
        """Fetch a user responses matching the provided engagement id."""
        try:
            user_response_record = UserResponseDetailService().get_response_count_by_created_week(engagement_id)

            if user_response_record:
                return user_response_record, HTTPStatus.OK

            return 'User Response was not found', HTTPStatus.INTERNAL_SERVER_ERROR
        except KeyError:
            return 'User Response was not found', HTTPStatus.INTERNAL_SERVER_ERROR
        except ValueError as err:
            return str(err), HTTPStatus.INTERNAL_SERVER_ERROR
