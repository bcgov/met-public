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
"""API endpoints for managing a subscription resource."""

from http import HTTPStatus

from flask import request
from flask_cors import cross_origin
from flask_restx import Namespace, Resource

from met_api.schemas.subscription import SubscriptionSchema
from met_api.services.subscription_service import SubscriptionService
from met_api.utils.util import allowedorigins, cors_preflight


API = Namespace('subscription', description='Endpoints for Subscription Management')
"""Custom exception messages
"""


@cors_preflight('GET, OPTIONS')
@API.route('/<user_id>')
class Subscription(Resource):
    """Resource for managing subscription."""

    @staticmethod
    # @TRACER.trace()
    @cross_origin(origins=allowedorigins())
    def get(user_id):
        """Fetch a subscription matching the provided user id."""
        try:
            subscription = SubscriptionService().get(user_id)
            if subscription:
                return subscription, HTTPStatus.OK

            return 'Subscription not found', HTTPStatus.NOT_FOUND
        except KeyError:
            return 'Subscription not found', HTTPStatus.INTERNAL_SERVER_ERROR
        except ValueError as err:
            return str(err), HTTPStatus.INTERNAL_SERVER_ERROR


@cors_preflight('POST, PATCH, OPTIONS')
@API.route('/')
class Subscriptions(Resource):
    """Resource for managing subscription."""

    @staticmethod
    # @TRACER.trace()
    @cross_origin(origins=allowedorigins())
    def post():
        """Create a new subscription."""
        try:
            request_json = request.get_json()
            subscription = SubscriptionSchema().load(request_json)
            SubscriptionService().create_subscription(subscription)
            return {}, HTTPStatus.OK
        except KeyError as err:
            return str(err), HTTPStatus.INTERNAL_SERVER_ERROR
        except ValueError as err:
            return str(err), HTTPStatus.INTERNAL_SERVER_ERROR

    @staticmethod
    @cross_origin(origins=allowedorigins())
    def patch():
        """Update a existing subscription partially."""
        try:
            request_json = request.get_json()
            subscription = SubscriptionSchema().load(request_json, partial=True)
            SubscriptionService().update_subscription_for_user(subscription)
            return {}, HTTPStatus.OK
        except KeyError as err:
            return str(err), HTTPStatus.INTERNAL_SERVER_ERROR
        except ValueError as err:
            return str(err), HTTPStatus.INTERNAL_SERVER_ERROR


@cors_preflight('POST, OPTIONS')
@API.route('/manage')
class ManageSubscriptions(Resource):
    """Resource for managing subscription."""

    @staticmethod
    # @TRACER.trace()
    @cross_origin(origins=allowedorigins())
    def post():
        """Create or update a subscription."""
        try:
            request_json = request.get_json()
            subscription = SubscriptionSchema().load(request_json)
            SubscriptionService().create_or_update_subscription(subscription)
            return {}, HTTPStatus.OK
        except KeyError as err:
            return str(err), HTTPStatus.INTERNAL_SERVER_ERROR
        except ValueError as err:
            return str(err), HTTPStatus.INTERNAL_SERVER_ERROR
