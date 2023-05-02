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
"""API endpoints to get counts for dashboard."""

from http import HTTPStatus

from flask import jsonify, request
from flask_cors import cross_origin
from flask_restx import Namespace, Resource

from analytics_api.auth import auth
from analytics_api.services.aggregator_service import AggregatorService
from analytics_api.utils.util import allowedorigins, cors_preflight


API = Namespace('counts', description='Endpoints for Counts')
"""Custom exception messages
"""


@cors_preflight('GET,OPTIONS')
@API.route('/')
class Counter(Resource):
    """Resource for managing counts."""

    @staticmethod
    @cross_origin(origins=allowedorigins())
    @auth.optional
    def get():
        """Fetch count of records for engagement matching the provided id."""
        try:
            args = request.args

            counts = jsonify(
                {'key': 'total_count',
                 'value': AggregatorService().get_count(args.get('engagement_id', 0, int),
                                                        args.get('count_for', '', str))})

            if counts:
                return counts, HTTPStatus.OK

            return 'Engagement was not found', HTTPStatus.INTERNAL_SERVER_ERROR
        except KeyError:
            return 'Engagement was not found', HTTPStatus.INTERNAL_SERVER_ERROR
        except ValueError as err:
            return str(err), HTTPStatus.INTERNAL_SERVER_ERROR
