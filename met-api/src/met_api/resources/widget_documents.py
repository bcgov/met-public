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

from datetime import datetime
from flask import request
from flask_cors import cross_origin
from flask_restx import Namespace, Resource
from met_api.auth import auth
from met_api.exceptions.business_exception import BusinessException
from met_api.schemas.widget_documents import WidgetDocumentsSchema
from met_api.services.widget_documents_service import WidgetDocumentService
from met_api.utils.action_result import ActionResult
from met_api.utils.util import allowedorigins, cors_preflight
from met_api.utils.token_info import TokenInfo

API = Namespace('widgets_documents', description='Endpoints for Widget Document Management')
"""Widget Documents
"""


@cors_preflight('GET, POST, OPTIONS')
@API.route('')
class WidgetDocuments(Resource):
    """Resource for managing a Widget Documents."""

    @staticmethod
    @cross_origin(origins=allowedorigins())
    def get(widget_id):
        """Fetch a list of widgets by engagement_id."""
        try:
            documents = WidgetDocumentService().get_documents_by_widget_id(widget_id)
            return ActionResult.success(result=documents)
        except (KeyError, ValueError) as err:
            return ActionResult.error(str(err))

    @staticmethod
    @cross_origin(origins=allowedorigins())
    @auth.require
    def post(widget_id):
        """Add new documents to the widgets."""
        request_json = request.get_json()
        try:
            document = WidgetDocumentService.create_document(widget_id, request_json)
            return ActionResult.success(result=WidgetDocumentsSchema().dump(document))
        except BusinessException as err:
            return ActionResult.error(str(err))


@cors_preflight('PATCH, DELETE')
@API.route('/<document_id>')
class WidgetDocumentsChanges(Resource):
    """Resource for managing documents with documents widget."""

    @staticmethod
    @cross_origin(origins=allowedorigins())
    @auth.require
    def patch(widget_id, document_id):
        """Update saved documents."""
        request_json = request.get_json()
        try:
            document = WidgetDocumentService.edit_document(widget_id, document_id, request_json)
            return ActionResult.success(result=WidgetDocumentsSchema().dump(document))
        except BusinessException as err:
            return ActionResult.error(str(err))

    @staticmethod
    @cross_origin(origins=allowedorigins())
    @auth.require
    def delete(widget_id, document_id):
        """Remove folder from a document widget."""
        try:
            WidgetDocumentService().delete_document(widget_id, document_id)
            return ActionResult.success(widget_id, 'Document successfully removed')
        except (KeyError, ValueError) as err:
            return ActionResult.error(str(err))
