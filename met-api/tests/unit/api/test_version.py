# Copyright © 2019 Province of British Columbia
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

"""Tests to verify the Version API end-point.

Test-Suite to ensure that the /version endpoint is working as expected.
"""
import json
from http import HTTPStatus
from unittest.mock import patch


def test_get_version_default(client, session):  # pylint:disable=unused-argument
    """Assert that version endpoint returns default values when env vars not set."""
    rv = client.get('/api/version/')
    assert rv.status_code == HTTPStatus.OK

    data = json.loads(rv.data)
    assert 'commit' in data
    assert 'build_date' in data
    assert 'branch' in data
    assert 'version' in data
    assert 'commit_url' in data

    # Default values when env vars not set
    assert data['commit'] == 'unknown'
    assert data['build_date'] == 'unknown'
    assert data['branch'] == 'unknown'
    assert data['version'] == 'dev'
    assert data['commit_url'] is None


@patch('os.getenv')
def test_get_version_with_env_vars(mock_getenv, client, session):  # pylint:disable=unused-argument
    """Assert that version endpoint returns values from environment variables."""
    test_commit = 'abc123def456'
    test_date = '2025-11-14T12:00:00Z'
    test_branch = 'main'
    test_repo = 'https://github.com/bcgov/met-public'

    def getenv_side_effect(key, default=None):
        env_vars = {
            'MET_BUILD_COMMIT_HASH': test_commit,
            'MET_BUILD_DATE': test_date,
            'MET_BUILD_BRANCH': test_branch,
            'MET_GITHUB_REPO': test_repo,
        }
        return env_vars.get(key, default)

    mock_getenv.side_effect = getenv_side_effect

    rv = client.get('/api/version/')
    assert rv.status_code == HTTPStatus.OK

    data = json.loads(rv.data)
    assert data['commit'] == test_commit
    assert data['build_date'] == test_date
    assert data['branch'] == test_branch
    assert data['version'].startswith(test_commit[:7])
    assert data['commit_url'] == f'{test_repo}/commit/{test_commit}'
