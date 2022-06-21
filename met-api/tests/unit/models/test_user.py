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
"""Tests for the Org model.

Test suite to ensure that the Org model routines are working as expected.
"""

from met_api.models.user import User
from faker import Faker

fake = Faker()


def test_user_creation(session):
    """Assert that an user can be created and fetched."""
    name = fake.name()
    user = User(id=2, first_name=name, external_id='2')
    session.add(user)
    session.commit()
    assert user.id is not None
    user_in_db = User.get_user(user.id)
    assert user_in_db.first_name == name
