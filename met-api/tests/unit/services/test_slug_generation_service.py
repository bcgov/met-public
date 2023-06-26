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
"""Tests for the Slug Generation Service.

Test suite to ensure that the Slug Generation Service is generating as expected.
"""

import pytest
from met_api.services.slug_generation_service import SlugGenerationService


@pytest.fixture
def slug_fixture():
    """Fixture providing input texts and their expected slug values."""
    return [
        ('Broadway Subway Project', 'broadway-subway-project'),
        ('Hello, World!', 'hello-world'),
        ('  Testing  123  ', 'testing-123'),
        ('ALL CAPS TEXT', 'all-caps-text'),
    ]


def test_generate_slug(slug_fixture):
    """
    Test the generate_slug function of SlugGenerationService.

    The test verifies that the generated slug matches the expected slug for each input text.

    Args:
        slug_fixture: A fixture providing input texts and their expected slug values.
    """
    for text, expected_slug in slug_fixture:
        generated_slug = SlugGenerationService.generate_slug(text)
        assert generated_slug == expected_slug
