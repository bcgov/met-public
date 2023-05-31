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
"""API endpoints for managing survey result."""

from http import HTTPStatus

from flask import jsonify
from flask_cors import cross_origin
from flask_restx import Namespace, Resource

from analytics_api.auth import auth
from analytics_api.services.survey_result import SurveyResultService
from analytics_api.utils.util import allowedorigins, cors_preflight


API = Namespace('surveyresult', description='Endpoints for Survey result Management')
"""Custom exception messages
"""


@cors_preflight('GET,OPTIONS')
@API.route('/<engagement_id>')
class SurveyResult(Resource):
    """Resource for managing a survey result for single engagement."""

    @staticmethod
    @cross_origin(origins=allowedorigins())
    @auth.optional
    def get(engagement_id):
        """Fetch survey result for a single engagement id."""
        try:
            survey_result_record = SurveyResultService().get_survey_result(engagement_id)

            if survey_result_record:
                return jsonify(data=survey_result_record), HTTPStatus.OK

            return 'Engagement was not found', HTTPStatus.NOT_FOUND
        except KeyError:
            return 'Engagement was not found', HTTPStatus.INTERNAL_SERVER_ERROR
        except ValueError as err:
            return str(err), HTTPStatus.INTERNAL_SERVER_ERROR
