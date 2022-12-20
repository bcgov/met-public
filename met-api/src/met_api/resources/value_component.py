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
"""API endpoints for managing a value components resource."""

from http import HTTPStatus
from flask import jsonify
from flask_cors import cross_origin
from flask_restx import Namespace, Resource

from met_api.utils.util import allowedorigins, cors_preflight


API = Namespace('valuecomponents', description='Endpoints for Value Components Management')
"""Custom exception messages
"""


@cors_preflight('GET, POST, PUT, OPTIONS')
@API.route('/')
class GetEngagements(Resource):
    """Resource for managing all value components."""

    @staticmethod
    # @TRACER.trace()
    @cross_origin(origins=allowedorigins())
    # @auth.require
    def get():
        """Fetch all value components."""
        try:
            # TODO: Create service and models for value components
            vcs = [
                {
                    'id': 1,
                    'title': 'Marine Life',
                    'icon': 'fa-solid fa-shrimp',
                    'category': 'blue'
                },
                {
                    'id': 2,
                    'title': 'Visual Quality',
                    'icon': 'fa-regular fa-image',
                    'category': 'blue'
                },
                {
                    'id': 3,
                    'title': 'Health',
                    'icon': 'fa-solid fa-heart',
                    'category': 'red'
                },
                {
                    'id': 4,
                    'title': 'Fish',
                    'icon': 'fa-solid fa-fish',
                    'category': 'yellow'
                },
                {
                    'id': 5,
                    'title': 'Environment',
                    'icon': 'fa-brands fa-envira',
                    'category': 'yellow'
                },
                {
                    'id': 6,
                    'title': 'Trees',
                    'icon': 'fa-solid fa-tree',
                    'category': 'red'
                },
                {
                    'id': 7,
                    'title': 'Wildlife',
                    'icon': 'fa-solid fa-dove',
                    'category': 'blue'
                },
                {
                    'id': 8,
                    'title': 'Rights',
                    'icon': 'fa-solid fa-gavel',
                    'category': 'red'
                },
                {
                    'id': 9,
                    'title': 'Accidents',
                    'icon': 'fa-solid fa-triangle-exclamation',
                    'category': 'yellow'
                },
                {
                    'id': 10,
                    'custom_key': 'other',
                    'title': 'Other',
                    'icon': 'fa-solid fa-lightbulb',
                    'category': 'other',
                }
            ]
            return jsonify(vcs), HTTPStatus.OK
        except ValueError as err:
            return {'status': False, 'message': str(err)}, HTTPStatus.BAD_REQUEST
