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
from .engagement import API as ENGAGEMENT_API
from .user import API as USER_API
from .document import API as DOCUMENT_API
from .survey import API as SURVEY_API
from .submission import API as SUBMISSION_API
from .email_verification import API as EMAIL_VERIFICATION_API

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
API.add_namespace(EMAIL_VERIFICATION_API)
