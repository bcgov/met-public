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
"""API endpoints for managing an engagement slug."""

from http import HTTPStatus

from flask import request
from flask_cors import cross_origin
from flask_restx import Namespace, Resource

from met_api.auth import auth
from met_api.services.engagement_slug_service import EngagementSlugService
from met_api.utils.util import allowedorigins, cors_preflight

API = Namespace('engagementslugs', description='Endpoints for Engagement Slug Management')


@cors_preflight('GET, PATCH, OPTIONS')
@API.route('/<slug>')
class Slug(Resource):
    """Resource for managing an engagement slug."""

    @staticmethod
    @cross_origin(origins=allowedorigins())
    def get(slug):
        """Fetch an engagement slug matching the provided slug."""
        try:
            engagement_slug = EngagementSlugService.get_engagement_slug(slug)
            return engagement_slug, HTTPStatus.OK
        except KeyError as err:
            return {'message': str(err)}, HTTPStatus.BAD_REQUEST
        except ValueError as err:
            return {'message': str(err)}, HTTPStatus.BAD_REQUEST

    @staticmethod
    @cross_origin(origins=allowedorigins())
    @auth.require
    def patch(slug):
        """Update an existing engagement slug."""
        try:
            engagement_id = request.json.get('engagement_id')
            engagement_slug = EngagementSlugService.update_engagement_slug(slug, engagement_id)
            return engagement_slug, HTTPStatus.OK
        except KeyError as err:
            return {'message': str(err)}, HTTPStatus.BAD_REQUEST
        except ValueError as err:
            return {'message': str(err)}, HTTPStatus.BAD_REQUEST


@API.route('/engagements/<engagement_id>')
class EngagementSlug(Resource):
    """Resource for managing an engagement slug."""

    @staticmethod
    @cross_origin(origins=allowedorigins())
    def get(engagement_id):
        """Fetch an engagement slug for a specific engagement."""
        try:
            engagement_slug = EngagementSlugService.get_engagement_slug_by_engagement_id(engagement_id)
            return engagement_slug, HTTPStatus.OK
        except KeyError as err:
            return {'message': str(err)}, HTTPStatus.BAD_REQUEST
        except ValueError as err:
            return {'message': str(err)}, HTTPStatus.BAD_REQUEST
