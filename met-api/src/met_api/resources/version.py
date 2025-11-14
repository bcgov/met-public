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
"""Resource for managing version information."""
import os
from flask import jsonify
from flask_restx import Namespace, Resource
from met_api.utils.util import cors_preflight


API = Namespace('version', description='Version endpoints')


@cors_preflight('GET')
@API.route('/')
class Version(Resource):
    """Resource for returning version information."""

    @staticmethod
    def get():
        """Return version information including commit hash."""
        commit_hash = os.getenv('MET_BUILD_COMMIT_HASH', 'unknown')
        build_date = os.getenv('MET_BUILD_DATE', 'unknown')
        branch = os.getenv('MET_BUILD_BRANCH', 'unknown')
        repo_url = os.getenv('MET_GITHUB_REPO', 'https://github.com/bcgov/met-public')
        
        return jsonify({
            'commit': commit_hash,
            'build_date': build_date,
            'branch': branch,
            'version': f'{commit_hash[:7]}' if commit_hash != 'unknown' else 'dev',
            'commit_url': f'{repo_url}/commit/{commit_hash}' if commit_hash != 'unknown' else None,
        })
