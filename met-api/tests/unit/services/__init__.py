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
"""Test-Suite for all the Service Layer."""
import pytest

from tests.utilities.factory_utils import set_global_tenant


@pytest.fixture(autouse=True)
def run_around_tests():
    """Set up method for before and after every test."""
    # Code that will run before your test, for example:
    set_global_tenant()
    # A test function will be run at this point
    yield
    # Code that will run after your test, for example:
