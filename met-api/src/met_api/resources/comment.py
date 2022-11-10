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
"""API endpoints for managing an comment resource."""

from flask import request
from flask_cors import cross_origin
from flask_restx import Namespace, Resource

from met_api.auth import auth
from met_api.models.pagination_options import PaginationOptions
from met_api.services.comment_service import CommentService
from met_api.utils.action_result import ActionResult
from met_api.utils.token_info import TokenInfo
from met_api.utils.util import allowedorigins, cors_preflight


API = Namespace('comments', description='Endpoints for Comments Management')
"""Custom exception messages
"""


@cors_preflight('GET, PUT, OPTIONS')
@API.route('/<comment_id>')
class Comment(Resource):
    """Resource for managing a single comment."""

    @staticmethod
    @cross_origin(origins=allowedorigins())
    @auth.require
    def get(comment_id):
        """Fetch a single comment matching the provided id."""
        try:
            comment_record = CommentService().get_comment(comment_id)

            if comment_record:
                return ActionResult.success(comment_id, comment_record)

            raise KeyError('comment record is None')
        except KeyError:
            return ActionResult.error('Comment was not found')
        except ValueError as err:
            return ActionResult.error(str(err))


@cors_preflight('GET, OPTIONS')
@API.route('/survey/<survey_id>')
class SurveyComments(Resource):
    """Resource for managing multiple comments."""

    @staticmethod
    @cross_origin(origins=allowedorigins())
    @auth.optional
    def get(survey_id):
        """Get comments page."""
        try:
            user_id = TokenInfo.get_id()
            args = request.args

            pagination_options = PaginationOptions(
                page=args.get('page', None, int),
                size=args.get('size', None, int),
                sort_key=args.get('sort_key', 'name', str),
                sort_order=args.get('sort_order', 'asc', str),
            )
            comment_records = CommentService()\
                .get_comments_paginated(
                    user_id,
                    survey_id,
                    pagination_options,
                    args.get('search_text', '', str),
            )
            return ActionResult.success(result=comment_records)
        except ValueError as err:
            return ActionResult.error(str(err))
