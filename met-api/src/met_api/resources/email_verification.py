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
"""API endpoints for managing an email verification resource."""

from http import HTTPStatus

from flask import request
from flask_cors import cross_origin
from flask_restx import Namespace, Resource

from met_api.schemas.email_verification import EmailVerificationSchema
from met_api.services.email_verification_service import EmailVerificationService
from met_api.utils.util import allowedorigins, cors_preflight


API = Namespace('email_verification', description='Endpoints for Email Verification Management')
"""Custom exception messages
"""


@cors_preflight('GET, PUT, OPTIONS')
@API.route('/<token>')
class EmailVerification(Resource):
    """Resource for managing a single email verification."""

    @staticmethod
    # @TRACER.trace()
    @cross_origin(origins=allowedorigins())
    def get(token):
        """Fetch a email verification matching the provided token."""
        try:
            email_verification = EmailVerificationService().get_active(token)
            if email_verification:
                return email_verification, HTTPStatus.OK

            return 'Email verification not found', HTTPStatus.INTERNAL_SERVER_ERROR
        except KeyError:
            return 'Email verification not found', HTTPStatus.INTERNAL_SERVER_ERROR
        except ValueError as err:
            return str(err), HTTPStatus.INTERNAL_SERVER_ERROR

    @staticmethod
    # @TRACER.trace()
    @cross_origin(origins=allowedorigins())
    def put(token):
        """Fetch a email verification matching the provided token."""
        try:
            email_verification = EmailVerificationService().verify(token, None, None, None)
            if email_verification:
                return email_verification, HTTPStatus.OK
            return 'Email verification not found', HTTPStatus.NOT_FOUND
        except KeyError:
            return 'Email verification not found', HTTPStatus.NOT_FOUND
        except ValueError as err:
            return str(err), HTTPStatus.INTERNAL_SERVER_ERROR


@cors_preflight('POST, OPTIONS')
@API.route('/')
class EmailVerifications(Resource):
    """Resource for managing email verifications."""

    @staticmethod
    # @TRACER.trace()
    @cross_origin(origins=allowedorigins())
    def post():
        """Create a new email verification."""
        try:
            requestjson = request.get_json()
            email_verification = EmailVerificationSchema().load(requestjson)
            EmailVerificationService().create(email_verification)
            return {}, HTTPStatus.OK
        except KeyError as err:
            return str(err), HTTPStatus.INTERNAL_SERVER_ERROR
        except ValueError as err:
            return str(err), HTTPStatus.INTERNAL_SERVER_ERROR
