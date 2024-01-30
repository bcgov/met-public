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
"""Exposes all of the resource endpoints mounted in Flask-Blueprint style.

Uses restplus namespaces to mount individual api endpoints into the service.

All services have 2 defaults sets of endpoints:
 - ops
 - meta
That are used to expose operational health information about the service, and meta information.
"""

from flask import Blueprint

from .apihelper import Api
from .comment import API as COMMENT_API
from .contact import API as CONTACT_API
from .document import API as DOCUMENT_API
from .email_verification import API as EMAIL_VERIFICATION_API
from .engagement import API as ENGAGEMENT_API
from .engagement_metadata import API as ENGAGEMENT_METADATA_API
from .metadata_taxon import API as METADATA_TAXON_API
from .engagement_members import API as ENGAGEMENT_MEMBERS_API
from .feedback import API as FEEDBACK_API
from .submission import API as SUBMISSION_API
from .subscription import API as SUBSCRIPTION_API
from .survey import API as SURVEY_API
from .staff_user import API as USER_API
from .value_component import API as VALUE_COMPONENTS_API
from .widget import API as WIDGET_API
from .widget_documents import API as WIDGET_DOCUMENTS_API
from .widget_events import API as WIDGET_EVENTS_API
from .widget_subscribe import API as WIDGET_SUBSCRIBE_API
from .widget_map import API as WIDGET_MAPS_API
from .shape_file import API as SHAPEFILE_API
from .tenant import API as TENANT_API
from .engagement_slug import API as ENGAGEMENT_SLUG_API
from .report_setting import API as REPORT_SETTING_API
from .widget_video import API as WIDGET_VIDEO_API
from .engagement_settings import API as ENGAGEMENT_SETTINGS_API
from .cac_form import API as CAC_FORM_API
from .widget_timeline import API as WIDGET_TIMELINE_API
from .widget_poll import API as WIDGET_POLL_API

__all__ = ('API_BLUEPRINT',)

URL_PREFIX = '/api/'
API_BLUEPRINT = Blueprint('API', __name__, url_prefix=URL_PREFIX)

API = Api(
    API_BLUEPRINT,
    title='MET API',
    version='1.0',
    description='The Core API for MET'
)

# HANDLER = ExceptionHandler(API)

API.add_namespace(ENGAGEMENT_API)
API.add_namespace(USER_API)
API.add_namespace(DOCUMENT_API)
API.add_namespace(SURVEY_API)
API.add_namespace(SUBMISSION_API)
API.add_namespace(SUBSCRIPTION_API)
API.add_namespace(COMMENT_API)
API.add_namespace(EMAIL_VERIFICATION_API)
API.add_namespace(FEEDBACK_API)
API.add_namespace(WIDGET_API)
API.add_namespace(CONTACT_API)
API.add_namespace(VALUE_COMPONENTS_API)
API.add_namespace(SHAPEFILE_API)
API.add_namespace(TENANT_API)
API.add_namespace(METADATA_TAXON_API, path='/tenants/<string:tenant_name>/metadata')
API.add_namespace(ENGAGEMENT_METADATA_API, path='/engagements/<int:engagement_id>/metadata')
API.add_namespace(ENGAGEMENT_MEMBERS_API, path='/engagements/<string:engagement_id>/members')
API.add_namespace(WIDGET_DOCUMENTS_API, path='/widgets/<string:widget_id>/documents')
API.add_namespace(WIDGET_EVENTS_API, path='/widgets/<int:widget_id>/events')
API.add_namespace(WIDGET_SUBSCRIBE_API, path='/widgets/<int:widget_id>/subscribe')
API.add_namespace(WIDGET_MAPS_API, path='/widgets/<int:widget_id>/maps')
API.add_namespace(ENGAGEMENT_SLUG_API, path='/slugs')
API.add_namespace(REPORT_SETTING_API, path='/surveys/<int:survey_id>/reportsettings')
API.add_namespace(WIDGET_VIDEO_API, path='/widgets/<int:widget_id>/videos')
API.add_namespace(ENGAGEMENT_SETTINGS_API)
API.add_namespace(CAC_FORM_API, path='/engagements/<int:engagement_id>/cacform')
API.add_namespace(WIDGET_TIMELINE_API, path='/widgets/<int:widget_id>/timelines')
API.add_namespace(WIDGET_POLL_API, path='/widgets/<int:widget_id>/polls')
