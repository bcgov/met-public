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
"""Constants of engagement content type.

Each value in this corresponds to a specific section or content element.
"""
from enum import Enum, IntEnum


class EngagementContentType(IntEnum):
    """Enum of engagement content type."""

    Summary = 1
    Custom = 2


class EngagementContentDefaultValues(Enum):
    """Default enum of engagement content type."""

    Title = 'Summary'
    Icon = 'faRectangleList'
    Type = 'Summary'
