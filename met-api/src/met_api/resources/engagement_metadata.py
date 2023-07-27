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

from flask import request
from flask_cors import cross_origin
from flask_restx import Namespace, Resource
from marshmallow import ValidationError

from met_api.auth import auth
from met_api.auth import jwt as _jwt
from met_api.schemas.engagement_metadata import EngagementMetadataSchema
from met_api.services.engagement_metadata_service import EngagementMetadataService
from met_api.utils.roles import Role
from met_api.utils.token_info import TokenInfo
from met_api.utils.util import allowedorigins, cors_preflight


API = Namespace('engagementsmetadata', description='Endpoints for Engagement Metadata Management')
"""Custom exception messages
"""


@cors_preflight('GET,OPTIONS')
@API.route('/<engagement_id>')
class EngagementMetadata(Resource):
    """Resource for managing a single engagement."""

    @staticmethod
    @cross_origin(origins=allowedorigins())
    @auth.optional
    def get(engagement_id):
        """Fetch a single engagement metadata matching the provided id."""
        try:
            metadata_record = EngagementMetadataService().get_metadata(engagement_id)
            return metadata_record, HTTPStatus.OK
        except KeyError:
            return 'Engagement metadata was not found', HTTPStatus.INTERNAL_SERVER_ERROR
        except ValueError as err:
            return str(err), HTTPStatus.INTERNAL_SERVER_ERROR


@cors_preflight('POST, PATCH, OPTIONS')
@API.route('/')
class EngagementsMetadata(Resource):
    """Resource for managing engagements metadata."""

    @staticmethod
    @cross_origin(origins=allowedorigins())
    @_jwt.has_one_of_roles([Role.CREATE_ENGAGEMENT.value])
    def post():
        """Create a new engagement metadata."""
        try:
            requestjson = request.get_json()
            metadata_schema = EngagementMetadataSchema()
            metadata_model = EngagementMetadataService().create_metadata(requestjson)
            return metadata_schema.dump(metadata_model), HTTPStatus.OK
        except KeyError as err:
            return str(err), HTTPStatus.INTERNAL_SERVER_ERROR
        except ValueError as err:
            return str(err), HTTPStatus.INTERNAL_SERVER_ERROR
        except ValidationError as err:
            return str(err.messages), HTTPStatus.INTERNAL_SERVER_ERROR

    @staticmethod
    @cross_origin(origins=allowedorigins())
    @_jwt.requires_auth
    def patch():
        """Update saved engagement metadata partially."""
        try:
            requestjson = request.get_json()
            user_id = TokenInfo.get_id()
            requestjson['updated_by'] = user_id

            metadata_schema = EngagementMetadataSchema()
            metadata_schema.load(requestjson, partial=True)
            metadata = EngagementMetadataService().update_metadata(requestjson)

            return metadata_schema.dump(metadata), HTTPStatus.OK
        except KeyError as err:
            return str(err), HTTPStatus.INTERNAL_SERVER_ERROR
        except ValueError as err:
            return str(err), HTTPStatus.INTERNAL_SERVER_ERROR
        except ValidationError as err:
            return str(err.messages), HTTPStatus.INTERNAL_SERVER_ERROR
