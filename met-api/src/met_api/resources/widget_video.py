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
"""API endpoints for managing a video widget resource."""
from http import HTTPStatus

from flask import request
from flask_cors import cross_origin
from flask_restx import Namespace, Resource

from met_api.auth import jwt as _jwt
from met_api.exceptions.business_exception import BusinessException
from met_api.schemas.widget_video import WidgetVideoSchema
from met_api.services.widget_video_service import WidgetVideoService
from met_api.utils.roles import Role
from met_api.utils.util import allowedorigins, cors_preflight


API = Namespace('widget_videos', description='Endpoints for Video Widget Management')
"""Widget Videos"""


@cors_preflight('GET, POST, PATCH, OPTIONS')
@API.route('')
class Video(Resource):
    """Resource for managing video widgets."""

    @staticmethod
    @cross_origin(origins=allowedorigins())
    def get(widget_id):
        """Get video widget."""
        try:
            widget_video = WidgetVideoService().get_video(widget_id)
            return WidgetVideoSchema().dump(widget_video), HTTPStatus.OK
        except BusinessException as err:
            return str(err), err.status_code

    @staticmethod
    @cross_origin(origins=allowedorigins())
    @_jwt.has_one_of_roles([Role.EDIT_ENGAGEMENT.value])
    def post(widget_id):
        """Create video widget."""
        try:
            request_json = request.get_json()
            widget_video = WidgetVideoService().create_video(widget_id, request_json)
            return WidgetVideoSchema().dump(widget_video), HTTPStatus.OK
        except BusinessException as err:
            return str(err), err.status_code

    @staticmethod
    @cross_origin(origins=allowedorigins())
    @_jwt.has_one_of_roles([Role.EDIT_ENGAGEMENT.value])
    def patch(widget_id):
        """Update video widget."""
        request_json = request.get_json()
        try:
            widget_video = WidgetVideoService().update_video(widget_id, request_json)
            return WidgetVideoSchema().dump(widget_video), HTTPStatus.OK
        except BusinessException as err:
            return str(err), err.status_code
