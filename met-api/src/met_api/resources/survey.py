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
"""API endpoints for managing an survey resource."""

from http import HTTPStatus

from flask import request
from flask_cors import cross_origin
from flask_restx import Namespace, Resource

from met_api.auth import auth
from met_api.auth import jwt as _jwt
from met_api.models.pagination_options import PaginationOptions
from met_api.schemas.survey import SurveySchema
from met_api.services.survey_service import SurveyService
from met_api.utils.roles import Role
from met_api.utils.token_info import TokenInfo
from met_api.utils.util import allowedorigins, cors_preflight


API = Namespace('surveys', description='Endpoints for Survey Management')
"""Custom exception messages
"""


@cors_preflight('GET,OPTIONS')
@API.route('/<survey_id>')
class Survey(Resource):
    """Resource for managing a single survey."""

    @staticmethod
    @cross_origin(origins=allowedorigins())
    @auth.optional
    def get(survey_id):
        """Fetch a single survey matching the provided id."""
        try:
            user_id = TokenInfo.get_id()
            if user_id:
                # authenticated users have access to any survey/engagement status
                survey_record = SurveyService().get(survey_id)
            else:
                survey_record = SurveyService().get_open(survey_id)
            if survey_record:
                return survey_record, HTTPStatus.OK

            return 'Survey was not found', HTTPStatus.INTERNAL_SERVER_ERROR
        except KeyError:
            return 'Survey was not found', HTTPStatus.INTERNAL_SERVER_ERROR
        except ValueError as err:
            return str(err), HTTPStatus.INTERNAL_SERVER_ERROR


@cors_preflight('GET, POST, PUT, OPTIONS')
@API.route('/')
class Surveys(Resource):
    """Resource for managing surveys."""

    @staticmethod
    @_jwt.requires_auth
    @cross_origin(origins=allowedorigins())
    def get():
        """Fetch surveys."""
        try:
            user_id = TokenInfo.get_id()
            args = request.args

            pagination_options = PaginationOptions(
                page=args.get('page', None, int),
                size=args.get('size', None, int),
                sort_key=args.get('sort_key', 'survey.name', str),
                sort_order=args.get('sort_order', 'asc', str),
            )

            survey_records = SurveyService()\
                .get_surveys_paginated(
                    pagination_options,
                    args.get('search_text', '', str),
                    args.get('unlinked', False, bool),
                    user_id,
                    args.get('exclude_hidden', False, bool),
            )
            return survey_records, HTTPStatus.OK
        except ValueError as err:
            return str(err), HTTPStatus.INTERNAL_SERVER_ERROR

    @staticmethod
    @_jwt.has_one_of_roles([Role.CREATE_SURVEY.value])
    @cross_origin(origins=allowedorigins())
    def post():
        """Create a new survey."""
        try:
            user_id = TokenInfo.get_id()
            requestjson = request.get_json()
            survey_schema = SurveySchema().load(requestjson)
            survey_schema['created_by'] = user_id
            survey_schema['updated_by'] = user_id
            result = SurveyService().create(survey_schema)
            survey_schema['id'] = result.identifier
            return survey_schema, HTTPStatus.OK
        except KeyError as err:
            return str(err), HTTPStatus.INTERNAL_SERVER_ERROR
        except ValueError as err:
            return str(err), HTTPStatus.INTERNAL_SERVER_ERROR

    @staticmethod
    @cross_origin(origins=allowedorigins())
    @_jwt.requires_auth
    def put():
        """Update a existing survey."""
        try:
            requestjson = request.get_json()
            survey_schema = SurveySchema().load(requestjson)
            user_id = TokenInfo.get_id()
            survey_schema['updated_by'] = user_id
            SurveyService().update(survey_schema)
            return survey_schema, HTTPStatus.OK
        except KeyError as err:
            return str(err), HTTPStatus.INTERNAL_SERVER_ERROR
        except ValueError as err:
            return str(err), HTTPStatus.INTERNAL_SERVER_ERROR


@cors_preflight('PUT,OPTIONS')
@API.route('/<survey_id>/link/engagement/<engagement_id>')
class SurveyLink(Resource):
    """Resource for linking a single survey to an engagement."""

    @staticmethod
    @cross_origin(origins=allowedorigins())
    @_jwt.requires_auth
    def put(survey_id, engagement_id):
        """Update survey to be linked with engagement."""
        try:

            result = SurveyService().link(survey_id, engagement_id)

            if result.success:
                return 'Survey successfully linked', HTTPStatus.OK

            return 'Error occurred while linking survey to engagement', HTTPStatus.INTERNAL_SERVER_ERROR
        except KeyError as err:
            return str(err), HTTPStatus.INTERNAL_SERVER_ERROR
        except ValueError as err:
            return str(err), HTTPStatus.INTERNAL_SERVER_ERROR


@cors_preflight('DELETE, OPTIONS')
@API.route('/<survey_id>/unlink/engagement/<engagement_id>')
class SurveyUnlink(Resource):
    """Resource for linking a single survey to an engagement."""

    @staticmethod
    @cross_origin(origins=allowedorigins())
    @_jwt.requires_auth
    def delete(survey_id, engagement_id):
        """Update survey to be unlinked to an engagement."""
        try:

            result = SurveyService().unlink(survey_id, engagement_id)

            if result.success:
                return 'Survey successfully unlinked', HTTPStatus.OK

            return 'Error occurred while unlinking survey from engagement', HTTPStatus.INTERNAL_SERVER_ERROR
        except KeyError as err:
            return str(err), HTTPStatus.INTERNAL_SERVER_ERROR
        except ValueError as err:
            return str(err), HTTPStatus.INTERNAL_SERVER_ERROR
