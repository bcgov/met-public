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
"""API endpoints for managing an engagement resource."""

from http import HTTPStatus

from flask_cors import cross_origin
from flask_restx import Namespace, Resource

from analytics_api.auth import auth
from analytics_api.services.engagement_service import EngagementService
from analytics_api.utils.util import allowedorigins, cors_preflight


API = Namespace('engagements', description='Endpoints for Engagements Management')
"""Custom exception messages
"""


@cors_preflight('GET,OPTIONS')
@API.route('/<engagement_id>')
class Engagement(Resource):
    """Resource for managing a single engagement."""

    @staticmethod
    @cross_origin(origins=allowedorigins())
    @auth.optional
    def get(engagement_id):
        """Fetch a single engagement matching the provided id."""
        try:
            engagement_record = EngagementService().get_engagement(engagement_id)

            if engagement_record:
                return engagement_record, HTTPStatus.OK

            return 'Engagement was not found', HTTPStatus.INTERNAL_SERVER_ERROR
        except KeyError:
            return 'Engagement was not found', HTTPStatus.INTERNAL_SERVER_ERROR
        except ValueError as err:
            return str(err), HTTPStatus.INTERNAL_SERVER_ERROR
