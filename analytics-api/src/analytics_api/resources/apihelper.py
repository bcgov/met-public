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
"""Meta information about the service.

to support swagger on http
"""
from flask import url_for
from flask_restx import Api as BaseApi
from flask_restx.apidoc import apidoc


class Api(BaseApi):
    """Monkey patch Swagger API to return HTTPS URLs."""

    @property
    def specs_url(self):
        """Return URL for endpoint."""
        scheme = 'http' if '5001' in self.base_url else 'https'
        return url_for(self.endpoint('specs'), _external=True, _scheme=scheme)


# Make a global change setting the URL prefix for the swaggerui at the module level
# This solves the issue where the swaggerui does not pick up the url prefix
apidoc.url_prefix = '/api/'
