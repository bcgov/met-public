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
"""Tests for the Contact service.

Test suite to ensure that the Contact service routines are working as expected.
"""

from faker import Faker

from met_api.services.contact_service import ContactService
from tests.utilities.factory_scenarios import TestContactInfo, TestUserInfo


fake = Faker()
date_format = '%Y-%m-%d'


def test_create_contact(session):  # pylint:disable=unused-argument
    """Assert that a contact can be created."""
    contact_info = TestContactInfo.contact1
    user_id = TestUserInfo.user['id']

    contact_record = ContactService().create_contact(contact_info, user_id)

    # Assert that was created
    assert contact_record.name == contact_info.get('name')
    assert contact_record.title == contact_info.get('title')
    assert contact_record.email == contact_info.get('email')
    assert contact_record.phone_number == contact_info.get('phone_number')
    assert contact_record.address == contact_info.get('address')
    assert contact_record.bio == contact_info.get('bio')
