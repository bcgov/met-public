# Copyright © 2019 Province of British Columbia
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
"""Endpoints to check and manage the health of the service."""

from flask_restx import Namespace, Resource, cors

API = Namespace('', description='API for Sending MET Notifications')


@API.route('/healthz')
class Health(Resource):
    """Determines if the service and required dependencies are still working.

    This could be thought of as a heartbeat for the service.
    """

    @staticmethod
    @cors.crossdomain(origin='*')
    def get():
        """Made it here..so its all fine."""
        return {'message': 'api is healthy'}, 200


@API.route('/readyz')
class Ready(Resource):
    """Determines if the service is ready to respond."""

    @staticmethod
    @cors.crossdomain(origin='*')
    def get():
        """Return a JSON object that identifies if the service is setupAnd ready to work."""
        # add a poll to the DB when called
        return {'message': 'api is ready'}, 200
