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

"""Tests to assure the Notification utilities.

Test-Suite to ensure that the Notification methods are working as expected.
"""

import pytest

from met_api.utils import notification


@pytest.mark.parametrize('test_input_email,expected',
                         [('helo@gw.com', True), ('helo', False), (None, False), ('', False)])
def test_is_valid_email(test_input_email, expected):
    """Assert that the valid email method works well.."""
    assert notification.is_valid_email(test_input_email) == expected
