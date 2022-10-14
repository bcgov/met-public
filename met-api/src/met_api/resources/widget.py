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
"""API endpoints for managing an user resource."""

from flask import request
from flask_cors import cross_origin
from flask_restx import Namespace, Resource
from marshmallow import ValidationError

from met_api.auth import auth
from met_api.schemas.widget import WidgetSchema
from met_api.services.widget_service import WidgetService
from met_api.utils.action_result import ActionResult
from met_api.utils.util import allowedorigins, cors_preflight
from met_api.utils.token_info import TokenInfo


API = Namespace('widgets', description='Endpoints for Widget Management')
"""Custom exception messages
"""


@cors_preflight('GET,OPTIONS')
@API.route('/engagement/<engagement_id>')
class SurveySubmission(Resource):
    """Resource for managing a survey submissions."""

    @staticmethod
    @cross_origin(origins=allowedorigins())
    @auth.require
    def get(engagement_id):
        """Fetch a list of widgets by engagement_id."""
        args = request.args
        try:
            widgets = WidgetService().get_widgets_by_engagement_id(engagement_id, args.get('grouped_by_type', False, bool))
            return ActionResult.success(engagement_id, widgets)
        except KeyError:
            return ActionResult.error('No submissions not found')
        except ValueError as err:
            return ActionResult.error(str(err))

    @staticmethod
    # @TRACER.trace()
    @cross_origin(origins=allowedorigins())
    @auth.require
    def post(engagement_id):
        """Add new widgets for an engagement."""
        try:
            user_id = TokenInfo.get_id()
            requestjson = request.get_json()
            print(engagement_id)
            
            widgets = WidgetSchema(many=True).load(requestjson)
            for widget in widgets:
                widget['created_by'] = user_id
                widget['updated_by'] = user_id
                
            result = WidgetService().create_widgets_bulk(widgets)
            return ActionResult.success(result=result)
        except KeyError as err:
            return ActionResult.error(str(err))
        except ValueError as err:
            return ActionResult.error(str(err))
        except ValidationError as err:
            return ActionResult.error(str(err.messages))
        except AssertionError as err:
            return ActionResult.error(str(err))
