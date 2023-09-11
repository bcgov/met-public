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
"""API endpoints for managing a cac form submission resource."""
from http import HTTPStatus

from flask import request
from flask_cors import cross_origin
from flask_restx import Namespace, Resource

from met_api.exceptions.business_exception import BusinessException
from met_api.services.cac_form_service import CACFormService
from met_api.utils.util import allowedorigins, cors_preflight


API = Namespace('cac_form_submissions', description='Endpoints for CAC Form Submissions')
"""CAC Form submissions"""


@cors_preflight('POST, OPTIONS')
@API.route('/<int:widget_id>')
class CACForm(Resource):
    """Resource for managing cac form submissions."""

    @staticmethod
    @cross_origin(origins=allowedorigins())
    def post(engagement_id, widget_id):
        """Create cac form submission."""
        try:
            form_data = request.get_json()
            cac_form_submission = CACFormService().create_form_submission(engagement_id, widget_id, form_data)
            return cac_form_submission, HTTPStatus.OK
        except BusinessException as err:
            return str(err), err.status_code
        except ValueError as err:
            return str(err), HTTPStatus.BAD_REQUEST
        except KeyError as err:
            return str(err), HTTPStatus.BAD_REQUEST
