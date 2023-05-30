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

"""Tests to verify the User Service class.

Test-Suite to ensure that the UserService is working as expected.
"""
import pytest
from faker import Faker

from met_api.schemas.user import UserSchema
from met_api.services.user_service import UserService
from tests.utilities.factory_scenarios import TestUserInfo
from tests.utilities.factory_utils import factory_user_model, set_global_tenant

fake = Faker()


def test_getuser(client, jwt, session, ):  # pylint:disable=unused-argument
    """Assert that an user can be fetched."""
    user_details = factory_user_model()
    user: dict = UserService.get_user_by_external_id(user_details.external_id)
    assert user.get('external_id') == user_details.external_id


def test_create_user_invalid_without_external_id(client, jwt, session, ):  # pylint:disable=unused-argument
    """Assert that an user can be Created."""
    user_data: dict = TestUserInfo.user_public_1
    user_schema = UserSchema().load(user_data)
    with pytest.raises(ValueError) as exception:
        UserService().create_or_update_user(user_schema)
    assert exception is not None
    assert str(exception.value) == 'Some required fields are empty'


def test_create_user(client, jwt, session, ):  # pylint:disable=unused-argument
    """Assert that an user can be Created."""
    set_global_tenant()
    user_data: dict = TestUserInfo.user_public_1
    external_id = str(fake.random_number(digits=5))
    user_data['external_id'] = external_id
    user_schema = UserSchema().load(user_data)
    new_user = UserService().create_or_update_user(user_schema)
    assert new_user.external_id == external_id
    assert new_user.first_name == user_data['first_name']


def test_update_user_email(client, jwt, session, ):  # pylint:disable=unused-argument
    """Assert that an user can be Created."""
    user_details = factory_user_model()
    old_email = user_details.email_id
    user_id = user_details.id
    # verify existing details
    user: dict = UserService.get_user_by_external_id(user_details.external_id)
    assert user.get('email_id') == old_email
    assert user.get('id') == user_id

    new_user_data = {
        'email_id': fake.email(),
        'first_name': user_details.first_name,
        'last_name': user_details.last_name,
        'external_id': user_details.external_id,
    }
    user_schema = UserSchema().load(new_user_data)
    new_user = UserService().create_or_update_user(user_schema)

    # verify same user , but different email id
    assert new_user.external_id == user_details.external_id
    assert new_user.first_name == user_details.first_name
    assert new_user.id == user_details.id
    assert new_user.email_id == new_user_data.get('email_id')
