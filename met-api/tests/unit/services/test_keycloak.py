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

"""Tests to assure the Keycloak Service.

Test-Suite to ensure that the Keycloak Service is working as expected.
"""
import pytest
import requests
from met_api.services.keycloak import KeycloakService
from unittest.mock import patch


KEYCLOAK_GET_REQUEST = 'met_api.services.keycloak.requests.get'
KEYCLOAK_POST_REQUEST = 'met_api.services.keycloak.requests.post'
KEYCLOAK_DEL_REQUEST = 'met_api.services.keycloak.requests.delete'
KEYCLOAK_SERVICE = KeycloakService()


@pytest.fixture()
def mock_admin_token():
    """Fixture to mock _get_admin_token method in all tests."""
    with patch('met_api.services.keycloak.KeycloakService._get_admin_token', return_value='test_token') as _:
        yield


def setup_mock_response(status_code, content):
    """
    Set up mock responses for testing.

    :param status_code: HTTP status code for the mock response.
    :param content: Content of the mock response.
    :return: A requests.Response object with specified status code and content.
    """
    mock_response = requests.Response()
    mock_response.status_code = status_code
    mock_response._content = content.encode()
    return mock_response


@patch(KEYCLOAK_GET_REQUEST)
def test_get_user_roles(mock_get, mock_admin_token):
    """Test for get_user_roles Method."""
    # Setup mock responses
    mock_response = setup_mock_response(200, '{"data": [{"name": "client-role", "composite": false}]}')
    mock_get.return_value = mock_response

    # Call the method
    user_roles = KEYCLOAK_SERVICE.get_user_roles('user123')

    # Assertions
    mock_get.assert_called_once()
    expected_roles = {'data': [{'name': 'client-role', 'composite': False}]}
    assert user_roles == expected_roles


@patch(KEYCLOAK_GET_REQUEST)
def test_get_users_roles(mock_get, mock_admin_token):
    """Test for get_users_roles Method."""
    # Setup mock responses
    user_ids = ['user123', 'user456']
    responses = {
        'user123': setup_mock_response(200, '{"data": [{"name": "role1"}, {"name": "role2"}]}'),
        'user456': setup_mock_response(200, '{"data": [{"name": "role3"}]}'),
    }
    mock_get.side_effect = lambda url, headers, timeout: responses[url.split('/')[-2]]

    # Call the method
    roles = KEYCLOAK_SERVICE.get_users_roles(user_ids)

    # Assertions
    assert mock_get.call_count == 2
    expected_roles = {'user123': ['role1', 'role2'], 'user456': ['role3']}
    assert roles == expected_roles


@patch(KEYCLOAK_POST_REQUEST)
def test_get_admin_token(mock_post):
    """Test for _get_admin_token Method."""
    # Setup mock response
    mock_response = setup_mock_response(200, '{"access_token": "test_admin_token"}')
    mock_post.return_value = mock_response

    # Call the method
    token = KEYCLOAK_SERVICE._get_admin_token()

    # Assertions
    mock_post.assert_called_once()
    assert token == 'test_admin_token'


@patch(KEYCLOAK_POST_REQUEST)
def test_assign_composite_role_to_user(mock_post, mock_admin_token):
    """Test for assign_composite_role_to_user Method."""
    # Setup mock responses
    mock_response = setup_mock_response(201, '')
    mock_post.return_value = mock_response

    # Call the method
    KEYCLOAK_SERVICE.assign_composite_role_to_user('user123', 'test_role')

    # Assertions
    mock_post.assert_called_once()


@patch(KEYCLOAK_DEL_REQUEST)
def test_remove_composite_role_from_user(mock_delete, mock_admin_token):
    """Test for remove_composite_role_from_user Method."""
    # Setup mock responses
    mock_response = setup_mock_response(204, '')
    mock_delete.return_value = mock_response

    # Call the method
    KEYCLOAK_SERVICE.remove_composite_role_from_user('user123', 'test_role')

    # Assertions
    mock_delete.assert_called_once()


@patch('met_api.services.keycloak.KeycloakService.assign_composite_role_to_user')
@patch('met_api.services.keycloak.KeycloakService.remove_composite_role_from_user')
@patch(KEYCLOAK_GET_REQUEST)
def test_toggle_user_enabled_status(mock_get, mock_remove_role, mock_assign_role, mock_admin_token):
    """Test for toggle_user_enabled_status Method."""
    # Setup mock responses
    mock_response = setup_mock_response(200, '{"data": [{"name": "IT_VIEWER"}]}')
    mock_get.return_value = mock_response

    # Call the method - enable user
    KEYCLOAK_SERVICE.toggle_user_enabled_status('user123', True)

    # Assertions for enabling user
    mock_assign_role.assert_called_once()

    # Call the method - disable user
    KEYCLOAK_SERVICE.toggle_user_enabled_status('user123', False)

    # Assertions for disabling user
    mock_remove_role.assert_called_once()
