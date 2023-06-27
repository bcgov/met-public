# Copyright © 2021 Province of British Columbia
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

"""CORS pre-flight decorator.

A simple decorator to add the options method to a Request Class.
"""

import base64
import os
import re
import urllib

from enum import Enum


def cors_preflight(methods):
    """Render an option method on the class."""

    def wrapper(f):
        def options(self, *args, **kwargs):  # pylint: disable=unused-argument
            return {'Allow': 'GET, DELETE, PUT, POST'}, 200, \
                   {
                       'Access-Control-Allow-Origin': '*',
                       'Access-Control-Allow-Methods': methods,
                       'Access-Control-Allow-Headers': 'Authorization, Content-Type, registries-trace-id, '
                                                       'invitation_token'}

        setattr(f, 'options', options)
        return f

    return wrapper


def allowedorigins():
    """Return allowed origin."""
    _allowedcors = os.getenv('CORS_ORIGIN')
    allowedcors = []
    if _allowedcors and ',' in _allowedcors:
        for entry in re.split(',', _allowedcors):
            allowedcors.append(entry)
    return allowedcors


def escape_wam_friendly_url(param):
    """Return encoded/escaped url."""
    base64_org_name = base64.b64encode(bytes(param, encoding='utf-8')).decode('utf-8')
    encode_org_name = urllib.parse.quote(base64_org_name, safe='')
    return encode_org_name


class FormIoComponentType(Enum):
    """FormIO Component Types."""

    RADIO = 'simpleradios'
    CHECKBOX = 'simplecheckboxes'
    SELECTLIST = 'simpleselect'
    SURVEY = 'simplesurvey'
    TEXT = 'simpletextarea'


class ContentType(Enum):
    """Http Content Types."""

    JSON = 'application/json'
    FORM_URL_ENCODED = 'application/x-www-form-urlencoded'
    PDF = 'application/pdf'
